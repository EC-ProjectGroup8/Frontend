import LoginCard from "@/components/LoginCard/LoginCard";
import { Button } from "@/components/ui/button";

// Just some small example of an page using an Component
// Button Component with Variant "myButton" and using Tailwind margin top
// 10
function UserLogin() {
  return (
    <div>
      <h1 className="pb-20">UserLogin</h1>

      <p>Component Below</p>
      <LoginCard />
      <Button variant="myButton" className="mt-10">Click Me!</Button>
    </div>
  );
}

export default UserLogin;
