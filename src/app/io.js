import UserModel from "../modules/auth/auth.model.js";

const useIo = (io) => {
  io.on("connection", (socket) => {
    // Host creates a room
    socket.on("create-room", async (username) => {
      try {
        // Update the user model to store the socket ID as room ID
        const mydata = await UserModel.findOne({ username }).select(
          "-friendrequests -sendrequests -block -email -password -verificationCode"
        );
        await UserModel.updateOne(
          { username, "users.user_id": { $ne: mydata?._id } },
          {
            $set: {
              roomid: socket.id,
            },
            $push: {
              users: { socket_id: socket.id, user_id: mydata?._id },
            },
          }
        );

        socket.join(username);

        // Retrieve updated user data (excluding sensitive fields)
        const roomData = await UserModel.findOne({ username }).select(
          "-friendrequests -sendrequests -block -email -password -verificationCode"
        );

        // Emit room creation event to only the room members
        io.to(username).emit("room-created", { roomData });

        console.log(`Room created: ${username} with ID ${socket.id}`);
      } catch (error) {
        console.error("Error creating room:", error);
        socket.emit("error", "Failed to create room");
      }
    });

    // Handle room closure
    socket.on("close-room", async (data) => {
      try {
        // Clear the room ID for the user
        await UserModel.updateOne(
          { _id: data?.userid },
          { $set: { roomid: "", users: [] } } // Clear roomid and users array
        );

        // Retrieve the updated user data (excluding sensitive fields)
        const roomData = await UserModel.findOne({ _id: data?.userid }).select(
          "-friendrequests -sendrequests -block -email -password -verificationCode"
        );

        // Notify the client about the room closure
        socket.emit("room-closed", { roomData });

        // Notify other users in the room about the closure
        socket.broadcast
          .to(roomData?.username)
          .emit("room-closed-notification", roomData?.username);

        console.log(`Room closed: ${roomData?.username}`);
      } catch (error) {
        console.error("Error closing room:", error);
        socket.emit("error", "Failed to close room");
      }
    });

    // Handle room leave
    socket.on("leave-room", async (data) => {
      if (!data?.username) {
        // Handle the case where username is missing in the request
        socket.emit("error", "Username is required to leave the room");
        return;
      }

      try {
        // Update the user model to remove the socket ID from users array
        await UserModel.updateOne(
          { username: data.username },
          { $pull: { users: { socket_id: socket.id } } }
        );

        // Notify the client about leaving the room
        socket.emit("you-left", {
          socket_id: socket.id,
          user_id: data?.user_id,
        });

        // Notify other users in the room about the departure
        socket.broadcast.to(data.username).emit("viewer-left", {
          socket_id: socket.id,
          user_id: data?.user_id,
        });

        // Leave the socket room
        socket.leave(data.username);

        console.log(`User ${socket.id} left room: ${data.username}`);
      } catch (error) {
        console.error("Error leaving room:", error);
        socket.emit("error", "Failed to leave the room");
      }
    });

    // User joins a room
    socket.on("join-room", async (data) => {
      try {
        const room = await UserModel.findOne({ username: data?.username });

        if (room && room.roomid) {
          // Add socket ID to users array
          await UserModel.updateOne(
            {
              username: data?.username,
              "users.user_id": { $ne: data?.user_id },
            },
            {
              $push: {
                users: { socket_id: socket.id, user_id: data?.user_id },
              },
            }
          );
          socket.join(data?.username);
          const roomData = await UserModel.findOne({
            username: data?.username,
          }).select(
            "-friendrequests -sendrequests -block -email -password -verificationCode"
          );
          socket.emit("joined-room", { roomData });
          // Notify host
          socket
            .to(data?.username)
            .emit("new-user", { socket_id: socket.id, user_id: data?.user_id });

          console.log(`User ${socket.id} joined room: ${data?.username}`);
        } else {
          socket.emit("roomNotFound");
        }
      } catch (error) {
        console.error("Error joining room:", error);
        socket.emit("error", "Failed to join room");
      }
    });

    socket.on("signal", (data) => {
      io.to(data.to).emit("signal", {
        from: socket.id,
        signal: data.signal,
      });
    });

    socket.on("message-sent", (data) => {
      console.log(data);
      io.to(data.to).emit("message-recieve", {
        from: data?.name,
        message: data.message,
      });
    });

    // Disconnect handling
    socket.on("disconnect", async () => {
      try {
        const room = await UserModel.findOne({ users: socket.id });
        if (room) {
          await UserModel.updateOne(
            { _id: room._id },
            { $pull: { users: socket.id } }
          );

          socket.to(room.username).emit("user-disconnected", socket.id);

          console.log(
            `User ${socket.id} disconnected from room: ${room.username}`
          );
        }
      } catch (error) {
        console.error("Error during disconnect:", error);
      }
    });
  });
};

export default useIo;
