import BaseLayout from "@/layouts/BaseLayout";
import FormRegistration from "@/pages/FormRegistration";
import UserLogin from "@/pages/UserLogin";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<BaseLayout />}>
        <Route index element={<UserLogin />} />
        <Route path="/register" element={<FormRegistration />} />
      </Route>
    </Routes>
  );
}

export default App;
