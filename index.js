import express from "express";
import session from "express-session";
import methodOverride from "method-override";
import dotenv from "dotenv";
import connectPgSimple from "connect-pg-simple";
import pool from "./config/db.js";

import passport from "./config/passport.js";
import { setUserLocals } from "./middleware/locals.js";
import blogRoutes from "./routes/blogRoutes.js";
import authRoutes from "./routes/authRoutes.js";
// import userRoutes from "./routes/userRoutes.js"; // keep only if you actually have this API separately

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const PgStore = connectPgSimple(session);

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

app.use(
  session({
    store: new PgStore({
      pool,
      tableName: "user_sessions",
      createTableIfMissing: true,
    }),
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(setUserLocals);

app.use("/", blogRoutes);
app.use("/", authRoutes);
// app.use("/api/users", userRoutes);

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));