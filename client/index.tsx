import * as React from 'react'
import { useEffect, useState } from 'react'
import * as ReactDOM from 'react-dom'
import "regenerator-runtime/runtime"
import { Map } from './components/Map'
import { startStream, stopStream } from './api/tweetsAPI'
import { Slider }  from '@material-ui/core'
import { nanoid } from 'nanoid'

type Marker = {
    id: string,
    lat: string,
    lng: string,
    visible: boolean
}

const App = () => {
    const [ markers, setMarkers ] = useState<Marker[]>([])
    const [ sliderValue, setSliderValue ] = useState<number|null>(markers.length)

    const onStartStream = async() => {
        await startStream((chunk) => {
            const marker = JSON.parse(chunk)
            setMarkers(markers => [...markers, { ...marker, visible: true, id: `id-${nanoid()}` }])
        })
    }

    useEffect(() => {
        setSliderValue(markers.length)
    }, [markers.length])

    const updateMarkerVisibility = (marker: Marker, visible: boolean) => {
        marker.visible = visible
        return marker
    }

    const onChangeSlider = (event: object, value: number|number[]) : void => {
        let updatedMarkers = null
        if (value < sliderValue) {         // Hide markers until value === sliderValue
            updatedMarkers = markers.map((marker, index) => {
                if (index >= value && index <= sliderValue) {
                    return updateMarkerVisibility(marker, false)
                } else {
                    return marker
                }
            })
        } else if (value > sliderValue) {        // Show markers until value === sliderValue
            updatedMarkers = markers.map((marker, index) => {
                if (index >= sliderValue && index <= value) {
                    return updateMarkerVisibility(marker, true)
                } else {
                    return marker
                }
            })
        }

        setSliderValue(value)
        updatedMarkers && setMarkers(updatedMarkers)
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
                <button onClick={() => onStartStream()}>Resume</button>
                <Slider min={0} max={markers.length} value={sliderValue} marks={true} onChange={(event, value) => onChangeSlider(event, value)}/>
            </div>
            <Map markers={markers}/>
        </div>
    )
}

const wrapper = document.getElementById('app-container')
ReactDOM.render(<App />, wrapper)
