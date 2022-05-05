import './App.css';
import Stage1 from 'components/Stage1';
import Modal from 'components/Modal';
import {AppProvider} from 'context/AppContext';

function App() {

  return (
    <div className='App' style={{height: window.innerHeight}}>
      <AppProvider>
        <Stage1 />
      </AppProvider>
    </div>
  );
}

export default App;
