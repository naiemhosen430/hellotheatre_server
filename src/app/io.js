import UserModel from "../modules/auth/auth.model.js";

const useIo = (io) => {
  io.on("connection", (socket) => {
    console.log("New user connected:", socket.id);

    // Host creates a room
    socket.on("create-room", async (username) => {
      try {
        // Update the user model to store the socket ID as room ID
        await UserModel.updateOne(
          { username },
          { $set: { roomid: socket.id } } // Store socket.id as roomid
        );

        // Join the room named after the username
        socket.join(username);

        // Retrieve updated user data (excluding sensitive fields)
        const roomData = await UserModel.findOne({ username }).select(
          "-friendrequests -sendrequests -block -email -password -verificationCode"
        );

        // Emit room creation event to only the room members
        io.to(username).emit("room-created", { roomData });

        // Log room creation event
        console.log(`${username} created a room with ID: ${socket.id}`);
      } catch (error) {
        console.error("Error creating room:", error);
        socket.emit("error", "Failed to create room");
      }
    });

    // Handle room closure
    socket.on("close-room", async (data) => {
      try {
        // Update the user model to clear the room ID
        await UserModel.updateOne(
          { _id: data?.userid },
          { $set: { roomid: "" } }
        );

        // Retrieve the updated user data (excluding sensitive fields)
        const roomData = await UserModel.findOne({ _id: data?.userid }).select(
          "-friendrequests -sendrequests -block -email -password -verificationCode"
        );

        // Notify the client about the room closure
        socket.emit("room-closed", { roomData });

        // Log the room closure
        console.log(`${roomData?.username} has closed the room`);

        // Optionally notify other users in the room about the closure
        socket.broadcast
          .to(roomData?.username)
          .emit("room-closed-notification", roomData?.username);
      } catch (error) {
        console.error("Error closing room:", error);
        socket.emit("error", "Failed to close room");
      }
    });

    // User joins a room
    socket.on("join-room", async ({ username }) => {
      console.log(1);
      try {
        const room = await UserModel.findOne({ username });
        console.log(room);
        if (room && room.roomid) {
          console.log(2);

          await UserModel.updateOne(
            { username },
            { $addToSet: { users: socket.id } } // Add socket.id to users array
          );
          socket.join(username);
          const roomData = await UserModel.findOne({ username }).select(
            "-friendrequests -sendrequests -block -email -password -verificationCode"
          );
          console.log(roomData);
          socket.emit("joined-room", { roomData });
          console.log(`User ${socket.id} joined room: ${username}`);
          // Notify host
          socket.to(username).emit("user-joined", socket.id);
        } else {
          socket.emit("roomNotFound");
        }
      } catch (error) {
        console.error("Error joining room:", error);
        socket.emit("error", "Failed to join room");
      }
    });

    // Handle WebRTC signaling
    socket.on("signal", (data) => {
      console.log(
        `Received signal from ${socket.id} for room: ${data.username}`
      );
      socket
        .to(data.username)
        .emit("signal", { signal: data.signal, id: socket.id });
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
          console.log(
            `User ${socket.id} disconnected from room: ${room.username}`
          );
          socket.to(room.username).emit("user-disconnected", socket.id);
        }
      } catch (error) {
        console.error("Error during disconnect:", error);
      }
    });
  });
};

export default useIo;
