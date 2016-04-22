module.exports = function(io) {
    // socket.io events
    io.on("connection", function(socket) {
        console.log("A user connected");
    });
}