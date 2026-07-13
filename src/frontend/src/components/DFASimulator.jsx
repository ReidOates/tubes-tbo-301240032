import { useState, useEffect } from 'react';
import axios from 'axios';
import { ReactFlow, Controls, Background, MarkerType } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

export default function DFASimulator() {
  const [activeTab, setActiveTab] = useState('dfa'); // dfa, nfa2dfa, moore, mealy
  
  // State Input Form
  const [states, setStates] = useState('q0, q1, q2');
  const [alphabet, setAlphabet] = useState('0, 1');
  const [startState, setStartState] = useState('q0');
  const [acceptStates, setAcceptStates] = useState('q2');
  const [inputString, setInputString] = useState('01');
  
  // JSON Strings (Dipisah agar tidak bentrok saat ganti tab)
  const [transDFA, setTransDFA] = useState(JSON.stringify({ "q0": { "0": "q1", "1": "q0" }, "q1": { "0": "q1", "1": "q2" }, "q2": { "0": "q2", "1": "q2" } }, null, 2));
  const [transNFA, setTransNFA] = useState(JSON.stringify({ "q0": { "0": ["q0", "q1"], "1": ["q0"] }, "q1": { "1": ["q2"] }, "q2": {} }, null, 2));
  const [transMoore, setTransMoore] = useState(JSON.stringify({ "q0": { "0": "q1", "1": "q0" }, "q1": { "0": "q1", "1": "q2" }, "q2": { "0": "q0", "1": "q2" } }, null, 2));
  const [outputMoore, setOutputMoore] = useState(JSON.stringify({ "q0": "A", "q1": "B", "q2": "C" }, null, 2));
  const [transMealy, setTransMealy] = useState(JSON.stringify({ "q0": { "0": {"next": "q1", "output": "x"}, "1": {"next": "q0", "output": "y"} }, "q1": { "0": {"next": "q1", "output": "y"}, "1": {"next": "q2", "output": "x"} }, "q2": { "0": {"next": "q0", "output": "x"}, "1": {"next": "q2", "output": "x"} } }, null, 2));

  const [result, setResult] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  // Fungsi dinamis untuk menggambar graf berdasarkan tipe mesin
  const drawGraph = (machineData, mode) => {
    try {
      const stateList = machineData.states || [];
      const acceptList = machineData.accept_states || [];
      const transObj = machineData.transitions || {};
      const mooreOut = machineData.output_table || {};

      const maxCols = 4;
      const newNodes = stateList.map((state, index) => {
        const isStart = state === machineData.start_state;
        const isAccept = acceptList.includes(state);
        
        let label = state;
        if (mode === 'moore') label = `${state} | ${mooreOut[state] || ''}`;
        
        const col = index % maxCols;
        const row = Math.floor(index / maxCols);

        return {
          id: state,
          position: { x: 100 + (col * 180), y: 100 + (row * 150) },
          data: { label: `${label} ${isStart ? '(Start)' : ''}` },
          style: {
            borderRadius: '50%', width: 75, height: 75,
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            border: mode === 'dfa' && isAccept ? '4px double #1e88e5' : '2px solid #555',
            backgroundColor: isStart ? '#4a148c' : '#2d2d2d',
            color: '#fff', fontWeight: 'bold', fontSize: '12px'
          }
        };
      });

      const newEdges = [];
      Object.keys(transObj).forEach((fromState) => {
        Object.keys(transObj[fromState]).forEach((symbol) => {
          let toState = transObj[fromState][symbol];
          let edgeLabel = symbol;

          if (mode === 'mealy') {
            edgeLabel = `${symbol} / ${toState.output}`;
            toState = toState.next;
          }

          // Handle NFA arrays
          const targets = Array.isArray(toState) ? toState : [toState];
          
          targets.forEach(target => {
            newEdges.push({
              id: `e-${fromState}-${target}-${symbol}`,
              source: fromState,
              target: target,
              label: edgeLabel,
              type: fromState === target ? 'step' : 'smoothstep',
              markerEnd: { type: MarkerType.ArrowClosed },
              style: { stroke: '#888', strokeWidth: 1.5 },
              labelStyle: { fill: '#fff', fontWeight: 700 },
              labelBgStyle: { fill: '#333' }
            });
          });
        });
      });

      setNodes(newNodes);
      setEdges(newEdges);
    } catch (e) {
      console.error("Gagal menggambar graf:", e);
    }
  };

  const handleSimulate = async () => {
    setResult(null);
    try {
      let endpoint = '';
      let payload = {
        states: states.split(',').map(s => s.trim()),
        alphabet: alphabet.split(',').map(s => s.trim()),
        start_state: startState.trim(),
        input_string: inputString
      };

      if (activeTab === 'dfa') {
        endpoint = '/api/automata/dfa';
        payload.accept_states = acceptStates.split(',').map(s => s.trim());
        payload.transitions = JSON.parse(transDFA);
      } else if (activeTab === 'nfa2dfa') {
        endpoint = '/api/automata/nfa-to-dfa';
        payload.accept_states = acceptStates.split(',').map(s => s.trim());
        payload.transitions = JSON.parse(transNFA);
      } else if (activeTab === 'moore') {
        endpoint = '/api/automata/moore';
        payload.transitions = JSON.parse(transMoore);
        payload.output_table = JSON.parse(outputMoore);
      } else if (activeTab === 'mealy') {
        endpoint = '/api/automata/mealy';
        payload.transitions = JSON.parse(transMealy);
      }

      const response = await axios.post(`http://127.0.0.1:5000${endpoint}`, payload);
      
      if (activeTab === 'nfa2dfa') {
        // NFA to DFA mereturn DFA hasil konversi
        const dfaResult = response.data.data.dfa;
        setResult({ type: 'conversion', message: 'Konversi Berhasil!', dfa: dfaResult });
        drawGraph(dfaResult, 'dfa');
      } else {
        setResult({ type: 'simulation', data: response.data.data });
        // Gambar graf berdasarkan input yang ada
        drawGraph({ ...payload, output_table: payload.output_table }, activeTab);
      }

    } catch (error) {
      alert("Error: Pastikan format JSON benar dan Backend berjalan!");
    }
  };

  // Styling
  const inputStyle = { width: '100%', padding: '8px', backgroundColor: '#2d2d2d', color: '#fff', border: '1px solid #444', borderRadius: '4px' };
  const tabBtnStyle = (tab) => ({
    padding: '10px 15px', cursor: 'pointer', border: 'none',
    backgroundColor: activeTab === tab ? '#1e88e5' : '#333',
    color: '#fff', fontWeight: 'bold', borderRadius: '5px 5px 0 0'
  });

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', color: '#333' }}>
      <h2 style={{ marginBottom: '20px' }}>Modul 1: Mesin Automata (FSA)</h2>
      
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '5px', borderBottom: '2px solid #1e88e5', marginBottom: '20px' }}>
        <button style={tabBtnStyle('dfa')} onClick={() => setActiveTab('dfa')}>DFA</button>
        <button style={tabBtnStyle('nfa2dfa')} onClick={() => setActiveTab('nfa2dfa')}>NFA ➔ DFA</button>
        <button style={tabBtnStyle('moore')} onClick={() => setActiveTab('moore')}>Moore Machine</button>
        <button style={tabBtnStyle('mealy')} onClick={() => setActiveTab('mealy')}>Mealy Machine</button>
      </div>

      <div style={{ display: 'flex', gap: '20px' }}>
        {/* Panel Kiri (Form) */}
        <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '10px', padding: '15px', backgroundColor: '#1e1e1e', color: '#fff', borderRadius: '8px' }}>
          <div><label>States (Q):</label> <input type="text" value={states} onChange={e => setStates(e.target.value)} style={inputStyle} /></div>
          <div><label>Alfabet (Σ):</label> <input type="text" value={alphabet} onChange={e => setAlphabet(e.target.value)} style={inputStyle} /></div>
          <div><label>Start State (q0):</label> <input type="text" value={startState} onChange={e => setStartState(e.target.value)} style={inputStyle} /></div>
          
          {(activeTab === 'dfa' || activeTab === 'nfa2dfa') && (
            <div><label>Final States (F):</label> <input type="text" value={acceptStates} onChange={e => setAcceptStates(e.target.value)} style={inputStyle} /></div>
          )}

          <div>
            <label>Transisi (δ) - JSON:</label>
            <textarea rows="6" style={{...inputStyle, fontFamily: 'monospace'}} 
              value={activeTab === 'dfa' ? transDFA : activeTab === 'nfa2dfa' ? transNFA : activeTab === 'moore' ? transMoore : transMealy} 
              onChange={e => {
                if (activeTab === 'dfa') setTransDFA(e.target.value);
                else if (activeTab === 'nfa2dfa') setTransNFA(e.target.value);
                else if (activeTab === 'moore') setTransMoore(e.target.value);
                else setTransMealy(e.target.value);
              }} 
            />
          </div>

          {activeTab === 'moore' && (
            <div>
              <label>Output Table (Λ) - JSON:</label>
              <textarea rows="3" style={{...inputStyle, fontFamily: 'monospace'}} value={outputMoore} onChange={e => setOutputMoore(e.target.value)} />
            </div>
          )}

          <div style={{ marginTop: '10px', padding: '15px', backgroundColor: '#333', borderRadius: '5px' }}>
            {(activeTab !== 'nfa2dfa') && (
              <>
                <label><strong>String Uji:</strong></label>
                <input type="text" value={inputString} onChange={e => setInputString(e.target.value)} style={{ ...inputStyle, marginBottom: '10px' }} />
              </>
            )}
            <button onClick={handleSimulate} style={{ padding: '12px', width: '100%', backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
              {activeTab === 'nfa2dfa' ? 'Konversi ke DFA' : 'Simulasikan Mesin'}
            </button>
          </div>
        </div>

        {/* Panel Kanan (Hasil & Graf) */}
        <div style={{ flex: '2', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          {/* Tampilan Hasil */}
          {result && result.type === 'simulation' && (
            <div style={{ padding: '15px', backgroundColor: result.data.status === 'accepted' || result.data.status === 'success' ? '#d4edda' : '#f8d7da', borderRadius: '5px' }}>
              <strong>Status: </strong> {result.data.status.toUpperCase()} <br/>
              {result.data.reason && <><strong>Alasan: </strong> {result.data.reason} <br/></>}
              {result.data.output !== undefined && <><strong>Output String: </strong> <span style={{ color: '#d63384', fontWeight: 'bold' }}>{result.data.output}</span> <br/></>}
              <strong>Trace: </strong> {result.data.trace.join(' ➔ ')}
            </div>
          )}

          {result && result.type === 'conversion' && (
            <div style={{ padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '5px' }}>
              <strong style={{ color: '#1e88e5' }}>{result.message}</strong> <br/>
              <strong>DFA States Baru: </strong> {result.dfa.states.join(' | ')} <br/>
              <strong>DFA Start: </strong> {result.dfa.start_state} <br/>
              <strong>DFA Final: </strong> {result.dfa.accept_states.join(' | ')}
            </div>
          )}

          {/* Kanvas React Flow */}
          <div style={{ width: '100%', height: '500px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#121212' }}>
            <ReactFlow nodes={nodes} edges={edges} fitView>
              <Background color="#333" />
              <Controls style={{ backgroundColor: '#fff' }} />
            </ReactFlow>
          </div>

        </div>
      </div>
    </div>
  );
}