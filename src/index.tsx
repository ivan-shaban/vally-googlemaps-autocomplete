import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import {Wrapper} from '@googlemaps/react-wrapper'
import App from './App'

ReactDOM.render(
    <React.StrictMode>
        <Wrapper apiKey={process.env.REACT_APP_GOOGLE_MAP_SECRET!} libraries={['places']}>
            <App/>
        </Wrapper>
    </React.StrictMode>,
    document.getElementById('root'),
)
