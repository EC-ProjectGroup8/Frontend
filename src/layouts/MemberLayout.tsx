import { Outlet } from "react-router-dom";

function MemberLayout() {
  return (
    <div>
      <h1>Member layout</h1>
      <Outlet />
    </div>
  );
}

export default MemberLayout;
