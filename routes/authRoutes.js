import express from "express";
import passport from "passport";
import { getLogin, getRegister, postRegister, postLogout } from "../controllers/authController.js";

const router = express.Router();

router.get("/login", getLogin);
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
  })
);

router.get("/register", getRegister);
router.post("/register", postRegister);

router.post("/logout", postLogout);

export default router;