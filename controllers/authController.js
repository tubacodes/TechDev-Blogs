import bcrypt from "bcrypt";
import pool from "../config/db.js";

const saltRounds = 10;

export function getLogin(req, res) {
  res.render("login.ejs", { title: "login" });
}

export function getRegister(req, res) {
  res.render("register", {title: "Register"});
}

export async function postRegister(req, res, next) {
  const { email, password, username } = req.body;

  try {
    const checkUser = await pool.query("SELECT email FROM users WHERE email = $1", [email]);

    if (checkUser.rows.length > 0) {
      return res.render("login.ejs", { message: "User already exists, try login" });
    }

    const hash = await bcrypt.hash(password, saltRounds);

    const result = await pool.query(
      "INSERT INTO users (email, password, username) VALUES ($1, $2, $3) RETURNING *",
      [email, hash, username]
    );
    const newUser = result.rows[0];

    req.login(newUser, (err) => {
      if (err) return next(err);
      return res.redirect("/dashboard");
    });
  } catch (err) {
    console.error("Registration error:", err.stack);
    return res.status(500).send("An error occurred during registration.");
  }
}

export function postLogout(req, res, next) {
  req.logout((err) => {
    if (err) {
      console.error("Error during session logout:", err);
      return next(err);
    }
    res.clearCookie("connect.sid");
    res.redirect("/");
  });
}