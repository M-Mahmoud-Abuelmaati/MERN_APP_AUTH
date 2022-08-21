import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  getUser,
  getUserError,
  getUserStatus,
  signupUser,
} from "../features/user/userSlice";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState<string | null>();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const user = useAppSelector(getUser);
  const status = useAppSelector(getUserStatus);
  const error = useAppSelector(getUserError);

  useEffect(() => {
    if (error) {
      setErrorMessage(error);
    }
  }, [error]);

  useEffect(() => {
    if (status === "succeeded") {
      setErrorMessage(null);
      console.log(user);
      navigate("/", {replace: true});
    }
  }, [status, user, navigate]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await dispatch(signupUser({ name, email, password }));
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <label htmlFor="email">Username</label>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={name}
          onChange={(e: any) => {
            setName(e.target.value);
          }}
        />

        <label htmlFor="email">Email Address</label>
        <input
          type="text"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e: any) => {
            setEmail(e.target.value);
          }}
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e: any) => {
            setPassword(e.target.value);
          }}
        />

        <button>Register</button>
        {error && <p className="error">{errorMessage}</p>}
      </form>
    </div>
  );
};

export default Register;
