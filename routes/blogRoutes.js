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
  searchPosts
} from "../controllers/blogController.js";
import upload from "../config/multer.js";


const router = express.Router();

router.get("/", getHome);
router.get("/dashboard", isAuthenticated, getDashboard);
router.get("/posts/new", isAuthenticated, getNewPostForm);
router.get("/posts/:id/edit", isAuthenticated, getEditPostForm);
router.delete("/posts/:id/delete", isAuthenticated, deletePost);
router.get("/posts/:id", getPost);
router.get("/search", searchPosts);
router.post("/posts", isAuthenticated, upload.single("image"), createPost);
router.post("/posts/:id", isAuthenticated, upload.single("image"), updatePost);
export default router;