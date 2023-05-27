import { db } from "../db.js";
import jwt from "jsonwebtoken";

// FETCH COMMENTS
export const getComments = (req, res) => {
  const q = "SELECT c1.*, u.username FROM comments c1 LEFT JOIN comments c2 ON c1.parent_comment_id = c2.id JOIN users u ON c1.user_id = u.id";

  db.query(q, (err, data) => {
    if (err) return res.status(500).send(err);

    return res.status(200).json(data);
  });
};

// export const getComments = (req, res) => {
//   const q = `
//     WITH RECURSIVE CommentHierarchy AS (
//       SELECT
//         c1.id,
//         c1.comment_text,
//         c1.date_added,
//         c1.user_id,
//         c1.post_id,
//         c1.parent_comment_id,
//         u.username
//       FROM
//         comments c1
//         LEFT JOIN users u ON c1.user_id = u.id
//       WHERE
//         c1.id = ? -- Replace ? with the desired comment ID
//       UNION ALL
//       SELECT
//         c2.id,
//         c2.comment_text,
//         c2.date_added,
//         c2.user_id,
//         c2.post_id,
//         c2.parent_comment_id,
//         u.username
//       FROM
//         comments c2
//         JOIN CommentHierarchy ch ON c2.parent_comment_id = ch.id
//         LEFT JOIN users u ON c2.user_id = u.id
//     )
//     SELECT
//       id,
//       comment_text,
//       date_added,
//       user_id,
//       post_id,
//       parent_comment_id,
//       username
//     FROM
//       CommentHierarchy;
//   `;

//   const commentId = req.params.commentId; 

//   db.query(q, [commentId], (err, data) => {
//     if (err) return res.status(500).send(err);

//     return res.status(200).json(data);
//   });
// };

// ADD COMMENT
export const addComment = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
 
    const q =
      "INSERT INTO comments (`comment_text`, `date_added`, `user_id`, `post_id`, `parent_comment_id`) VALUES (?, ?, ?, ?, ?)";
      const values = [
      req.body.comment_text,
      req.body.date_added,
      userInfo.id,
      req.body.post_id,
      req.body.parent_comment_id,
    ]; 

    db.query(q, values, (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json(err);
      }
      return res.json("Comment has been added.");
    });
  });
};

// DELETE COMMENT
export const deleteComment = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const commentId = req.params.id;
    const q = "DELETE FROM comments WHERE `id` = ? AND `user_id` = ?";

    db.query(q, [commentId, userInfo.id], (err, data) => {
      if (err) return res.status(403).json("You can delete only your comment!");

      return res.json("Comment has been deleted!");
    });
  });
};

// UPDATE COMMENT
export const updateComment = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const commentId = req.params.id;
    const { comment_text } = req.body;

    const q = "UPDATE comments SET comment_text = ? WHERE id = ? AND user_id = ?";

    db.query(q, [comment_text, commentId, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);

      return res.json("Comment has been updated.");
    });
  });
};
