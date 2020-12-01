import React from 'react'
import ReactDOM from 'react-dom'
import { MAP_CONTAINER_EL_ID, Map } from './components/Map'
import "regenerator-runtime/runtime"


const App = () => {
    return (
        <div>
            <Map />
        </div>
    )
}

const wrapper = document.getElementById('app-container')
ReactDOM.render(<App />, wrapper)
