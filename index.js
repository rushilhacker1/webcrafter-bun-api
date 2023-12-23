import figlet from "figlet";
import { Database } from "bun:sqlite";
import cassandra from "cassandra-driver";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const db = new Database("mydb.sqlite", { create: true });
db.exec("PRAGMA journal_mode = WAL;");
const query = db.query("select 'Hello' as message");
db.run(
  "CREATE TABLE IF NOT EXISTS devs (id INTEGER PRIMARY KEY AUTOINCREMENT,user_id VARCHAR(20) UNIQUE NOT NULL,name TEXT NOT NULL,email TEXT NOT NULL UNIQUE,pass VARCHAR(255) NOT NULL,desc TEXT NOT NULL,languages TEXT NOT NULL)"
);
db.run(
  "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT,user_id VARCHAR(20) UNIQUE NOT NULL,name TEXT NOT NULL,email TEXT NOT NULL UNIQUE,pass VARCHAR(255) NOT NULL,desc TEXT NOT NULL)"
);

// db.close()

const server = Bun.serve({
  development: true,
  port: process.env.PORT,

  fetch: async (req) => {
    const res = figlet.textSync("clean");
    const url = new URL(req.url);
    const urlParams = new URLSearchParams(url.search);

    if (url.pathname === "/get_dev") {
      if (req.method === "GET") {
        const need = urlParams.get("id");
        console.log(need);
        if (need == null) {
          const query = db.query("SELECT * FROM devs");
          console.log(query.values());
          return new Response(JSON.stringify(query.values()));
        }
        const query = db.query("SELECT * FROM devs WHERE id = ".concat(need));
        const ret = query.get();
        if (ret == null) {
          throw new Error("undefined");
        } else {
          return new Response(JSON.stringify(ret));
        }
      }
      if (req.method === "PUT") {
        const data = await req.json();
        const sql = `INSERT INTO "devs" ("user_id", "name", "email", "pass", "desc", "lang") VALUES ('${data.user_id}', '${data.name}', '${data.email}', '${data.pass}', '${data.desc}', '${data.lang}')`;
        console.log(sql);
        return new Response(figlet.textSync("yo done bro"));
      }
      if (req.method === "DELETE") {
        const user_id = urlParams.get("user_id");
        const id = urlParams.get("id");
        if (user_id == null) {
          if (id == null) {
            throw new Error(
              figlet.textSync("yo some fucker forgot what to delete")
            );
          } else {
            db.run(`DELETE FROM "devs" WHERE id = ${id}`);
            return new Response(
              JSON.stringify(
                figlet.textSync("yo mama so fat she deleted the user")
              )
            );
          }
        } else {
          db.run(`DELETE FROM "devs" WHERE user_id = '${user_id}'`);
          return new Response(
            JSON.stringify(
              figlet.textSync("yo mama so fat she deleted the user")
            )
          );
        }
      }
    }
    if (url.pathname === "/get_usr") {
      // console.log(JSON.stringify(req.method))
      if (req.method === "GET") {
        const need = urlParams.get("id");
        if (need == null) {
          const query = db.query("select * from users");
        }
        const query = db.query("SELECT * FROM USERS WHERE id = ".concat(need));
        const ret = query.get();
        if (ret == null) {
          throw new Error("undefined");
        } else {
          return new Response(JSON.stringify(ret));
        }
      }
      if (req.method === "PUT") {
        const data = await req.json();
        const sql = `INSERT INTO "users" ("user_id", "name", "email", "pass", "desc") VALUES ('${data.user_id}', '${data.name}', '${data.email}', '${data.pass}', '${data.desc}')`;
        console.log(sql);
        return new Response(figlet.textSync("yo done bro"));
      }
      if (req.method === "DELETE") {
        const user_id = urlParams.get("user_id");
        const id = urlParams.get("id");
        if (user_id == null) {
          if (id == null) {
            throw new Error(
              figlet.textSync("yo some fucker forgot what to delete")
            );
          } else {
            db.run(`DELETE FROM "users" WHERE id = ${id}`);
            return new Response(
              JSON.stringify(
                figlet.textSync("yo mama so fat she deleted the user")
              )
            );
          }
        } else {
          db.run(`DELETE FROM "users" WHERE user_id = '${user_id}'`);
          return new Response(
            JSON.stringify(
              figlet.textSync("yo mama so fat she deleted the user")
            )
          );
        }
      }
    } else {
      throw new Error("Error code 404");
    }
  },
});

console.log(`Listening on http://localhost:${server.port} ...`);
