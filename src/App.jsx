import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from './components/navbar';
import Footer from './components/footer';
import Home from "./pages/Home/Index";
import Sobre from "./pages/Sobre/Index";
import Login from "./pages/Login/Index";
import FazerLogin from "./pages/Login/Login";
import Receitas from "./pages/Receitas/Index";
import Criar from "./pages/Receitas/Criar";
function App() {
  return (
    <BrowserRouter>
      <div id="root">
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/login" element={<Login />} />
            <Route path="/fzrlogin" element={<FazerLogin />} />
            <Route path="/receitas" element={<Receitas />} />
            <Route path="/criar" element={<Criar />} />

         
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
