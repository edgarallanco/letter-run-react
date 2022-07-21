import React from 'react';
import './App.css';
import Stage1 from 'components/Stage1';
import './assets/css/components.css';
import './assets/css/fargamot.css';
import './assets/css/normalize.css';

function App() {

  return (
    <div className='App' style={{height: window.innerHeight}}>

        <Stage1 />
    </div>
  );
}

export default App;
