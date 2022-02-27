import React, {
    useEffect,
    useRef,
    useState,
} from 'react'
import './App.css'
import {InfoWindow} from './components/InfoWindow/InfoWindow'
import {PacCard} from './components/PacCard/PacCard'

function App() {
    const mapRef = useRef<HTMLDivElement | null>(null)
    const cardRef = useRef<HTMLDivElement | null>(null)
    const infoWindowRef = useRef<HTMLDivElement | null>(null)
    const [map, setMap] = useState<google.maps.Map>()
    const [place, setPlace] = useState<google.maps.places.PlaceResult|null>(null)

    useEffect(() => {
        if (mapRef.current === null || cardRef.current === null || infoWindowRef.current === null || map) {
            return
        }

        // @ts-ignore
        setMap(new window.google.maps.Map(mapRef.current, {
            center: {lat: 53.896622, lng: 27.55041 },
            zoom: 17,
            disableDoubleClickZoom: true,
            fullscreenControl: false,
            disableDefaultUI: true,
            zoomControl: false,
        }))
    }, [mapRef.current, cardRef.current, infoWindowRef.current])

    useEffect(() => {
        if (!map) {
            return
        }

        map.controls[google.maps.ControlPosition.TOP_RIGHT].push(cardRef.current)

        const center = {lat: 50.064192, lng: -130.605469}
        // Create a bounding box with sides ~10km away from the center point
        const defaultBounds = {
            north: center.lat + 0.1,
            south: center.lat - 0.1,
            east: center.lng + 0.1,
            west: center.lng - 0.1,
        }
        const input = document.getElementById('pac-input') as HTMLInputElement
        const options = {
            bounds: defaultBounds,
            componentRestrictions: {country: 'by'},
            fields: ['address_components', 'geometry', 'icon', 'name'],
            strictBounds: false,
        }

        const autocomplete = new google.maps.places.Autocomplete(input, options)

        // Set initial restriction to the greater list of countries.
        autocomplete.setComponentRestrictions({
            country: ['by'],
        })

        const southwest = {lat: 5.6108, lng: 136.589326}
        const northeast = {lat: 61.179287, lng: 2.64325}
        const newBounds = new google.maps.LatLngBounds(southwest, northeast)

        autocomplete.setBounds(newBounds)

        const infowindow = new google.maps.InfoWindow()
        infowindow.setContent(infoWindowRef.current)

        const marker = new google.maps.Marker({
            map,
            anchorPoint: new google.maps.Point(0, -40),
        })

        autocomplete.addListener('place_changed', () => {
            infowindow.close()
            marker.setVisible(false)

            const newPlace = autocomplete.getPlace()
            setPlace(newPlace)

            if (!newPlace.geometry || !newPlace.geometry.location) {
                // User entered the name of a Place that was not suggested and
                // pressed the Enter key, or the Place Details request failed.
                window.alert('No details available for input: \'' + newPlace.name + '\'')
                return
            }

            // If the place has a geometry, then present it on a map.
            if (newPlace.geometry.viewport) {
                map.fitBounds(newPlace.geometry.viewport)
            } else {
                map.setCenter(newPlace.geometry.location)
                map.setZoom(17) // Why 17? Because it looks good.
            }

            marker.setPosition(newPlace.geometry.location)
            marker.setVisible(true)
            infowindow.open(map, marker)
        })

        // Sets a listener on a given radio button. The radio buttons specify
        // the countries used to restrict the autocomplete search.
        function setupClickListener(id: string, countries: string[] | string) {
            const radioButton = document.getElementById(id) as HTMLElement

            radioButton.addEventListener('click', () => {
                autocomplete.setComponentRestrictions({country: countries})
            })
        }

        setupClickListener('changecountry-by', 'by')
        setupClickListener('changecountry-de', 'de')
    }, [map])

    return (
        <>
            <PacCard ref={cardRef}/>
            <div ref={mapRef} id="map"/>
            <InfoWindow ref={infoWindowRef} place={place}/>
        </>
    )
}

export default App
