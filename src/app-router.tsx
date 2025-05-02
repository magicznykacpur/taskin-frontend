import { BrowserRouter, Route, Routes } from "react-router";
import Landing from "./pages/landing";
import Login from "./pages/login";
import Signup from "./pages/signup";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
