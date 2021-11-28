import React, { useEffect, useReducer } from 'react';
import { DisplayMapFC } from './DisplayMapComponent';
import './App.css';
import axiosRequestHandler from './AxiosRequest';
import { Method } from 'axios';
import { PositionAndRestaurantsState, RestaurantInfo } from './types';

function App() {
    function mapInfoUpdater(mapInfo: PositionAndRestaurantsState, action: PositionAndRestaurantsState) {
        const newMapInfo: PositionAndRestaurantsState = {
            lat: action.lat || mapInfo.lat,
            lng: action.lng || mapInfo.lng,
            restaurants: action.restaurants || mapInfo.restaurants,
        };
        return newMapInfo;
    }

    async function fetchRestaurantsAndUpdatePos(location: GeolocationPosition) {
        const method: Method = 'GET';
        const axiosConfig = {
            method,
            url: `${process.env.REACT_APP_BACK_API_URL}/restaurants?lat=${location.coords.latitude}&lng=${location.coords.longitude}`,
        };
        const response = await axiosRequestHandler(axiosConfig);

        if (response.success) {
            const restaurants: Array<RestaurantInfo> = response.data.restaurants;
            mapInfoReducer({ lat: location.coords.latitude, lng: location.coords.longitude, restaurants });
        }
        // else
        console.log('Error fetching nearby restaurants');
        return null;
    }

    const [mapInfo, mapInfoReducer] = useReducer(mapInfoUpdater, { lat: 0, lng: 0, restaurants: [] });

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(fetchRestaurantsAndUpdatePos);
    }, []);

    return (
        <div className='App'>
            <DisplayMapFC lat={mapInfo.lat} lng={mapInfo.lng} zoom={12} restaurants={mapInfo.restaurants} />
        </div>
    );
}

export default App;
