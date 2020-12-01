import React, { useRef, useEffect, useState } from 'react'
import Mapboxgl from 'mapbox-gl'

export const MAP_CONTAINER_EL_ID = 'map-container'
const ACCESS_TOKEN = 'pk.eyJ1IjoiYndvb2tzIiwiYSI6ImNqMTAxbGRxaTAzYmMzMnBlODc1YjV0MDIifQ.muirWcIWDICvw--qWM2MjQ'

export const Map = () => {

    const [ marker, setMarker ] = useState(null)

    useEffect(() => {
        setTimeout(() => {
            if (marker) {
                marker.remove()
            }
        }, 2000)
    }, [marker])

    Mapboxgl.accessToken = ACCESS_TOKEN
    const mapContainer = useRef(null)
    let map

    useEffect(() => {
        map = new Mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            zoom: 9,
            center: [40, 40]
        })
    }, [])

    useEffect(() => {
       const fetchData = async() => {
           const response = await fetch('/api/tweets')
           const streamReader = response.body.getReader()
           const decoder = new TextDecoder()
           let stream
           while(!stream?.done) {
               stream = await streamReader.read()
               const decodedRes = decoder.decode(stream.value)
               let parsedRes
               try {
                   parsedRes = JSON.parse(decodedRes)
                   const marker = new Mapboxgl.Marker()
                       .setLngLat([parsedRes.lat, parsedRes.lng])
                       .addTo(map)
                   setMarker(marker)
               } catch(e) {
                   console.log("Failed to parse response", e)
               }
           }
       }
       fetchData()
    }, [])

    return (
        <div id={MAP_CONTAINER_EL_ID} ref={(el) => mapContainer.current = el } style={{ height: "100vh" }} />
    )
}
