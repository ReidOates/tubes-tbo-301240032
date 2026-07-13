import DFASimulator from './components/DFASimulator';
import RegexSimulator from './components/RegexSimulator';

function App() {
  return (
    <div style={{ paddingBottom: '100px' }}>
      <h1 style={{ textAlign: 'center', margin: '20px 0' }}>Capstone Project: Otomata (TBO)</h1>
      <hr style={{ marginBottom: '40px' }}/>
      
      <DFASimulator />
      
      <hr style={{ margin: '60px 0' }}/>
      
      <RegexSimulator />
    </div>
  );
}

export default App;