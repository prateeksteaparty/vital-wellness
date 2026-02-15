import { Routes, Route } from "react-router-dom";
import GettingStarted from "./pages/GettingStarted";
import Details from "./pages/Details";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Dashboard from "./pages/Dashboard";
import Recommendations from "./pages/Recommendations";
import Resources from "./pages/Resources";

function App() {
  return (
    <Routes>
      <Route path="/" element={<GettingStarted />} />
      <Route path="/details" element={<Details />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/recommendations" element={<Recommendations />} />
      <Route path="/resources" element={<Resources />} />
    </Routes>
  );
}

export default App;