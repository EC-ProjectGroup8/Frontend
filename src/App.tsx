import BaseLayout from "@/layouts/BaseLayout";
import Register from "@/pages/Register";
import UserLogin from "@/pages/UserLogin";
import Pass from "@/pages/Workouts";
import { Routes, Route } from "react-router-dom";
import MemberLayout from "./layouts/MemberLayout";
import RequestPasswordForm from "@/pages/RequestPasswordForm";

function App() {
  return (
    <Routes>
      <Route path="/" element={<BaseLayout />}>
        <Route index element={<UserLogin />} />
        <Route path="/signin" element={<UserLogin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<RequestPasswordForm />} />



      </Route>

      <Route path="/pass" element={<MemberLayout />}>
        <Route index element={<Pass />} />
      </Route>
    </Routes>
  );
}

export default App;
