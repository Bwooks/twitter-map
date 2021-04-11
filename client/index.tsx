import * as React from 'react'
import {BaseSyntheticEvent, useEffect, useState} from 'react'
import * as ReactDOM from 'react-dom'
import "regenerator-runtime/runtime"
import { Map } from './components/Map'
import { startStream, pauseStream, resumeStream } from './api/tweetsAPI'
import { queryText } from './api/searchAPI'
import { Slider, TextField }  from '@material-ui/core'

type Marker = {
    id: number,
    lat: string,
    lng: string,
    visible: boolean
}

const App = () => {
    const [ markers, setMarkers ] = useState<Marker[]>([])
    const [ sliderValue, setSliderValue ] = useState<number| number[] | null>(markers.length)
    const [ searchHits, setSearchHits ] = useState<number[] | null>([])

    const onStartStream = async() => {
        await startStream((chunk) => {
            const tweet = JSON.parse(chunk)
            const { text, id, coordinates: { lat, lng } } = tweet
            const marker = { text, lat, lng, id, visible: true }

            setMarkers(markers => markers.concat(marker) )
        })
    }

    useEffect(() => {
        setSliderValue(markers.length)
    }, [markers.length])

    useEffect(() => {
        if (!searchHits.length) {
            setAllMarkersVisibility(true)
            return
        }

        markers.forEach((marker) => {
            const matchesMarker = searchHits.indexOf(marker.id)

            if (matchesMarker >= 0) {
                updateMarkerVisibility(marker, true)
            } else {
                updateMarkerVisibility(marker, false)
            }
        })
    }, [searchHits])

    const updateMarkerVisibility = (marker: Marker, visible: boolean) => {
        marker.visible = visible
        return marker
    }

    const setAllMarkersVisibility = (visibility: boolean) => {
        markers.forEach((marker) => {
            updateMarkerVisibility(marker, visibility)
        })
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

    const onChangeSearch = async(event: BaseSyntheticEvent): void => {
        const inputText = event.target.value

        if (!inputText) return

        const result = await queryText(inputText)
        const searchHits = result.data.hits.hits.map((hit) => {
            return hit._source.id
        })

        setSearchHits(searchHits)
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
                <button onClick={() => pauseStream()}>Pause</button>
                <button onClick={() => resumeStream()}>Resume</button>
                <Slider min={0} max={markers.length} value={sliderValue} marks={true} onChange={(event, value) => onChangeSlider(event, value)}/>
                <TextField fullWidth={true} onChange={onChangeSearch}/>
            </div>
            <Map markers={markers} />
        </div>
    )
}

const wrapper = document.getElementById('app-container')
ReactDOM.render(<App />, wrapper)
