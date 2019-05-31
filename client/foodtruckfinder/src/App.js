import React from 'react';
import logo from './images/food-truck.png';
import './App.css';

  
function App() {
  function handleClick(e) {
    e.preventDefault();
    console.log('The link was clicked.');
  }
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo"/>
        <p>
        "Too many of us are not living our dreams because we are living our fears.” — Les Brown.
        </p>
        
        <a
          className="App-link"
          href="#" onClick={handleClick}
          target="_blank"
          rel="noopener noreferrer"
        >
          Find a Truck!
        </a>
      </header>
    </div>
  );
}

export default App;
