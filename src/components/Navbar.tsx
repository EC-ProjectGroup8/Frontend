import CurrentPage from "./CurrentPage";
import Logo from "./Logo";
import LogOutButton from "./LogOutButton";

const Navbar = () => {
  return (
    <nav className="navbar">
      <Logo />

      {/* Endast test, länkarna tas bort senare */}
      <a href="/workouts" className="nav-link cursor-pointer">Home</a>
      <a href="/workouts" className="nav-link cursor-pointer">My booked Workouts</a>
      <a href="/workouts" className="nav-link cursor-pointer">Settings</a>

      
      <CurrentPage />
      <div className="spacer" />
      <LogOutButton />
    </nav>
  );
};

export default Navbar;
