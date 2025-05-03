import { BrowserRouter, Route, Routes } from "react-router";
import Dashboard from "./pages/dashboard/dashboard";
import Landing from "./pages/landing";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Profile from "./pages/dashboard/profile";

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />
      <Route path="dashboard" element={<Dashboard />}>
        <Route path="profile" element={<Profile />} />
        <Route path="tasks" />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default AppRouter;
