import { useNavigate } from "react-router-dom";

const LogOutButton: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("loggedInUserEmail");
    navigate("/signin");
  };

  return (
    <button
      onClick={handleLogout}
      className="logout-btn w-full primary-button
      hover:shadow-md transition-all duration-200 ease-in-out 
      active:scale-95 focus:scale-102 hover:scale-102"
    >
      <span>Logout</span>
    </button>
  );
};

export default LogOutButton;
