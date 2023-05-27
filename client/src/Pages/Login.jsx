import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/authContext";

const Login = () => {

  const [inputs, setInputs] = useState({
    username: "",
    email: "",
  });
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  //getting current user
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      
      await login(inputs)
      navigate("/");
    } catch (err) {
      setError(err.response.data);
      console.log(err);
    }
  };
  return (
    <div className="auth">
      <h1>Log In</h1>
      <form>
        <input required type="text" placeholder="Username" name="username" onChange={handleChange} />
        <input required type="password" placeholder="Password" name="password" onChange={handleChange} />
        <button onClick={handleSubmit}>Login</button>
        {error && <p>{error}</p>}
        <span>
          Don't you have an account? <Link className="log" to="/register">SignUp</Link>
        </span>
      </form>
    </div>
  );
};

export default Login;