import * as React from 'react'
import { useRef, useEffect, useState } from 'react'
import Mapboxgl from 'mapbox-gl'
import * as PropTypes from 'prop-types'
export const MAP_CONTAINER_EL_ID = 'map-container'
Mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN

export const Map = ({ markers }) => {
    const [ map, setMap ] = useState(null)
    const mapContainer = useRef(null)

    useEffect(() => {
        const Map = new Mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            zoom: 9,
            center: [40, 40]
        })
        setMap(Map)
    }, [])

    useEffect(() => {
        if (markers.length) {
            const marker = markers[markers.length - 1]
            new Mapboxgl.Marker()
                .setLngLat([marker.lat, marker.lng])
                .addTo(map)
        }
    }, [markers])
    return (
        <div id={MAP_CONTAINER_EL_ID} ref={(el) => mapContainer.current = el } style={{ height: "100vh" }} />
    )
}

Map.propTypes = {
    markers: PropTypes.array.isRequired
}
