import React, {forwardRef} from 'react'
import styles from './PacCard.module.scss'


export interface Props {
}

export const PacCard = forwardRef<HTMLDivElement, Props>((props, ref) => {
    return (
        <div className={styles.base} ref={ref}>
            <div>
                <div className={styles.title}>Countries</div>
                <div id="country-selector" className={styles.controls}>
                    <input type="radio" name="type" id="changecountry-by" defaultChecked/>
                    <label htmlFor="changecountry-by">Belarus</label>

                    <input
                        type="radio"
                        name="type"
                        id="changecountry-de"
                    />
                    <label htmlFor="changecountry-de">Germany</label>
                </div>
            </div>
            <div className={styles.container}>
                <input className={styles.input} id="pac-input" type="text" placeholder="Enter a location"/>
            </div>
        </div>
    )
})
