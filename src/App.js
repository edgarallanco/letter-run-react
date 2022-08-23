import React, { useEffect, useState } from 'react';
import './App.css';
import Stage1 from 'components/Stage1';
import './assets/css/components.css';
import './assets/css/fargamot.css';
import './assets/css/normalize.css';

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
