import * as React from 'react'
import { useEffect, useState } from 'react'
import * as ReactDOM from 'react-dom'
import "regenerator-runtime/runtime"
import { Map } from './components/Map'
import { TimeSlider } from './components/TimeSlider'
import { startStream, stopStream, readFromStream } from './api/tweetsAPI'

type Markers = {
    lat: string,
    lng: string
}
const App = () => {
    const [ markers, setMarkers ] = useState<Markers[]>([])

    const onStartStream = async() => {
        const stream = await startStream('/api/tweets')
        const streamValue = await readFromStream(stream?.body)
        const parsedValue = JSON.parse(streamValue)
        setMarkers([...markers, parsedValue])
    }

    useEffect(() => {
        const streamOnMount = async () => {
            await onStartStream()
        }
        streamOnMount()
    }, [])

    return (
        <div>
            <div>
                <button onClick={() => stopStream()}>Pause</button>
                <button onClick={async() => await onStartStream()}>Resume</button>
                <Slider />
            </div>
            <Map markers={markers}/>
        </div>
    )
}

const wrapper = document.getElementById('app-container')
ReactDOM.render(<App />, wrapper)
