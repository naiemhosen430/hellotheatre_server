import UserModel from "../modules/auth/auth.model.js";

const useIo = (io) => {
  io.on("connection", (socket) => {
    console.log("New user connected:", socket.id);

    // User creates a room
    socket.on("create-room", async (username) => {
      try {
        // Create or update the room ID to track the host's connection
        await UserModel.updateOne(
          { username },
          { $set: { roomid: socket.id } } // Store socket.id as roomid
        );
        socket.join(username);
        socket.emit("room-created", { username });
        console.log(`${username} created a room with ID: ${socket.id}`);
      } catch (error) {
        console.error("Error creating room:", error);
        socket.emit("error", "Failed to create room");
      }
    });

    // User joins a room
    socket.on("join-room", async ({ username }) => {
      try {
        const room = await UserModel.findOne({ username });
        if (room && room.roomid) {
          // Add the user to the room's user list and join the socket room
          await UserModel.updateOne(
            { username },
            { $addToSet: { users: socket.id } } // Add socket.id to users array
          );
          socket.join(username);
          socket.emit("joined-room", { username });
          console.log(`User ${socket.id} joined room: ${username}`);

          // Notify other users in the room
          socket.to(username).emit("user-joined", socket.id);
        } else {
          socket.emit("error", "Room not found");
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
      socket.to(data.username).emit("signal", {
        signal: data.signal,
        id: socket.id, // Send the socket ID back so the receiver knows who it's from
      });
    });

    // User disconnects
    socket.on("disconnect", async () => {
      try {
        const room = await UserModel.findOne({ users: socket.id });
        if (room) {
          // Remove the user from the room's user list
          await UserModel.updateOne(
            { _id: room._id },
            { $pull: { users: socket.id } }
          );
          console.log(
            `User ${socket.id} disconnected from room: ${room.roomid}`
          );
          // Notify others in the room that this user has disconnected
          socket.to(room.roomid).emit("user-disconnected", socket.id);
        }
      } catch (error) {
        console.error("Error during disconnect:", error);
      }
    });
  });
};

export default useIo;
