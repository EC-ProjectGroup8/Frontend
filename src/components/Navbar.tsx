import CurrentPage from "./CurrentPage";
import Logo from "./Logo";
import LogOutButton from "./LogOutButton";

const Navbar = () => {
  return (
    <nav className="navbar">
      <Logo />
      <CurrentPage />
      <LogOutButton />
    </nav>
  );
};

export default Navbar;
