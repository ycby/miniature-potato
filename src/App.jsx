import './App.css'

import {Grid} from './Grid/Grid.jsx';

//Generate the initial state here

export const CELL_SIZE = 40;

function App() {

    return (
        <div className='main'>
            <h1>JS 05/2025 Puzzle</h1>
            <Grid />
        </div>
    )
}

export default App
