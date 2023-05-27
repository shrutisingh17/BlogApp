import React, {useEffect, useState, useContext} from "react";
import homepage from "../images/homepage.jpg";
import axios from "axios";
import {Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/authContext";

const Home = () => {

  const { currentUser } = useContext(AuthContext);
  const[posts, setPosts] = useState([]);

  const cat = useLocation().search; //because after console.log(cat) 

  useEffect(() =>{
    const fetchData = async ()=>{
      try {
        const res = await axios.get(`http://localhost:8800/api/posts${cat}`);
        setPosts(res.data);
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  }, [cat])

  const getText = (html) =>{
    const doc = new DOMParser().parseFromString(html, "text/html")
    return doc.body.textContent
  }

  return (
    <div className="home">
      <div className="image-container">
        
        <img className="my-image" src={homepage} alt="error"/>
        <div className="image-blur">
        <div className="slogan">
          <p className="head-text">WHERE CREATIVITY MEETS COMMUNITY</p>
          <p className="small-text">Connecting you to the stories that matter!</p>
        </div>
        </div>
      </div>

      <div className="posts">
      {posts.map((post) => (
          <div className="post" key={post.id}>
            <div className="img">
              <img src={`../upload/${post.img}`} alt="" />
            </div>
            <div className="content">
             
              {currentUser ? (
                <Link className="link" to={`/post/${post.id}`}>
                  <h1>{post.title}</h1>
                </Link>
              ) : (
                <h1>{post.title}</h1>
              )}
              <div className="description">
                <p>{getText(post.desc)}</p>
              </div>
              
              {currentUser ? (
                <Link className="link" to={`/post/${post.id}`}>
                  <button>Read More</button>
                </Link>
              ) : (
                <Link className="link" to="/login">
                  <button>Read More</button>
                </Link>
              )}
              
            </div>
          </div>
        ))}
      </div> 
    </div>
  );
};

export default Home;