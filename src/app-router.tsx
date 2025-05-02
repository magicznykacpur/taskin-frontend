import { BrowserRouter, Route, Routes } from "react-router";
import { CookiesProvider } from "react-cookie";
import Landing from "./pages/landing";
import Login from "./pages/login";
import Signup from "./pages/signup";

const AppRouter = () => {
  return (
    <CookiesProvider defaultSetOptions={{ path: "/" }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </BrowserRouter>
    </CookiesProvider>
  );
};

export default AppRouter;
