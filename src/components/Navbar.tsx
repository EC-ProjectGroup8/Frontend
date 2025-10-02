import { NavLink } from "react-router-dom";
import Logo from "./Logo";
import LogOutButton from "./LogOutButton";

const Navbar = () => {
  return (
    <nav className="navbar">
      <Logo />

      <NavLink
        to="/pass"
        className={({ isActive }) => `navlink ${isActive ? "active" : ""}`}
      >
        <i className="fa-solid fa-dumbbell"></i>
        <span>Pass</span>
      </NavLink>

      <NavLink
        to="/mina-bokningar"
        className={({ isActive }) => `navlink ${isActive ? "active" : ""}`}
      >
        <i className="fa-solid fa-calendar-days"></i>
        <span>Mina bokningar </span>
      </NavLink>
      <LogOutButton />
    </nav>
  );
};

export default Navbar;
