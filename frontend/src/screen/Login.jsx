import { addUser } from "@/app/slices/userSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axiosInstance from "@/lib/axiosInstance";
import { Label } from "@radix-ui/react-dropdown-menu";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handelLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosInstance.post("api/v1/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      toast.success("Login Successfull");
      dispatch(addUser(res.data.user));
      navigate("/home");
    } catch (error) {
      console.log(error.response.data);
      setErrors(error.response.data.errors);
      toast.error("Login Failed");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <h2 className="text-2xl font-semibold text-gray-300">Welcome Back 👋</h2>
      <p className="text-sm text-gray-500">Login to your account</p>

      <div className="grid w-full max-w-sm items-center gap-1.5 px-4">
        <Label htmlFor="email">Email</Label>
        <Input
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          type="email"
          id="email"
          placeholder="Email"
        />
        <Label htmlFor="text">Password</Label>
        <Input
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          type="text"
          id="password"
          placeholder="password"
        />

        {/* Errors */}
        {errors.length > 0 && (
          <div className="text-red-500 text-sm mt-2">
            {errors.map((error, index) => (
              <p className="text-center" key={index}>{error.msg || error}</p>
            ))}
          </div>
        )}

        <Button onClick={handelLogin} className="w-[50%] mt-2" type="submit">
          Login
        </Button>
      </div>

      <p className="text-center text-sm text-gray-600 mt-10">
        Don't have an account?{" "}
        <Link
          to="/signup"
          className="text-blue-600 hover:underline font-medium"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default Login;
