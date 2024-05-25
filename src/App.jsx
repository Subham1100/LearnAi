import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Analysis, Home, ResponsePage } from "./components";
import Result from "./components/result";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ResponsePage" element={<ResponsePage />} />
          <Route path="/Result" element={<Result />} />
          <Route path="/Analysis" element={<Analysis />} />
        </Routes>
      </Router>
    </div>
  );
}
export default App;
