import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import Navbar from "./components/Navbar";
import {
  checkAuth,
  getAccessTokenStatus,
  getUser,
  refreshToken,
} from "./features/user/userSlice";
import Home from "./pages/Home";
import { Login } from "./pages/Login";
import Register from "./pages/Register";

function App() {
  const dispatch = useAppDispatch();

  const user = useAppSelector(getUser);
  const aToken = localStorage.getItem("atoken");
  const rToken = localStorage.getItem("rtoken");

  const accessTokenState = useAppSelector(getAccessTokenStatus);

  useEffect(() => {
    if (accessTokenState === "expired") {
      dispatch(refreshToken(rToken));
    }
  }, [accessTokenState, rToken, dispatch]);

  useEffect(() => {
    if (aToken) {
      dispatch(checkAuth(aToken));
    }
  }, [dispatch, aToken]);

  useEffect(() => {
    console.log(user);
  }, [user, user?.accessToken, user?.refreshToken]);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to="/" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
