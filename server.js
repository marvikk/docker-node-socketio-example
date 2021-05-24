import express from "express";
import path from "path";
import bodyParser from "body-parser";

const app = express();
const server = require("http").createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const PORT = 3000;
server.listen(PORT);
console.log("Server is running");

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.get('/', (req, res) => {
    res.render('index', { items: 5 });
});

// Socket IO
const connections = [];

io.sockets.on("connection", socket => {
    connections.push(socket);
    console.log(" %s sockets is connected", connections.length);

    socket.on("disconnect", () => {
        connections.splice(connections.indexOf(socket), 1);
    });

    socket.on("sending message", message => {
        console.log("Message is received :", message);

        io.sockets.emit("new message", { message: message });
    });
});

