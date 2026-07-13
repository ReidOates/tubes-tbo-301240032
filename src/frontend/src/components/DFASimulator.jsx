import { useState, useEffect } from 'react';
import axios from 'axios';
import { ReactFlow, Controls, Background, MarkerType } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

export default function DFASimulator() {
  // 1. STATE UNTUK DEFINISI FORMAL DFA (5-Tuple)
  const [states, setStates] = useState('q0, q1, q2');
  const [alphabet, setAlphabet] = useState('0, 1');
  const [startState, setStartState] = useState('q0');
  const [acceptStates, setAcceptStates] = useState('q2');
  // Transisi kita pakai format JSON String agar mudah diedit user
  const [transitionsStr, setTransitionsStr] = useState(
    JSON.stringify({
      "q0": { "0": "q1", "1": "q0" },
      "q1": { "0": "q1", "1": "q2" },
      "q2": { "0": "q2", "1": "q2" }
    }, null, 2)
  );

  const [inputString, setInputString] = useState('01');
  const [result, setResult] = useState(null);
  
  // State untuk diagram React Flow
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  // 2. FUNGSI UNTUK GENERATE DIAGRAM OTOMATIS DARI INPUT
  const generateGraph = () => {
    try {
      const stateList = states.split(',').map(s => s.trim());
      const acceptList = acceptStates.split(',').map(s => s.trim());
      const transObj = JSON.parse(transitionsStr);

// Mapping Nodes dengan Grid System
      const maxCols = 4; // Menentukan maksimal ada 4 node menyamping sebelum turun ke baris baru
      
      const newNodes = stateList.map((state, index) => {
        const isStart = state === startState.trim();
        const isAccept = acceptList.includes(state);
        
        // --- LOGIKA GRID ---
        const col = index % maxCols;       // Menghitung sisa bagi untuk posisi kolom
        const row = Math.floor(index / maxCols); // Menghitung pembulatan ke bawah untuk baris
        
        const xPos = 100 + (col * 200);
        const yPos = 100 + (row * 150);
        // -------------------

        return {
          id: state,
          position: { x: xPos, y: yPos },
          data: { label: `${state} ${isStart ? '(Start)' : ''} ${isAccept ? '(Final)' : ''}` },
          style: {
            borderRadius: '50%', width: 65, height: 65,
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            border: isAccept ? '4px double #333' : '2px solid #333',
            backgroundColor: isStart ? '#e0f7fa' : '#fff',
            fontWeight: 'bold'
          }
        };
      });

      // Mapping Edges (Panah)
      const newEdges = [];
      Object.keys(transObj).forEach((fromState) => {
        Object.keys(transObj[fromState]).forEach((symbol) => {
          const toState = transObj[fromState][symbol];
          newEdges.push({
            id: `e-${fromState}-${toState}-${symbol}`,
            source: fromState,
            target: toState,
            label: symbol,
            type: fromState === toState ? 'step' : 'smoothstep', // step = melingkar ke diri sendiri, smoothstep = panah melengkung
            markerEnd: { type: MarkerType.ArrowClosed } // Tambah ujung panah
          });
        });
      });

      setNodes(newNodes);
      setEdges(newEdges);
    } catch (error) {
      console.error("Format input salah saat menggambar graf:", error);
    }
  };

  // Gambar graf pertama kali saat komponen dimuat
  useEffect(() => {
    generateGraph();
  }, []); // [] artinya hanya dijalankan sekali saat awal

  // 3. FUNGSI HIT API KE BACKEND FLASK
  const handleSimulate = async () => {
    try {
      generateGraph(); // Update graf dulu sesuai input terbaru
      
      const payload = {
        states: states.split(',').map(s => s.trim()),
        alphabet: alphabet.split(',').map(s => s.trim()),
        start_state: startState.trim(),
        accept_states: acceptStates.split(',').map(s => s.trim()),
        input_string: inputString,
        transitions: JSON.parse(transitionsStr)
      };

      const response = await axios.post('http://127.0.0.1:5000/api/automata/dfa', payload);
      setResult(response.data.data);
    } catch (error) {
      alert("Error: Pastikan format JSON transisi benar dan backend Flask menyala!");
      console.error(error);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>Simulator DFA Dinamis</h2>
      
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        {/* Panel Kiri: Form Input 5-Tuple */}
        <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div><label>States (Q):</label> <input type="text" value={states} onChange={e => setStates(e.target.value)} style={{ width: '100%' }} /></div>
          <div><label>Alfabet (Σ):</label> <input type="text" value={alphabet} onChange={e => setAlphabet(e.target.value)} style={{ width: '100%' }} /></div>
          <div><label>Start State (q0):</label> <input type="text" value={startState} onChange={e => setStartState(e.target.value)} style={{ width: '100%' }} /></div>
          <div><label>Final States (F):</label> <input type="text" value={acceptStates} onChange={e => setAcceptStates(e.target.value)} style={{ width: '100%' }} /></div>
          
          <div>
            <label>Transisi (δ) - Format JSON:</label><br/>
            <textarea 
              rows="6" 
              value={transitionsStr} 
              onChange={e => setTransitionsStr(e.target.value)} 
              style={{ width: '100%', fontFamily: 'monospace' }} 
            />
          </div>
          
          <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
            <label><strong>String untuk Diuji:</strong></label>
            <input type="text" value={inputString} onChange={e => setInputString(e.target.value)} style={{ width: '100%', marginBottom: '10px' }} />
            <button onClick={handleSimulate} style={{ padding: '10px', width: '100%', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              Simulasikan & Update Graf
            </button>
          </div>
        </div>

        {/* Panel Kanan: Hasil & Graf */}
        <div style={{ flex: '2', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {result && (
            <div style={{ padding: '15px', backgroundColor: result.status === 'accepted' ? '#d4edda' : '#f8d7da', borderRadius: '5px' }}>
              <strong>Status: </strong> {result.status.toUpperCase()} <br/>
              <strong>Alasan: </strong> {result.reason} <br/>
              <strong>Trace: </strong> {result.trace.join(' ➔ ')}
            </div>
          )}

          <div style={{ width: '100%', height: '450px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <ReactFlow nodes={nodes} edges={edges} fitView>
              <Background />
              <Controls />
            </ReactFlow>
          </div>
        </div>
      </div>
    </div>
  );
}