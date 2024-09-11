const express = require("express");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "harkiratloveskiara";

const app = express();
app.use(express.json());
let users = [];

app.get("/", function (req, res) {
  res.json(users);
});

app.post("/signup", function (req, res) {
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

app.post("/signin", function (req, res) {
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

// app.get("/me", authMiddleware, function (req, res) {
//   const username = req.username;
//   const founduser = users.find((user) => user.username === username);
//   if (founduser) {
//     res.json({ founduser });
//   } else {
//     res.json("did not found");
//   }
// });
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

app.get("/me", auth, function (req, res) {
  const founduser = users.find((user) => user.username === req.username);
  console.log(founduser);

  if (founduser) {
    res.json({ founduser });
  } else {
    res.status(404).json({ msg: "User not found" });
  }
});

app.listen(4500);
