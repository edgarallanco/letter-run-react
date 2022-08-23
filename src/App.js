import './App.css';
import Stage1 from 'components/Stage1';
import { useEffect, useState } from 'react';

function App() {
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  useEffect(() => {
    window.onresize = function () {
      setWindowHeight(window.innerHeight)
    }
  }, [])

  return (
    <div className='app' style={{ height: windowHeight }}>
      <Stage1 />
    </div>
  );
}



export default App;
