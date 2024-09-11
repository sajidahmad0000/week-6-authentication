const express = require("express");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "harkiratloveskiara";

const app = express();
app.use(express.json());
let users = [];

function logger(req, res, next) {
  console.log(`${req.method} REQUEST : and the route they hit is : ${req.url}`);
  next();
}
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/index.html");
});
app.get("/all-users", logger, function (req, res) {
  res.json(users);
});

app.post("/signup", logger, function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  const founduser = users.find((user) => user.username === username);

  if (founduser) {
    res.json({ msg: "the username alreay exist" });
  } else {
    users.push({
      username,
      password,
    });
    res.json({ msg: "you are successfully signedup" });
  }
});

app.post("/signin", logger, function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  const founduser = users.find(
    (user) => user.username === username && user.password === password
  );

  if (founduser) {
    const token = jwt.sign(
      {
        username,
      },
      JWT_SECRET
    );

    res.json({ token: token });
  } else {
    res.json({ msg: "Invalid credentials" });
  }
});

function auth(req, res, next) {
  // Get the token from the request headers
  const token = req.headers.authorization;
  console.log(token);

  // Check if the token is provided
  if (!token) {
    return res.json({
      message: "Token is missing!",
    });
  }

  const decodedData = jwt.verify(token, JWT_SECRET);
  if (decodedData.username) {
    req.username = decodedData.username;
    next();
  } else {
    res.json({
      message: "Invalid token!",
    });
  }
}

app.get("/me", logger, auth, function (req, res) {
  const founduser = users.find((user) => user.username === req.username);
  console.log(founduser);

  if (founduser) {
    res.json({ founduser });
  } else {
    res.status(404).json({ msg: "User not found" });
  }
});

app.listen(4500);
