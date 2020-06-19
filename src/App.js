import React from 'react';
import Mainsurface from './mainsurface';
import {BrowserRouter, Route} from 'react-router-dom';


function App() {
  return (
    <BrowserRouter>
      <div className="App">
      <Route exact path="/" component={Mainsurface}/>
      </div>  
    </BrowserRouter>
  );
}

export default App;
