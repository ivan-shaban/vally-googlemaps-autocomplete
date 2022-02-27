import React, {forwardRef} from 'react'

import styles from './InfoWindow.module.scss'
import classNames from 'classnames'

let lastPlace: google.maps.places.PlaceResult | null = null

export interface Props {
    readonly place: google.maps.places.PlaceResult | null
}

export const InfoWindow = forwardRef<HTMLDivElement, Props>(({
                                                                 place,
                                                             }, ref) => {
    const baseClasses = classNames(styles.base, {
        [styles.base__isVisible]: !!place?.geometry?.location,
    })

    if (place && lastPlace !== place) {
        console.table(place.address_components?.map((info) => ({
            ...info,
            types: info.types.join(','),
        })), ['long_name', 'short_name', 'types'])
        lastPlace = place
    }
    let address = ''

    if (place?.address_components) {
        address = [
            (place.address_components[0] &&
                place.address_components[0].short_name) ||
            '',
            (place.address_components[1] &&
                place.address_components[1].short_name) ||
            '',
            (place.address_components[2] &&
                place.address_components[2].short_name) ||
            '',
        ].join(' ')
    }

    return (
        <div className={baseClasses} ref={ref}>
            <p className={styles.header}>
                <img className={styles.icon} src={place?.icon || ''} width="16" height="16"/>
                <span className={styles.title}>{place?.name}</span><br/>
            </p>

            <span>{address}</span>
        </div>
    )
})
