import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import Breadcrumbs from "../components/breadcrumbs";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-self-center items-center mt-10 max-w-md">
      <Breadcrumbs links={{ "/": "Home" }} />
      <h1 className="text-white font-bold mb-5">Welcome to Taskin</h1>
      <p className="text-white text-center py-4">
        Taskin is a simple application that lets you connect with persistent
        backend data and work on scheduling and managing your tasks.
      </p>
      <p></p>
      <div className="mt-5">
        <Button
          className="mr-1"
          variant="outline"
          onClick={() => navigate("/login")}
        >
          Log in
        </Button>
        <Button variant="outline" onClick={() => navigate("/signup")}>
          Sign up
        </Button>
      </div>
    </div>
  );
};

export default Landing;
