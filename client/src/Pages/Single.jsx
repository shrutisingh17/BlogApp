import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MdOutlineModeEdit } from 'react-icons/md'
import { RiDeleteBin5Line } from 'react-icons/ri'
import axios from "axios";
import moment from "moment";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import Menu from "../components/Menu";
import DOMPurify from "dompurify";
import Comments from "../components/Comments/Comments";

const Single = () => {
  const [post, setPost] = useState({});

  const navigate = useNavigate();

  const location = useLocation();
  const postId = location.pathname.split("/")[2];

  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8800/api/posts/${postId}`
        );
        setPost(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [postId]);

  const handleDelete = async () => {
    axios.defaults.withCredentials = true;
    try {
      await axios.delete(`http://localhost:8800/api/posts/${postId}`);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="single">
      <div className="content">
        <img src={`../upload/${post?.img}`} alt="" />
        <div className="user">
          {post.userImg && <img src={post.userImg} alt="" />}
          <div className="info">
            <span>{post.username}</span>
            <p>Posted {moment(post.date).fromNow()}</p>
          </div> 
          {currentUser.username === post.username && (
            <div className="edit">
              <Link to={`/write?edit=2`} state={post}>
                <MdOutlineModeEdit style={{height: "26px", width: "26px", marginLeft:"12px"}}/>
              </Link>
              < RiDeleteBin5Line className="delete" style={{height:"25px", width:"25px"}}  onClick={handleDelete}/>
            </div>
          )}
        </div>
        <h1>{post.title}</h1>
        <p
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(post.desc),
        }}
        >
        </p>{" "}
        <Comments postId={postId}/>
        
      </div>
      <Menu cat={post.cat} />
    </div>
  );
};

export default Single;
