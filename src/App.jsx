import './App.css'

import {Grid} from './Grid/Grid.jsx';
import {useState} from "react";

function App() {

  const [size, setSize] = useState(11);
  const [fixedSquares, setFixedSquares] = useState([]);

  //Generate the initial state here
  const yellowCells = [
    {x: 1, y: 3},
    {x: 1, y: 4},
    {x: 2, y: 4},
    {x: 2, y: 9},
    {x: 3, y: 8},
    {x: 3, y: 9},
    {x: 5, y: 5},
    {x: 6, y: 1},
    {x: 6, y: 2},
    {x: 6, y: 5},
    {x: 6, y: 6},
    {x: 7, y: 1},
    {x: 8, y: 4},
    {x: 8, y: 5},
    {x: 9, y: 4},
  ]

  return (
    <div className='main'>
      <h1>JS 05/2025 Puzzle</h1>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <label>Size: </label>
        <input
            id='sizeInput'
            name='sizeInput'
            type='number'
            min='0'
            max='20'
            value={size.toString()}
            onChange={e => {

              const sanitizedValue = e.target.value.replace(/^[^0-9]*$/, '');

              if (!/^[0-9]*$/.test(sanitizedValue)) return;

              setSize(isNaN(sanitizedValue) ? 0 : parseInt(sanitizedValue));
            }}
        />
      </div>
      <Grid
        size={size}
        mode='SET_FIXED'
      ></Grid>
    </div>
  )
}

export default App
