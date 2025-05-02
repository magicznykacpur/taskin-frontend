import { BrowserRouter, Route, Routes } from "react-router";
import Landing from "./pages/Landing";
import Login from "./pages/Login";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
