import { useNavigate } from "react-router";
import { Button } from "../../components/ui/button";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-self-center items-center mt-5">
      <h2 className="text-white mb-5">Welcome to Taskin</h2>
      <div>
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
