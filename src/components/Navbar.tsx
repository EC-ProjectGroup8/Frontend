import { Link } from "react-router-dom";
import CurrentPage from "./CurrentPage";
import Logo from "./Logo";
import LogOutButton from "./LogOutButton";

const Navbar = () => {
  return (
    <nav className="navbar">
      <Logo />
      <CurrentPage />
      <Link to="/workouts">
        Workouts
      </Link>
      <Link to="/my-booked-workouts">
        My Boookings
      </Link>

      <LogOutButton />
    </nav>
  );
};

export default Navbar;
