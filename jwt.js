const express = require("express");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "randomharkiratloveskiara";

const app = express();

let users = [];
app.use(express.json());

app.get("/", function (req, res) {
  res.json(users);
});

app.post("/signup", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  const userObject = users.find(
    (user) => user.username === username && user.password === password
  );

  if (userObject) {
    res.json({
      msg: "this username is already occupied",
    });
  } else {
    users.push({
      username: username,
      password: password,
    });
    res.json({ msg: "you are successfully signed up" });
  }
});

app.post("/signin", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  const userObject = users.find(
    (user) => user.username === username && user.password === password
  );

  if (userObject) {
    const token = jwt.sign(
      {
        username: username,
      },
      JWT_SECRET
    );
    console.log(token); //! this just return you token
    res.json({ msg: "You are successfully signed In ", token: token });
  } else {
    res.json({ msg: "Invalid credentials" });
  }
});

app.get("/me", function (req, res) {
  const token = req.headers.authorization;

  const decodedToken = jwt.verify(token, JWT_SECRET); //! bcz this return an object wher username was encoded
  console.log(decodedToken); //!{ username: 'sajidabc', iat: 1725994962 }
  const username = decodedToken.username;
  const userObject = users.find((user) => user.username === username);
  res.json(userObject);
});

app.listen(3000);
