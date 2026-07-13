import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react'; // Icon untuk tombol menu HP
import DFASimulator from './components/DFASimulator';
import RegexSimulator from './components/RegexSimulator';
import CFGSimulator from './components/CFGSimulator';
import CNFSimulator from './components/CNFSimulator';

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);

  // Deteksi ukuran layar saat di-resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setIsSidebarOpen(true);
      else setIsSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navLinkStyle = ({ isActive }) => ({
    color: isActive ? '#61dafb' : '#bbbbbb',
    textDecoration: 'none',
    fontWeight: isActive ? 'bold' : 'normal',
    padding: '12px 15px',
    borderRadius: '8px',
    backgroundColor: isActive ? '#333333' : 'transparent',
    display: 'block',
    transition: 'all 0.3s ease',
    marginBottom: '5px'
  });

  return (
    <Router>
      <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif', backgroundColor: '#f4f5f7', overflow: 'hidden' }}>
        
        {/* Navbar Khusus Mobile (Header Atas) */}
        {isMobile && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '60px', backgroundColor: '#1e1e1e', color: 'white', display: 'flex', alignItems: 'center', padding: '0 20px', zIndex: 100, borderBottom: '1px solid #333' }}>
            <button onClick={() => setIsSidebarOpen(true)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', marginRight: '15px' }}>
              <Menu size={24} />
            </button>
            <h2 style={{ margin: 0, fontSize: '18px', color: '#61dafb' }}>Otomata Studio</h2>
          </div>
        )}

        {/* Overlay gelap kalau sidebar kebuka di HP */}
        {isMobile && isSidebarOpen && (
          <div 
            onClick={() => setIsSidebarOpen(false)}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 998 }}
          />
        )}

        {/* Sidebar Kiri */}
        <div style={{ 
          width: '260px', 
          backgroundColor: '#1e1e1e', 
          color: 'white', 
          padding: '20px', 
          display: 'flex', 
          flexDirection: 'column',
          borderRight: '1px solid #333',
          position: isMobile ? 'fixed' : 'relative',
          top: 0, bottom: 0, left: 0,
          zIndex: 999,
          transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease-in-out'
        }}>
          
          <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ margin: '0 0 5px 0', fontSize: '22px', color: '#61dafb' }}>Otomata Studio</h2>
              <small style={{ color: '#888' }}>TBO Capstone Project</small>
            </div>
            {isMobile && (
              <button onClick={() => setIsSidebarOpen(false)} style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            )}
          </div>

          <nav style={{ flex: 1 }}>
            <NavLink to="/" style={navLinkStyle} onClick={() => isMobile && setIsSidebarOpen(false)}>
              Modul 1: FSA & Output
            </NavLink>
            <NavLink to="/regex" style={navLinkStyle} onClick={() => isMobile && setIsSidebarOpen(false)}>
              Modul 2: Regex ➔ NFA
            </NavLink>
            <NavLink to="/cfg" style={navLinkStyle} onClick={() => isMobile && setIsSidebarOpen(false)}>
              Modul 3: CFG & Parse Tree
            </NavLink>
            <NavLink to="/cnf" style={navLinkStyle} onClick={() => isMobile && setIsSidebarOpen(false)}>
              Modul 4: Transformasi CNF
            </NavLink>
          </nav>
          
          <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid #444', fontSize: '12px', color: '#777', textAlign: 'center' }}>
            © 2026 Universitas Bale Bandung
          </div>
        </div>

        {/* Konten Kanan Utama */}
        <div style={{ 
          flex: 1, 
          height: '100vh', 
          overflowY: 'auto', 
          paddingTop: isMobile ? '60px' : '0', // Kasih jarak buat header kalau di HP
          width: '100%' 
        }}>
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