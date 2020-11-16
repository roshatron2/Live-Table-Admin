const express = require("express"),
  app = express(),
  mongoose = require("mongoose"),
  bodyParser = require("body-parser"),
  Pusher = require("pusher"),
  Tables = require("./models/table");

// mongoose.set("debug", true);
const pusher = new Pusher({
  appId: "1087125",
  key: "dcd64014e1046476f2ed",
  secret: "90f6317e3dcef4d84559",
  cluster: "ap2",
});

const uri =
  "mongodb+srv://roshatron:roshatron@cluster0.nw9vx.mongodb.net/Open_Table?retryWrites=true&w=majority";
// const uri = "mongodb://localhost/open_table";

try {
  mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
} catch (error) {
  handleError(error);
  console.log(error.message);
}
mongoose.Promise = Promise;
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/views"));

app.get("/", (req, res) => {
  res.sendFile("index.html");
});

app.get("/tables", (req, res) => {
  Tables.find()
    .then((tables) => {
      res.json(tables);
    })
    .catch((err) => {
      res.send(err);
    });
});

app.get("/tables/:id", (req, res) => {
  Tables.findById(req.params.id)
    .then((table) => {
      res.json(table);
    })
    .catch((err) => {
      res.send(err);
    });
});

app.post("/tables", (req, res) => {
  console.log(req.body);
  Tables.create(req.body)
    .then((table) => {
      res.json(table);
    })
    .catch((err) => {
      res.send(err.message);
    });
});

app.put("/tables/:id", (req, res) => {
  pusher.trigger("my-channel", "my-event", {
    message: "db changed",
  });
  Tables.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((table) => {
      res.json(table);
    })
    .catch((err) => {
      res.send(err);
    });
});

app.delete("/tables/:id", (req, res) => {
  Tables.findByIdAndDelete(req.params.id)
    .then(() => {
      res.json({ msg: "Deleted" });
    })
    .catch((err) => {
      res.send(err);
    });
});

app.listen(process.env.port || 3001, console.log("Server Started"));
