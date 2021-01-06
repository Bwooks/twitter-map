import * as React from 'react'
import { useRef, useEffect, useState } from 'react'
import Mapboxgl from 'mapbox-gl'
import * as PropTypes from 'prop-types'
export const MAP_CONTAINER_EL_ID = 'map-container'
Mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN

export const Map = ({ markers }) => {
    const [ map, setMap ] = useState(null)
    const mapContainer = useRef(null)
    const [ mappedMarkers, setMappedMarkers ] = useState({})

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
        markers.forEach((marker) => {
            const mappedMarker = mappedMarkers[marker.id]
            if (mappedMarker && mappedMarker.visible !== marker.visible) {
                mappedMarker._element.style.visibility = marker.visible ? 'visible' : 'hidden'
                mappedMarker.visible = marker.visible
            }
        })
    }, [markers])


    useEffect(() => {
        if (markers.length) {
            const marker = markers[markers.length - 1]
            const mappedMarker = new Mapboxgl.Marker()
                .setLngLat([marker.lat, marker.lng])
                .addTo(map)
            mappedMarker._element.id = marker.id
            setMappedMarkers(mappedMarkers => ({ ...mappedMarkers, [marker.id]: { ...mappedMarker, visible: marker.visible }}))
        }
    }, [markers.length])
    return (
        <div id={MAP_CONTAINER_EL_ID} ref={(el) => mapContainer.current = el } style={{ height: "100vh" }} />
    )
}

Map.propTypes = {
    markers: PropTypes.array.isRequired
}
