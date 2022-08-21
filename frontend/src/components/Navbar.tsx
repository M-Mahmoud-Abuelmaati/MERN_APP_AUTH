import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { getUser, logoutUser } from "../features/user/userSlice";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const user = useAppSelector(getUser);

  const handleClick = () => {
    dispatch(logoutUser());
    navigate("/");
  };
  return (
    <div className="navbar-container">
      <Link to="/">Home</Link>
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
      {user && (
        <Link to="/" onClick={handleClick}>
          Logout
        </Link>
      )}
    </div>
  );
};

export default Navbar;
