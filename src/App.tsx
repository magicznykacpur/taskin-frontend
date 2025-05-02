import { BrowserRouter, Route, Routes } from "react-router";
import Landing from "./pages/landing/Landing";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
