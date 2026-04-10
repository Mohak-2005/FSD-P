const registerSocketHandlers = (io) => {
  io.on("connection", (socket) => {
    socket.on("join_room", ({ listingId, userId1, userId2 }) => {
      const sorted = [userId1, userId2].sort((a, b) => Number(a) - Number(b));
      const room = `${listingId}_${sorted[0]}_${sorted[1]}`;
      socket.join(room);
    });

    socket.on("send_message", (payload) => {
      const { listingId, senderId, receiverId } = payload;
      const sorted = [senderId, receiverId].sort((a, b) => Number(a) - Number(b));
      const room = `${listingId}_${sorted[0]}_${sorted[1]}`;
      io.to(room).emit("receive_message", payload);
    });

    socket.on("typing", (payload) => {
      const { listingId, senderId, receiverId } = payload;
      const sorted = [senderId, receiverId].sort((a, b) => Number(a) - Number(b));
      const room = `${listingId}_${sorted[0]}_${sorted[1]}`;
      socket.to(room).emit("typing", payload);
    });

    socket.on("mark_read", (payload) => {
      const { listingId, senderId, receiverId } = payload;
      const sorted = [senderId, receiverId].sort((a, b) => Number(a) - Number(b));
      const room = `${listingId}_${sorted[0]}_${sorted[1]}`;
      io.to(room).emit("mark_read", payload);
    });
  });
};

module.exports = registerSocketHandlers;
