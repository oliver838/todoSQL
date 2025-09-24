import express, { json } from "express";
import cors from "cors";
import { configDB } from "./configDB.js";
import mysql from "mysql2/promise";

const app = express();
app.use(express.json());
app.use(cors());
const port = 8000;

let connection;
try {
  connection = await mysql.createConnection(configDB);
} catch (error) {
  console.log(error);
}

app.get("/todos", async (req, resp) => {
  try {
    const sql = "SELECT * from todolist order by timestamp desc";
    const [rows, fields] = await connection.execute(sql);
    console.log(rows);
    console.log(fields);
    resp.send(rows);
  } catch (error) {
    console.log(error);
  }
});
app.post("/todos", async (req, resp) => {
  if (!req.body) return resp.json({ msg: "üres a body" });
  const { task } = req?.body;
  console.log(task);

  if (!task) return resp.json({ msg: "Hiányos adat!" });

  try {
    const sql = `insert into todolist (task) values (?)`;
    const values = [task];
    const [result] = await connection.execute(sql, values);
    console.log(result);
    return resp.status(201).json({ msg: "Sikeres  hozzáadás" });
  } catch (error) {
    console.log(error);
  }
});
app.delete("/todos/:id", async (req, resp) => {
  const { id } = req.params;
  try {
    const sql = "delete from todolist WHERE id = ?";
    const alma = [id]
    const [result] = await connection.execute(sql, alma);
    console.log(result.affectedRows);
    if(result.affectedRows == 0) return resp.status(404).json({msg:"niny index"})
    return resp.status(200).json({ msg: "Sikeres  törlés" });

  } catch (error) {
    console.log(error);
  }
});
app.patch("/todos/:id", async (req, resp) => {
  const { id } = req.params;
  try {
    const sql = "UPDATE todolist set completed = NOT completed WHERE id = ?";
    const alma = [id]
    const [result] = await connection.execute(sql, alma);
    console.log(result.affectedRows);
    if(result.affectedRows == 0) return resp.status(404).json({msg:"niny index"})
    return resp.status(200).json({ msg: "Sikeres  modositas" });

  } catch (error) {
    console.log(error);
  }
});
app.listen(port, () => console.log("itt hallgatok: ", port));
