import { useState } from 'react';
import axios from 'axios';
import { ReactFlow, Controls, Background, MarkerType } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

export default function RegexSimulator() {
  const [regex, setRegex] = useState('(a|b)*a');
  const [nfaResult, setNfaResult] = useState(null);
  
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  const handleConvert = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/regex/convert', { regex });
      const nfaData = response.data.data.nfa;
      setNfaResult(nfaData);

      // --- GENERATE GRAF OTOMATIS DARI HASIL NFA BACKEND ---
      const maxCols = 5; // Lebarkan sedikit karena node Regex biasanya banyak
      
      const newNodes = nfaData.states.map((state, index) => {
        const isStart = state === nfaData.start_state;
        const isAccept = nfaData.accept_states.includes(state);
        
        const col = index % maxCols;
        const row = Math.floor(index / maxCols);
        
        return {
          id: state,
          position: { x: 100 + (col * 150), y: 100 + (row * 120) },
          data: { label: `${state} ${isStart ? '(Start)' : ''} ${isAccept ? '(Final)' : ''}` },
          style: {
            borderRadius: '50%', width: 65, height: 65,
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            border: isAccept ? '4px double #333' : '2px solid #333',
            backgroundColor: isStart ? '#e0f7fa' : '#fff',
            fontWeight: 'bold',
            fontSize: '12px' // Kecilkan font sedikit
          }
        };
      });

      const newEdges = [];
      Object.keys(nfaData.transitions).forEach((fromState) => {
        Object.keys(nfaData.transitions[fromState]).forEach((symbol) => {
          // Karena NFA, targetnya adalah array
          const targetStates = nfaData.transitions[fromState][symbol];
          targetStates.forEach((toState) => {
             newEdges.push({
               id: `e-${fromState}-${toState}-${symbol}`,
               source: fromState,
               target: toState,
               label: symbol === 'e' ? 'ε' : symbol, // Ubah 'e' jadi simbol epsilon
               type: fromState === toState ? 'step' : 'smoothstep',
               markerEnd: { type: MarkerType.ArrowClosed },
               style: { stroke: symbol === 'e' ? '#999' : '#000', strokeDasharray: symbol === 'e' ? '5,5' : '0' } // Epsilon digaris putus-putus
             });
          });
        });
      });

      setNodes(newNodes);
      setEdges(newEdges);
      
    } catch (error) {
      alert("Error memproses Regex. Pastikan format valid!");
      console.error(error);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>Modul 2: Konversi Regex ke NFA</h2>
      
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '10px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
          <label><strong>Masukkan Regular Expression:</strong></label>
          <input 
            type="text" 
            value={regex} 
            onChange={(e) => setRegex(e.target.value)} 
            placeholder="Contoh: (a|b)*c"
            style={{ padding: '10px', fontSize: '16px' }}
          />
          <button onClick={handleConvert} style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
            Konversi ke NFA (Thompson)
          </button>

          {nfaResult && (
            <div style={{ marginTop: '20px', fontSize: '14px' }}>
              <h4>Hasil 5-Tuple NFA:</h4>
              <p><strong>States (Q):</strong> {nfaResult.states.join(', ')}</p>
              <p><strong>Alphabet (Σ):</strong> {nfaResult.alphabet.join(', ')}</p>
              <p><strong>Start (q0):</strong> {nfaResult.start_state}</p>
              <p><strong>Final (F):</strong> {nfaResult.accept_states.join(', ')}</p>
            </div>
          )}
        </div>

        <div style={{ flex: '2', height: '500px', border: '1px solid #ccc', borderRadius: '8px' }}>
          <ReactFlow nodes={nodes} edges={edges} fitView>
            <Background />
            <Controls />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}