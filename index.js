import express from "express";
import session from "express-session";
import methodOverride from "method-override";
import dotenv from "dotenv";

import passport from "./config/passport.js";
import { setUserLocals } from "./middleware/locals.js";
import blogRoutes from "./routes/blogRoutes.js";
import authRoutes from "./routes/authRoutes.js";
// import userRoutes from "./routes/userRoutes.js"; // keep only if you actually have this API separately

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(setUserLocals);

app.use("/", blogRoutes);
app.use("/", authRoutes);
// app.use("/api/users", userRoutes);

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));