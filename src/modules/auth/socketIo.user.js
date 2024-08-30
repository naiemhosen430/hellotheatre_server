const activeStatus = (io) => {
  io.on("connection", (client) => {
    console.log("someone connected");

    client.on("disconnect", () => {
      console.log("someone disconnected");
    });
  });
};

export default activeStatus;
