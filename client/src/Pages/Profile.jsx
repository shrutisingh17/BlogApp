import React, {useState, useEffect, useContext} from 'react'
import { AuthContext } from "../context/authContext";
import {Link, useLocation } from "react-router-dom";
import axios from 'axios';

function Profile() {

    const { currentUser } = useContext(AuthContext);
    const[myPosts, setMyPosts] = useState([]);
    
    useEffect(() => {
      const fetchPosts = async () => {
        try {
          const res = await axios.get("http://localhost:8800/api/posts");

          const userPosts = res?.data?.filter((post) => post.uid === currentUser?.id);
          setMyPosts(userPosts);
        } catch (err) {
          console.log(err);
        }
      };
  
      if (currentUser) {
        fetchPosts();
      }
    }, []);

    const getText = (html) =>{
        const doc = new DOMParser().parseFromString(html, "text/html")
        return doc.body.textContent
      }

  return (
    <div className='profile'>
        {/* <div className="profileimg">
              <img src={currentUser.img} alt="" />
        </div> */}
        <h1>{currentUser.username}</h1>
        <p>You Wrote {myPosts.length} blogs !</p>

        <div className="posts">
        {myPosts.map((post) => (
            <div className="post" key={post.id}>
                <div className="img">
                <img src={`../upload/${post.img}`} alt="" />
                </div>
                <div className="content">
                <Link className="link" to={`/post/${post.id}`}>
                    <h1>{post.title}</h1>
                </Link>
                <div className="description">
                    <p>{getText(post.desc)}</p>
                </div>
                <Link className="link" to={`/post/${post.id}`}>
                <button>Read More</button>
                </Link>
                
                </div>
            </div>
            ))}
      </div>
    </div>
  )
}

export default Profile
