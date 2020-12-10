import * as React from 'react'
import { useEffect, useState } from 'react'
import * as ReactDOM from 'react-dom'
import "regenerator-runtime/runtime"
import { Map } from './components/Map'
import { startStream, stopStream, readFromStream } from './api/tweetsAPI'
import { Slider }  from '@material-ui/core'

type Markers = {
    lat: string,
    lng: string
}

const App = () => {
    const [ markers, setMarkers ] = useState<Markers[]>([])
    const [ sliderValue, setSliderValue ] = useState<number|null>(markers.length)
    const onStartStream = async() => {
        const stream = await startStream('/api/tweets')
        await readFromStream(stream?.body, (streamValue) => {
            const parsedValue = JSON.parse(streamValue)
            setMarkers(markers => [...markers, parsedValue])
        })
    }

    useEffect(() => {
        const streamOnMount = async () => {
            await onStartStream()
        }
        streamOnMount()
    }, [])

    const onChangeSlider = (event: object, value: number|number[]) : void => {
        if (typeof value === 'number') {
            setSliderValue(value)
        }
    }

    return (
        <div>
            <div>
                <button onClick={() => stopStream()}>Pause</button>
                <button onClick={() => onStartStream()}>Resume</button>
                <Slider min={0} max={markers.length} value={sliderValue} onChange={(event, value) => onChangeSlider(event, value)} marks={true}/>
            </div>
            <Map markers={markers}/>
        </div>
    )
}

const wrapper = document.getElementById('app-container')
ReactDOM.render(<App />, wrapper)
