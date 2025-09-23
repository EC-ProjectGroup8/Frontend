import CurrentPage from "./CurrentPage";
import Logo from "./Logo";

const Navbar = () => {
  return (
    <nav className="navbar">
      <Logo />
      <CurrentPage />
    </nav>
  );
};

export default Navbar;
