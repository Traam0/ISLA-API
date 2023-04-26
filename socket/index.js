/** @format */

const io = require("socket.io")(6969, {
  cors: { origin: "http://localhost:5173" },
});

io.on("connection", (socket) => {
  console.log('a user has connected')
  console.log(socket);
});
