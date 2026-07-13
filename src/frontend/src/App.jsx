import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import DFASimulator from './components/DFASimulator';
import RegexSimulator from './components/RegexSimulator';
import CFGSimulator from './components/CFGSimulator';

// Placeholder untuk Modul 4 sementara
function CNFSimulator() {
  return (
    <div style={{ padding: '20px' }}>
      <h2>Modul 4: Chomsky Normal Form (CNF)</h2>
      <p>Fitur eliminasi epsilon, unit, dan konversi CNF akan segera dibangun di sini...</p>
    </div>
  );
}

function App() {
  // Style khusus untuk menu yang sedang aktif
  const navLinkStyle = ({ isActive }) => ({
    color: isActive ? '#61dafb' : '#bbbbbb',
    textDecoration: 'none',
    fontWeight: isActive ? 'bold' : 'normal',
    padding: '10px',
    borderRadius: '5px',
    backgroundColor: isActive ? '#333333' : 'transparent',
    display: 'block',
    transition: '0.3s'
  });

  return (
    <Router>
      <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif' }}>
        
        {/* Sidebar Kiri */}
        <div style={{ width: '250px', backgroundColor: '#1e1e1e', color: 'white', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px', borderRight: '2px solid #333' }}>
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ margin: '0 0 5px 0', fontSize: '20px', color: '#61dafb' }}>Otomata Studio</h2>
            <small style={{ color: '#888' }}>TBO Capstone Project</small>
          </div>

          <NavLink to="/" style={navLinkStyle}>
            Modul 1: FSA & Mesin Output
          </NavLink>
          <NavLink to="/regex" style={navLinkStyle}>
            Modul 2: Regex ➔ NFA
          </NavLink>
          <NavLink to="/cfg" style={navLinkStyle}>
            Modul 3: CFG & Parse Tree
          </NavLink>
          <NavLink to="/cnf" style={navLinkStyle}>
            Modul 4: Transformasi CNF
          </NavLink>
          
          <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid #444', fontSize: '12px', color: '#777', textAlign: 'center' }}>
            © 2026 Universitas Bale Bandung
          </div>
        </div>

        {/* Konten Kanan Utama */}
        <div style={{ flex: 1, backgroundColor: '#f4f5f7', overflowY: 'auto' }}>
          <Routes>
            <Route path="/" element={<DFASimulator />} />
            <Route path="/regex" element={<RegexSimulator />} />
            <Route path="/cfg" element={<CFGSimulator />} />
            <Route path="/cnf" element={<CNFSimulator />} />
          </Routes>
        </div>

      </div>
    </Router>
  );
}

export default App;