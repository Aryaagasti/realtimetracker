const { log } = require("console");
const express = require("express");
const app = express();
const http = require("http");
const path = require("path");
const socketio = require("socket.io");

const server = http.createServer(app);
const io = socketio(server);

const clients = {};  // To keep track of connected clients and their unique IDs

io.on("connection", (socket) => {
    console.log("connected");

    socket.on("send-location", (data) => {
        const { latitude, longitude } = data;
        clients[socket.id] = { latitude, longitude };  // Store client's location

        // Broadcast the location data to all connected clients
        io.emit("receive-location", { id: socket.id, latitude, longitude });
    });

    socket.on("disconnect", () => {
        io.emit("user-disconnect", socket.id);
        delete clients[socket.id];
    });
});

// Middleware to serve static files
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("index");
});

const port = 3000;
server.listen(port, () => {
    console.log(`server running on port: ${port}`);
});
