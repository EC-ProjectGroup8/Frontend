import CoreGymClubLogo from "../assets/images/logo.svg";

const Logo = () => {
  return (
    <div className="logo-container">
      <div className="logo-img-container">
        <img src={CoreGymClubLogo} alt="Logo" />
      </div>
      <span className="logo-text">CoreGymClub</span>
    </div>
  );
};

export default Logo;
