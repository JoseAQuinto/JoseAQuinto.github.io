import { Route, Routes } from "react-router-dom";
import ProjectsPage from "./modules/portfolio/ProjectsPage";
import AppPortfolioDemo from "./projects/portfolio-demo/AppPortfolioDemo";


function App() {
  return (
    <Routes>
      <Route path="/" element={<ProjectsPage />} />
      <Route path="/portfolio-demo/*" element={<AppPortfolioDemo />} />
    </Routes>
  );
}

export default App;