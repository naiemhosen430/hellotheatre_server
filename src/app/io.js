import { checkRoomAvailability } from "../modules/auth/auth.service.js";

const useIo = (io) => {
  io.on("connection", (socket) => {
    socket.on("joinRoom", async (roomName, username) => {
      console.log({ roomName, username });
      try {
        const { available } = await checkRoomAvailability(roomName);

        if (available) {
          // Room exists, allow the user to join
          socket.join(roomName);
          io.to(roomName).emit("userJoined", username);
          socket.emit("roomStatus", {
            success: true,
            message: "Joined room successfully",
          });
        } else {
          // Room does not exist, send an error message
          socket.emit("roomStatus", {
            success: false,
            message: "Room not available",
          });
        }
      } catch (error) {
        socket.emit("roomStatus", {
          success: false,
          message: "Error joining room",
        });
      }
    });

    // Handle signaling data
    socket.on("signal", (roomName, data) => {
      socket.to(roomName).emit("signal", data);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

export default useIo;
