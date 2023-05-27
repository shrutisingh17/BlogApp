import { useState, useEffect, useContext } from "react";
import CommentForm from "./CommentForm";
import Comment from "./Comment";
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import moment from "moment";

const Comments = ({ postId }) => {

  const { currentUser } = useContext(AuthContext);

  const [backendComments, setBackendComments] = useState([]);
  const [activeComment, setActiveComment] = useState(null);
  const rootComments = backendComments.filter(
    (backendComment) => backendComment.parent_comment_id === null
  );

  const getReplies = (commentId) =>
    backendComments
      .filter((backendComment) => backendComment.parent_comment_id === commentId)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

      const fetchComments = () => {
        axios
          .get(`http://localhost:8800/api/comments`)
          .then((response) => {
            const filteredComments = response.data.filter(
              (comment) => comment.post_id === parseInt(postId)
            );
            setBackendComments(filteredComments);
          })
          .catch((error) => {
            console.log(error);
          });
      };
      
      const addComment = (text, parentId) => {
        const commentData = {
          comment_text: text,
          date_added: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
          user_id: currentUser.id,
          post_id: postId,
          parent_comment_id: parentId,
        };
    
        axios.defaults.withCredentials = true;
    
        axios
          .post("http://localhost:8800/api/comments", commentData)
          .then((response) => {
            const newComment = response.data;
            setBackendComments([newComment, ...backendComments]);
            setActiveComment(null);
            fetchComments();
          })
          .catch((error) => {
            console.log(error);
          });
      };
    
      const updateComment = (text, commentId) => {
        const commentData = {
          comment_text: text,
        };
        axios.defaults.withCredentials = true;
        axios
          .put(`http://localhost:8800/api/comments/${commentId}`, commentData)
          .then(() => {
            const updatedBackendComments = backendComments.map((backendComment) => {
              
              if (backendComment.id === parseInt(commentId)) {
                return { ...backendComment, comment_text: text };
              }
              return backendComment;
            });

            setBackendComments(updatedBackendComments);
            setActiveComment(null);
          })
          .catch((error) => {
            console.log(error);
          })          
      };
    
      const deleteComment = (commentId) => {
        axios.defaults.withCredentials = true;
    
        if (window.confirm("Are you sure you want to remove the comment?")) {
          axios
            .delete(`http://localhost:8800/api/comments/${commentId}`)
            .then(() => {
              const updatedBackendComments = backendComments.filter(
                (backendComment) => backendComment.id !== commentId
              );
              setBackendComments(updatedBackendComments);
            })
            .catch((error) => {
              console.log(error);
            });
        }
      };

      useEffect(() => {
        fetchComments();
      }, []);
      
  return (
    <div className="comments">
      <h3 className="comments-title">Comments</h3>
      <CommentForm submitLabel="Write" handleSubmit={addComment} />
      <div className="comments-container">
        {rootComments.map((rootComment) => (
          <Comment
            key={rootComment.id}
            comment={rootComment}
            replies={getReplies(rootComment.id)}
            activeComment={activeComment}
            setActiveComment={setActiveComment}
            addComment={addComment}
            deleteComment={deleteComment}
            updateComment={updateComment}
            currentUserId={currentUser.id}
          />
        ))}
      </div>
    </div>
  );
};

export default Comments;