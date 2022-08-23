import React from 'react';
import './App.css';
import Stage1 from 'components/Stage1';
import './assets/css/components.css';
import './assets/css/fargamot.css';
import './assets/css/normalize.css';

function App() {
  return (
    <div className='app'>

        <Stage1 />
    </div>
  );
}

window.onresize = function() {
  document.querySelector('.app').classList.height = window.innerHeight;
  console.log('resized!')
  console.log(window.innerHeight)
  console.log(document.querySelector('.app').classList.height)
}

export default App;
