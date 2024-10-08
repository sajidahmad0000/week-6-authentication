const express = require("express");

const app = express();

app.use(express.json());

let users = [];

function generateToken(length) {
  const chars = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
  ];

  let token = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    token += chars[randomIndex];
  }

  return token;
}

app.get("/", function (req, res) {
  res.json(users);
});

app.get("/me", function (req, res) {
  const token = req.headers.authorization;
  const user = users.find((item) => item.token === token);

  if (token) {
    res.json({
      username: user.username,
    });
  } else {
    res.json({
      msg: "you are not authenticated",
    });
  }
});

app.post("/signup", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  const checkusername = users.find((u) => u.username === username);
  const checkpassword = users.find((u) => u.password === password);

  if (checkusername) {
    res.json({ msg: "the username already occupied" });
    return;
  }
  users.push({
    username: username,
    password: password,
  });
  res.json({
    msg: "you are successfully signedup",
  });
});

app.post("/signin", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  const founduser = users.find(
    (u) => u.username === username && u.password === password
  );
  console.log(founduser);
  if (founduser) {
    const generatedtoken = generateToken(16);

    founduser.token = generatedtoken;
    res.json({
      msg: "you are successfully signed in",
      token: generatedtoken,
    });
  } else {
    res.json("Invalid credentials");
  }
});

app.listen(6000);
