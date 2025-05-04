import './App.css'

import {Grid} from './Grid/Grid.jsx';

function App() {

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
  const constraints = [
    {
      name: 'square'
    },
    {
      name: 'product of digits = 20'
    },
    {
      name: 'multiple of 13'
    },
    {
      name: 'multiple of 32'
    },
    {
      name: 'divisble by each digit'
    },
    {
      name: 'product of digits = 25'
    },
    {
      name: 'divisible by each digit'
    },
    {
      name: 'odd palindrome'
    },
    {
      name: 'fibonacci'
    },
    {
      name: 'product of digits = 2025'
    },
    {
      name: 'prime'
    },
  ]

  return (
    <>
      <h1>Vite + React</h1>
      <Grid
        size={11}
        yellowCells={yellowCells}
        constraints={constraints}
      ></Grid>
    </>
  )
}

export default App
