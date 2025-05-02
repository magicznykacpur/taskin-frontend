import { useNavigate } from "react-router";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <>
      <h2>Welcome to Taskin</h2>
      <div>
        <button onClick={() => navigate("/login")}>Log in</button>
        <button onClick={() => navigate("/signup")}>Sign up</button>
      </div>
    </>
  );
};

export default Landing;
