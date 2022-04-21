import './App.css';
import Stage1 from 'components/Stage1';
import { AppProvider } from 'context/AppContext';

function App() {

  return (
    <div className="App" style={{ height: window.innerHeight }}>
      <Stage1 />
    </div>
  );
}

export default App;
