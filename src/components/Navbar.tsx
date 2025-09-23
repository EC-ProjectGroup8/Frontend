import CurrentPage from "./CurrentPage";
import Logo from "./Logo";
import LogOutButton from "./LogOutButton";

const Navbar = () => {
  return (
   <nav className="navbar">
      <Logo />

      {/*Links are for testing responsive functionality only*/}
      <a href="/workouts" className="nav-link">Home</a>
      <a href="/workouts" className="nav-link">My booked Workouts</a>
      <a href="/workouts" className="nav-link">Settings</a>
      <CurrentPage />
      <LogOutButton />
    </nav>
  );
};

export default Navbar;
