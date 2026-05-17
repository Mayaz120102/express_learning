import React, { useState } from "react";
import API from "../api/axios";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setloading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setloading(true);

    try {
      const res = await API.post("/users/login", {
        email,
        password,
      });

      console.log("Login success", res.data);

      //store token
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("accessToken", res.data.accessToken);

      //success toast
      toast.success("Login successfull!");

      // redirect
      setTimeout(() => {
        navigate("/notes");
      }, 500);
    } catch (error) {
      console.log("Login Error ", error.response?.data || error.message);

      //error toast
      toast.error(error.response?.data?.message || "Login failed. Try again!");
    } finally {
      setloading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-3 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 p-3 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded text-white ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-sm text-center mt-4">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
