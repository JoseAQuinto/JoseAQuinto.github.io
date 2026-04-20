import { Route, Routes } from "react-router-dom";
import ProjectsPage from "./modules/portfolio/ProjectsPage";
import AppPortfolioDemo from "./projects/portfolio-demo/AppPortfolioDemo";
import StockPage from "./projects/stock-system/pages/stock/StockPage";


function App() {
  return (
    <Routes>
      <Route path="/" element={<ProjectsPage />} />
      <Route path="/portfolio-demo/*" element={<AppPortfolioDemo />} />
      <Route path="/stock-system/*" element={<StockPage />} />
    </Routes>
  );
}

export default App;