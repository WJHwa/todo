const express = require("express");
const app = express();
const cors = require("cors");
const db = require("./db");
const jwt = require("jsonwebtoken");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ credentials: true, origin: true }));

function generateToken(id) {
  return jwt.sign({ id }, "awfwdawasfefsfs", {
    expiresIn: "6h",
  });
}

app.get("/", async (req, res) => {
  let authHeader = req.headers.authorization;
  let token = authHeader.split(".")[1];
  var payload = Buffer.from(token, "base64");
  var result = JSON.parse(payload.toString());
  const id = result.id.split(",")[0];
  try {
    const results = await db.query(
      "SELECT * FROM TB_.TB_TODOLIST WHERE mid = ?",
      id
    );
    return res.send(results[0]);
  } catch (err) {
    console.log(err);
  }
});

app.post("/login", async (req, res) => {
  const { id, password } = req.body;
  try {
    const result = await db.query(
      "SELECT * FROM TB_.TB_MEMBER WHERE mid = ?",
      id
    );
    if (result[0].length === 0) {
      return res.send("아이디");
    }
    if (result[0][0].pwd === password) {
      let Token = generateToken(result[0][0].mid + `,${result[0][0].name}`);
      return res.send({ token: Token });
    } else {
      return res.send(false);
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/", async (req, res) => {
  const { title, mid } = req.body;
  try {
    await db.query("INSERT INTO TB_.TB_TODOLIST(mid,title) VALUES(?,?)", [
      mid,
      title,
    ]);
    return res.send(true);
  } catch (err) {
    console.log(err);
  }
});

app.put("/", async (req, res) => {
  const { idx, title } = req.body;
  try {
    await db.query("UPDATE TB_.TB_TODOLIST SET title=? WHERE idx=?", [
      title,
      idx,
    ]);
    return res.send(true);
  } catch (err) {
    console.log(err);
  }
});
app.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await db.query("DELETE FROM TB_.TB_TODOLIST WHERE idx = ?", id);
    return res.send(true);
  } catch (err) {
    console.log(err);
  }
});

app.listen(8080, () => {
  console.log("server Port 8080");
});
