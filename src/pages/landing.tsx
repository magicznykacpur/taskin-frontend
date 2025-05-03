import { useCookies } from "react-cookie";
import { useNavigate } from "react-router";
import Breadcrumbs from "../components/breadcrumbs";
import { Button } from "../components/ui/button";

const Landing = () => {
  const navigate = useNavigate();
  const [cookie] = useCookies();

  if (
    cookie["jwt_token"] !== undefined &&
    cookie["refresh_token"] !== undefined
  )
    () => navigate("/dashboard");

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
