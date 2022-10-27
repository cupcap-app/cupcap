import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import logo from "./logo.svg";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      {/* <ScrollToTop /> */}
      {/* <Header /> */}
      <Routes>
        <Route exact path="/" element={<Home />} />
      </Routes>
      {/* <Footer /> */}
    </BrowserRouter>
  );
}

export default App;
