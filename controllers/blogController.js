import pool from "../config/db.js";

export async function getHome(req, res) {
  try {
    const queryText = `
      SELECT blog.*, users.username AS author_name
      FROM blog
      INNER JOIN users ON blog.user_id = users.id
    `;
    const result = await pool.query(queryText);
    res.render("index", {
      title: "Home | TechDev Blogs",
      posts: result.rows,
      user: req.user || null,
    });
  } catch (err) {
  console.error(err);
  throw err;
}
}

export async function getDashboard(req, res) {
  const currentUserId = req.user.id;
  try {
    const queryText = `
      SELECT blog.*, users.username
      FROM blog
      INNER JOIN users ON blog.user_id = users.id
      WHERE users.id = $1
    `;
    const result = await pool.query(queryText, [currentUserId]);
    res.render("dashboard", {
      title: "Dashboard",
      posts: result.rows,
      total: result.rows.length,
      user: req.user,
    });
  } catch (err) {
    console.error("Dashboard database join error:", err.stack);
    res.status(500).send("Internal Server Error");
  }
}

export function getNewPostForm(req, res) {
  res.render("post-new", { title: "New Post" });
}

export async function createPost(req, res) {
  const { title, subheading, content } = req.body;
  const authorId = req.user.id;
  const imageurl = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    await pool.query(
      `INSERT INTO blog(title, subheading, content, imageurl, user_id)
       VALUES($1, $2, $3, $4, $5)`,
      [title, subheading, content, imageurl, authorId]
    );
    res.redirect("/");
  } catch (error) {
    console.error("Error inserting post:", error);
    res.status(500).send("Internal Server Error");
  }
}

export async function getEditPostForm(req, res) {
  const id = Number(req.params.id);
  const userId = Number(req.user.id);
  try {
    const result = await pool.query("SELECT * FROM blog WHERE id = $1 AND user_id = $2", [id, userId]);
    if (result.rows.length === 0) {
      return res.status(404).render("404.ejs");
    }
    res.render("post-edit", { post: result.rows[0], title: result.rows[0].title });
  } catch (error) {
    console.error("Error fetching post for edit:", error);
    res.status(500).send("Internal Server Error");
  }
}

export async function updatePost(req, res) {

  const id = Number(req.params.id);
  const title = req.body.title || null;
  const subheading = req.body.subheading || null;
  const content = req.body.content || null;
  const imageurl = req.file ? `/uploads/${req.file.filename}` : null;
  const currentUserId = req.user.id || null;

  try {
    const result = await pool.query(
      `UPDATE blog
       SET title = COALESCE($1, title),
           subheading = COALESCE($2, subheading),
           content = COALESCE($3, content),
           imageurl = COALESCE($4, imageurl)
       WHERE id = $5 AND user_id = $6
       RETURNING *`,
      [title, subheading, content, imageurl, id,  currentUserId]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("Post not found");
    }
    res.redirect(`/posts/${id}`);
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).send("Internal Server Error");
  }
}

export async function deletePost(req, res) {
  const id = Number(req.params.id);
  const currentUserId = req.user.id;

  try {
    const result = await pool.query(
      "DELETE FROM blog WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, currentUserId]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("Post not found or unauthorized.");
    }
    res.redirect("/dashboard");
  } catch (error) {
    console.error("Error deleting post:", error.stack);
    res.status(500).send("Internal Server Error: Cannot delete post.");
  }
}

export async function getPost(req, res) {
  const id = Number(req.params.id);
  try {
    const result = await pool.query("SELECT * FROM blog WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).render("404.ejs");
    }
    res.render("post-show", { post: result.rows[0], title: result.rows[0].title });
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).send("Internal Server Error");
  }
}

export async function searchPosts(req, res) {
  const { q } = req.query;

  if (!q || !q.trim()) {
    return res.json([]);
  }

  try {
    const result = await pool.query(
      `SELECT id, title
       FROM blog
       WHERE title ILIKE $1 OR subheading ILIKE $1
       LIMIT 10`,
      [`%${q}%`]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Search failed" });
  }
}