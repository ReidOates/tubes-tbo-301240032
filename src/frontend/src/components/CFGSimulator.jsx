import { useState } from 'react';
import axios from 'axios';
import { ReactFlow, Controls, Background, MarkerType } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

export default function CFGSimulator() {
  const [startSymbol, setStartSymbol] = useState('S');
  const [targetString, setTargetString] = useState('0110');
  const [rulesStr, setRulesStr] = useState(
    JSON.stringify({
      "S": ["0S0", "1S1", "e"]
    }, null, 2)
  );
  const [result, setResult] = useState(null);

  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  const handleSimulate = async () => {
    try {
      const payload = {
        rules: JSON.parse(rulesStr),
        start_symbol: startSymbol,
        target_string: targetString
      };

      const response = await axios.post('/api/cfg/parse', payload);
      const data = response.data.data;
      setResult(data);

      if (data.status === 'accepted' && data.tree) {
        const newNodes = [];
        const newEdges = [];

        // 1. Hitung kedalaman (depth) setiap node untuk posisi Y
        const depthMap = {};
        const calculateDepth = (nodeId, currentDepth) => {
          depthMap[nodeId] = currentDepth;
          const children = data.tree.filter(n => n.parent === nodeId);
          children.forEach(c => calculateDepth(c.id, currentDepth + 1));
        };

        const rootNode = data.tree.find(n => n.parent === null);
        if (rootNode) calculateDepth(rootNode.id, 0);

        // 2. Hitung jumlah node di setiap level untuk mengatur posisi X
        const depthCounters = {};

        data.tree.forEach((node) => {
          const depth = depthMap[node.id] || 0;
          if (depthCounters[depth] === undefined) depthCounters[depth] = 0;

          // Mengatur X agar menyebar, dan Y agar turun ke bawah
          const xPos = 200 + (depthCounters[depth] * 120) - (depth * 30); 
          const yPos = 50 + (depth * 100);

          depthCounters[depth]++;

          // Cek apakah node ini Non-Terminal (Huruf Besar) atau Terminal (Huruf Kecil/Angka)
          const isNonTerminal = /^[A-Z]$/.test(node.label);
          const isEpsilon = node.label === 'e';

          newNodes.push({
            id: node.id,
            position: { x: xPos, y: yPos },
            data: { label: isEpsilon ? 'ε' : node.label },
            style: {
              borderRadius: isNonTerminal ? '50%' : '5px', // Non-terminal = Bulat, Terminal = Kotak
              width: 50, height: 50,
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              border: '1px solid #555',
              backgroundColor: isEpsilon ? '#4a148c' : isNonTerminal ? '#1e88e5' : '#37474f',
              color: '#fff',
              fontWeight: 'bold',
              fontSize: '14px'
            }
          });

          // 3. Buat garis (Edge) dari Parent ke Child
          if (node.parent) {
            newEdges.push({
              id: `e-${node.parent}-${node.id}`,
              source: node.parent,
              target: node.id,
              type: 'smoothstep',
              markerEnd: { type: MarkerType.ArrowClosed },
              style: { stroke: '#555', strokeWidth: 1.5 }
            });
          }
        });

        setNodes(newNodes);
        setEdges(newEdges);
      } else {
        // Jika rejected, bersihkan kanvas
        setNodes([]);
        setEdges([]);
      }

    } catch (error) {
      alert("Error: Pastikan format JSON aturan CFG benar dan Backend menyala!");
      console.error(error);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>Modul 3: CFG & Parse Tree Simulator</h2>
      
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        {/* Panel Input */}
        <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '10px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
          <div>
            <label><strong>Start Symbol:</strong></label> 
            <input type="text" value={startSymbol} onChange={e => setStartSymbol(e.target.value)} style={{ width: '90%', padding: '8px' }} />
          </div>
          <div>
            <label><strong>Target String:</strong></label> 
            <input type="text" value={targetString} onChange={e => setTargetString(e.target.value)} style={{ width: '90%', padding: '8px' }} />
          </div>
          <div>
            <label><strong>Aturan Produksi (δ) - Format JSON:</strong></label><br/>
            <textarea 
              rows="6" 
              value={rulesStr} 
              onChange={e => setRulesStr(e.target.value)} 
              style={{ width: '90%', padding: '8px', fontFamily: 'monospace' }} 
            />
          </div>
          <button onClick={handleSimulate} style={{ padding: '12px', width: '100%', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
            Simulasikan Parse Tree
          </button>
        </div>

        {/* Panel Output & Graf */}
        <div style={{ flex: '2', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {result && (
            <div style={{ padding: '15px', backgroundColor: result.status === 'accepted' ? '#d4edda' : '#f8d7da', borderRadius: '5px' }}>
              <strong>Status: </strong> {result.status.toUpperCase()} <br/>
              {result.status === 'accepted' ? (
                <>
                  <strong style={{ marginTop: '10px', display: 'inline-block' }}>Leftmost Derivation: </strong><br/>
                  <code style={{ fontSize: '16px', color: '#d63384' }}>{result.derivation.join(' ➔ ')}</code>
                </>
              ) : (
                <strong>Alasan: </strong> + result.reason
              )}
            </div>
          )}

          <div style={{ width: '100%', height: '450px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#fafafa' }}>
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