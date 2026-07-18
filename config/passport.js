import passport from "passport";
import { Strategy } from "passport-local";
import bcrypt from "bcrypt";
import pool from "./db.js";

passport.use(
  new Strategy({ usernameField: "email" }, async function verify(email, loginPassword, cb) {
    try {
      const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

      if (result.rows.length === 0) {
        return cb(null, false, { message: "User not found" });
      }

      const user = result.rows[0];
      const storedHashedPassword = user.password;

      bcrypt.compare(loginPassword, storedHashedPassword, (err, isMatch) => {
        if (err) return cb(err);
        if (isMatch) return cb(null, user);
        return cb(null, false, { message: "Incorrect password" });
      });
    } catch (err) {
      return cb(err);
    }
  })
);

passport.serializeUser((user, cb) => cb(null, user.id));

passport.deserializeUser(async (id, cb) => {
  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    cb(null, result.rows[0]);
  } catch (err) {
    cb(err);
  }
});

export default passport;