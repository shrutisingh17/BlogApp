import {db} from "../db.js";
import jwt from "jsonwebtoken";

// FETCH ALL POSTS
export const getPosts = (req, res) => {
    const q = req.query.cat
      ? "SELECT * FROM posts WHERE cat=?"
      : "SELECT * FROM posts";
  
    db.query(q, [req.query.cat], (err, data) => {
      if (err) return res.status(500).send(err);
  
      return res.status(200).json(data);
    });
};

// FETCH SINGLE POST
export const getPost = (req, res)=>{
    const q =
    "SELECT p.id, `username`, `title`, `desc`, p.img, u.img AS userImg, `cat`,`date` FROM users u JOIN posts p ON u.id = p.uid WHERE p.id = ? ";

  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.status(500).json(err);

    return res.status(200).json(data[0]); 
  });
}

// ADD POST
export const addPost = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "INSERT INTO posts(`title`, `desc`, `img`, `cat`, `date`,`uid`) VALUES (?)";

    const values = [
      req.body.title,
      req.body.desc,
      req.body.img,
      req.body.cat,
      req.body.date,
      userInfo.id,
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json("Post has been created.");
    });
  });
};

// DELETE POST
//before deleting post, we've to check our JsonWebToken, If we don't have any JWT in our cookie, it means we're not authenticated.
//So, we're not allowed to delete this post.Also even if we have a token we've to check if this post belongs to us or not
export const deletePost = (req, res)=>{
    const token = req.cookies.access_token;

    // if the request contains a valid JWT access token in a cookie
  if (!token) return res.status(401).json("Not authenticated!");

    //If the token is present, the function verifies the token using a secret key "jwtkey" and extracts the user information(which was stored during login) from the token payload.
  jwt.verify(token, "jwtkey", (err, userInfo) => {

    if (err) return res.status(403).json("Token is not valid!");

    // If the token is valid, the function retrieves the post ID from the request parameters and constructs a SQL query to delete the post from the database with the given ID and user ID. 
    // The query uses placeholders (?) to prevent SQL injection attacks and passes the ID and user ID as parameters to the query.
    const postId = req.params.id;
    const q = "DELETE FROM posts WHERE `id` = ? AND `uid` = ?";

    db.query(q, [postId, userInfo.id], (err, data) => {
      if (err) return res.status(403).json("You can delete only your post!");

      return res.json("Post has been deleted!");
    });
  });
}
//Overall, this code implements a secure way to delete a post from a database by verifying the user's identity using JWT authentication and checking that the user is authorized to delete the post before executing the SQL query.


// UPDATE POST
export const updatePost = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const postId = req.params.id;
    const q =
      "UPDATE posts SET `title`=?,`desc`=?,`img`=?,`cat`=? WHERE `id` = ? AND `uid` = ?";

    const values = [req.body.title, req.body.desc, req.body.img, req.body.cat];

    db.query(q, [...values, postId, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json("Post has been updated.");
    });
  });
};