import React, { useEffect, useReducer } from 'react';
import { DisplayMapFC } from './DisplayMapComponent';
import './App.css';

type PositionState = {
    lat: number;
    lng: number;
};

type newPosition = GeolocationPosition | { coords: { latitude?: number; longitude?: number } };

function App() {
    function positionReducer(position: PositionState, action: newPosition) {
        return { lat: action.coords.latitude || position.lat, lng: action.coords.longitude || position.lng };
    }

    const [position, posReducer] = useReducer(positionReducer, { lat: 50, lng: 5 });

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(posReducer);
    }, []);

    return (
        <div className='App'>
            <DisplayMapFC lat={position.lat} lng={position.lng} zoom={12} />
        </div>
    );
}

export default App;
