
import dotenv from "dotenv";
dotenv.config();
import {Pool} from "pg";

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false,
  },
});

/* Usning pool for now for better performance*/
// const db = new pg.Client({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_DATABASE,
//   password: process.env.DB_PASSWORD,
//   port: process.env.DB_PORT,
// }); 

// db.connect()
//   .then(() => console.log("PostgreSQL connected"))
//   .catch((err) => console.error("DB connection error:", err.stack));

// export default db;
pool.on("connect", async (client) => {
  await client.query("SET search_path TO public");
});
export default pool;