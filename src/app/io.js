import UserModel from "../modules/auth/auth.model.js";
import { checkRoomAvailability } from "../modules/auth/auth.service.js";

const useIo = (io) => {
  io.on("connection", (socket) => {
    console.log("New user connected");

    // User creates a room
    socket.on("create-room", async (username) => {
      await UserModel.updateOne(
        { username },
        // { $addToSet: { users: socket.id } }
        { roomid: socket.id }
      );
      socket.join(username);
      socket.emit("room-created", { username });
    });

    // User joins a room
    socket.on("join-room", async ({ username }) => {
      const room = await UserModel.findOne({ username });
      if (room && room?.roomid) {
        await UserModel.updateOne(
          { username },
          { $addToSet: { users: socket.id } }
        );
        socket.join(username);
        socket.emit("joined-room", { username });

        // Notify other users in the room
        socket.to(username).emit("user-joined", socket.id);
      } else {
        socket.emit("error", "Theatre not found");
      }
    });

    // Handle WebRTC signaling
    socket.on("signal", (data) => {
      socket.to(data.username).emit("signal", {
        signal: data.signal,
        id: socket.id,
      });
    });

    // User disconnects
    socket.on("disconnect", async () => {
      const room = await UserModel.findOne({ users: socket.id });
      if (room) {
        await UserModel.updateOne(
          { _id: room._id },
          { $pull: { users: socket.id } }
        );
        socket.to(room.roomId).emit("user-disconnected", socket.id);
      }
    });
  });
};

export default useIo;
