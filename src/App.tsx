import BaseLayout from "@/layouts/BaseLayout";
import Register from "@/pages/Register";
import UserLogin from "@/pages/UserLogin";
import Workouts from "@/pages/Workouts";
import { Routes, Route } from "react-router-dom";
import MemberLayout from "./layouts/MemberLayout";

function App() {
  return (
    <Routes>
      <Route path="/" element={<BaseLayout />}>
        <Route index element={<UserLogin />} />
        <Route path="/signin" element={<UserLogin />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route path="/workouts" element={<MemberLayout />}>
        <Route index element={<Workouts />} />
      </Route>
    </Routes>
  );
}

export default App;
