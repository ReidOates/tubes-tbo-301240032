import { useState } from 'react';
import axios from 'axios';

export default function CNFSimulator() {
  const [startSymbol, setStartSymbol] = useState('S');
  const [rulesStr, setRulesStr] = useState(
    JSON.stringify({ "S": ["ASA", "aB"], "A": ["B", "S"], "B": ["b", "e"] }, null, 2)
  );
  const [result, setResult] = useState(null);
  const [activeStep, setActiveStep] = useState('step1_original');

const handleConvert = async () => {
    try {
      const response = await axios.post('/api/cnf/convert', {
        rules: JSON.parse(rulesStr),
        start_symbol: startSymbol
      });
      setResult(response.data.data);
      setActiveStep('step4_cnf');
    } catch (error) {
      // Menangkap pesan error asli dari backend
      const errorMsg = error.response?.data?.error || error.message;
      alert("Gagal mengonversi: " + errorMsg);
      console.error(error);
    }
  };

  const renderGrammar = (grammarObj) => {
    if (!grammarObj) return null;
    return Object.entries(grammarObj).map(([key, prods]) => (
      <div key={key} style={{ fontSize: '18px', margin: '5px 0' }}>
        <strong>{key}</strong> ➔ {prods.join(' | ')}
      </div>
    ));
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '20px' }}>Modul 4: Transformasi Chomsky Normal Form</h2>
      
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 300px', padding: '15px', backgroundColor: '#1e1e1e', color: 'white', borderRadius: '8px' }}>
          <div><label>Start Symbol:</label> <input type="text" value={startSymbol} onChange={e => setStartSymbol(e.target.value)} style={{ width: '100%', padding: '8px', marginBottom: '10px' }} /></div>
          <div>
            <label>Aturan Produksi (JSON):</label>
            <textarea rows="8" value={rulesStr} onChange={e => setRulesStr(e.target.value)} style={{ width: '100%', padding: '8px', fontFamily: 'monospace' }} />
          </div>
          <button onClick={handleConvert} style={{ width: '100%', padding: '10px', marginTop: '10px', backgroundColor: '#4caf50', color: '#fff', fontWeight: 'bold', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Konversi ke CNF</button>
        </div>

        <div style={{ flex: '2 1 400px', padding: '15px', backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px' }}>
          {result ? (
            <>
              <div style={{ display: 'flex', gap: '5px', marginBottom: '20px', borderBottom: '2px solid #ddd', paddingBottom: '10px' }}>
                <button onClick={() => setActiveStep('step1_original')} style={{ padding: '8px', fontWeight: activeStep === 'step1_original' ? 'bold' : 'normal', backgroundColor: activeStep === 'step1_original' ? '#1e88e5' : '#eee', color: activeStep === 'step1_original' ? '#fff' : '#000', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>1. Awal</button>
                <button onClick={() => setActiveStep('step2_no_epsilon')} style={{ padding: '8px', fontWeight: activeStep === 'step2_no_epsilon' ? 'bold' : 'normal', backgroundColor: activeStep === 'step2_no_epsilon' ? '#1e88e5' : '#eee', color: activeStep === 'step2_no_epsilon' ? '#fff' : '#000', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>2. Tanpa Epsilon</button>
                <button onClick={() => setActiveStep('step3_no_unit')} style={{ padding: '8px', fontWeight: activeStep === 'step3_no_unit' ? 'bold' : 'normal', backgroundColor: activeStep === 'step3_no_unit' ? '#1e88e5' : '#eee', color: activeStep === 'step3_no_unit' ? '#fff' : '#000', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>3. Tanpa Unit</button>
                <button onClick={() => setActiveStep('step4_cnf')} style={{ padding: '8px', fontWeight: activeStep === 'step4_cnf' ? 'bold' : 'normal', backgroundColor: activeStep === 'step4_cnf' ? '#4caf50' : '#eee', color: activeStep === 'step4_cnf' ? '#fff' : '#000', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>4. Final (CNF)</button>
              </div>
              <div style={{ padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '5px', border: '1px dashed #aaa' }}>
                {renderGrammar(result[activeStep])}
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', color: '#888', marginTop: '50px' }}>Klik tombol konversi untuk melihat hasil transformasi langkah demi langkah.</div>
          )}
        </div>
      </div>
    </div>
  );
}