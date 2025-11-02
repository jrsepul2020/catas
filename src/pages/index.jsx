import Layout from "./Layout.jsx";

import Dashboard from "./Dashboard";

import Tandas from "./Tandas";

import Estadisticas from "./Estadisticas";

import Configuracion from "./Configuracion";

import NuevaCata from "./NuevaCata";

import CataEspirituosos from "./CataEspirituosos";

import Muestras from "./Muestras";

import GestionTandas from "./GestionTandas";

import Catadores from "./Catadores";

import TestSupabase from "./TestSupabase";

import UsuariosTest from "./UsuariosTest";

import TestLogin from "./TestLogin";

import AnalizarPasswords from "./AnalizarPasswords";

import PruebaLogin from "./PruebaLogin";

import ConsultaUsuarios from "./ConsultaUsuarios";

import TestAuth from "./TestAuth";

import HomePage from "./HomePage";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Dashboard: Dashboard,
    
    Tandas: Tandas,
    
    Estadisticas: Estadisticas,
    
    Configuracion: Configuracion,
    
    NuevaCata: NuevaCata,
    
    CataEspirituosos: CataEspirituosos,
    
    Muestras: Muestras,
    
    GestionTandas: GestionTandas,
    
    Catadores: Catadores,
    
    TestSupabase: TestSupabase,
    
    UsuariosTest: UsuariosTest,
    
    TestLogin: TestLogin,
    
    AnalizarPasswords: AnalizarPasswords,
    
    PruebaLogin: PruebaLogin,
    
    ConsultaUsuarios: ConsultaUsuarios,
    
    TestAuth: TestAuth,
    
    HomePage: HomePage,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<HomePage />} />
                
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/Tandas" element={<Tandas />} />
                
                <Route path="/Estadisticas" element={<Estadisticas />} />
                
                <Route path="/Configuracion" element={<Configuracion />} />
                
                <Route path="/NuevaCata" element={<NuevaCata />} />
                
                <Route path="/CataEspirituosos" element={<CataEspirituosos />} />
                
                <Route path="/Muestras" element={<Muestras />} />
                
                <Route path="/GestionTandas" element={<GestionTandas />} />
                
                <Route path="/Catadores" element={<Catadores />} />
                
                <Route path="/TestSupabase" element={<TestSupabase />} />
                
                <Route path="/UsuariosTest" element={<UsuariosTest />} />
                
                <Route path="/TestLogin" element={<TestLogin />} />
                
                <Route path="/AnalizarPasswords" element={<AnalizarPasswords />} />
                
                <Route path="/PruebaLogin" element={<PruebaLogin />} />
                
                <Route path="/ConsultaUsuarios" element={<ConsultaUsuarios />} />
                
                <Route path="/TestAuth" element={<TestAuth />} />
                
                <Route path="/HomePage" element={<HomePage />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}