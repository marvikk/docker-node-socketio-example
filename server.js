const express = require('express');
const app = express();
const path = require('path');
const expressLayouts = require('express-ejs-layouts');

const server = require("http").createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const PORT = 3000;
server.listen(PORT);
console.log("Server is running");

var stations = [{ id: 0, programmerName: "Peter Progger", operatorName: "Sam Smith" },
{ id: 1, programmerName: "", operatorName: "" },
{ id: 2, programmerName: "", operatorName: "" },
{ id: 3, programmerName: "", operatorName: "" }]

// Ejs Setup
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.urlencoded({ extended: false }));
// Folder Setup
app.use(express.static(path.join(__dirname, 'public')));
//Routs
app.get('', (req, res) => {
    res.render('index', { stations: stations });
});

app.post("/detail", function (req, res) {
    console.log(req.body);
    res.render("detail", {
        stationId: req.body.station
    });
});

app.get("/detail/:stationId", function (req, res) { // user route
    var data = req.params.stationId;
    res.render("detail", {
        stationId: data
    });
});

// Socket IO
const connections = [];

io.sockets.on("connection", socket => {
    connections.push(socket);
    console.log(" %s sockets is connected", connections.length);
    //io.sockets.emit()

    socket.on("disconnect", () => {
        connections.splice(connections.indexOf(socket), 1);
    });

    socket.on("sending message", message => {
        //  console.log("Message is received :", message);

        io.sockets.emit("new message", { stationData: message });
    });

    socket.on("detail form submitted", formData => {
        console.log('this is my form data')
        console.log(formData);
        io.sockets.emit("repopulate with submitted data", { submittedData: formData });
    });
});

