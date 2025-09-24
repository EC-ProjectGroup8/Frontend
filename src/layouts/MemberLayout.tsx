import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import { Outlet } from "react-router-dom";
import Footer from "@/components/Footer";

function MemberLayout() {
  return (
    <div className="member-wrapper">
      <Header />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default MemberLayout;
