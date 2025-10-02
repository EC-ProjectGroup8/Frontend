import BaseLayout from "@/layouts/BaseLayout";
import Register from "@/pages/Register";
import UserLogin from "@/pages/UserLogin";
import Pass from "@/pages/Workouts";
import { Routes, Route } from "react-router-dom";
import MemberLayout from "./layouts/MemberLayout";
import RequestPasswordForm from "@/pages/RequestPasswordForm";
import MyBookedWorkouts from "./pages/MyBookedWorkouts";
import RequestPasswordReset from "./pages/RequestPasswordReset";

function App() {
  return (
    <Routes>
      <Route path="/" element={<BaseLayout />}>
        <Route index element={<UserLogin />} />
        <Route path="/logga-in" element={<UserLogin />} />
        <Route path="/skapa-konto" element={<Register />} />
        <Route path="/glomt-losenord" element={<RequestPasswordReset />} />
        <Route path="/skapa-losenord" element={<RequestPasswordForm />} />
      </Route>

      <Route path="/pass" element={<MemberLayout />}>
        <Route index element={<Pass />} />
      </Route>

      <Route path="/mina-bokningar" element={<MemberLayout />}>
        <Route index element={<MyBookedWorkouts />} />
      </Route>
    </Routes>
  );
}

export default App;
