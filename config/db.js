
import dotenv from "dotenv";
dotenv.config();
import {Pool} from "pg";

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,

  database:process.env.DB_DATABASE,
  password:process.env.DB_PASSWORD,
})

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


export default pool;