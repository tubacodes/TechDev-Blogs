import express from "express";
import { isAuthenticated } from "../middleware/auth.js";
import {
  getHome,
  getDashboard,
  getNewPostForm,
  createPost,
  getEditPostForm,
  updatePost,
  deletePost,
  getPost,
} from "../controllers/blogController.js";

const router = express.Router();

router.get("/", getHome);
router.get("/dashboard", isAuthenticated, getDashboard);
router.get("/posts/new", isAuthenticated, getNewPostForm);
router.post("/posts", isAuthenticated, createPost);
router.get("/posts/:id/edit", isAuthenticated, getEditPostForm);
router.put("/posts/:id", isAuthenticated, updatePost);
router.delete("/posts/:id/delete", isAuthenticated, deletePost);
router.get("/posts/:id", getPost);

export default router;