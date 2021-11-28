import React, { FunctionComponent } from 'react';
import { restaurantIconSvgAsString, userIconSvgAsString } from './SvgIconsAsStrings';
import { DisplayMapProps } from './types';

function addCustomMarker(H: any, map: any, lat: number, lng: number, svgIconAsString: string) {
    const customIcon = new H.map.Icon(svgIconAsString, { size: { w: 32, h: 32 } });
    const customMarker = new H.map.Marker({ lat, lng }, { icon: customIcon });

    map.addObject(customMarker);
}

export const DisplayMapFC: FunctionComponent<DisplayMapProps> = (props: DisplayMapProps) => {
    // Create a reference to the HTML element we want to put the map on
    const mapRef = React.useRef(null);

    /**
     * Create the map instance
     * While `useEffect` could also be used here, `useLayoutEffect` will render
     * the map sooner
     */
    React.useLayoutEffect(() => {
        console.log('useLayout');
        // `mapRef.current` will be `undefined` when this hook first runs; edge case that
        if (!mapRef.current) return;
        const H = (window as any).H;

        // Retrieve HERE API
        const platform = new H.service.Platform({
            apikey: process.env.REACT_APP_HERE_API_KEY,
        });
        const defaultLayers = platform.createDefaultLayers();

        // Retrieve the user localisation to instance the map centered on him
        // Create an instance of the map
        const hMap = new H.Map(mapRef.current, defaultLayers.vector.normal.map, {
            center: { lat: props.lat, lng: props.lng },
            zoom: props.zoom || 4,
            pixelRatio: window.devicePixelRatio || 1,
        });

        // Add a marker to display user location
        addCustomMarker(H, hMap, props.lat, props.lng, userIconSvgAsString);

        // Add a marker for each restaurant
        props.restaurants.forEach((restaurant) => {
            addCustomMarker(H, hMap, restaurant.location.lat, restaurant.location.lng, restaurantIconSvgAsString);
        });

        // MapEvents enables the event system
        // Behavior implements default interactions for pan/zoom (also on mobile touch environments)
        // This variable is unused and is present for explanatory purposes
        const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(hMap));

        // Create the default UI components to allow the user to interact with them
        // This variable is unused
        const ui = H.ui.UI.createDefault(hMap, defaultLayers);

        // This will act as a cleanup to run once this hook runs again.
        // This includes when the component un-mounts
        return () => {
            hMap.dispose();
        };
    }, [mapRef, props]); // This will run this hook every time this ref is updated

    return <div className='map' ref={mapRef} style={{ height: '100vh' }} />;
};
