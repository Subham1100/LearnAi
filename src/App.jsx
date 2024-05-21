import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Home, ResponsePage } from "./components";
import Result from "./components/result";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ResponsePage" element={<ResponsePage />} />
          <Route path="/Result" element={<Result />} />
        </Routes>
      </Router>
    </div>
  );
}
export default App;
