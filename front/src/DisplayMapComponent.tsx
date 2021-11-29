import React, { FunctionComponent } from 'react';
import { restaurantIconSvgAsString, userIconSvgAsString } from './SvgIconsAsStrings';
import { DisplayMapProps, RestaurantInfo } from './types';

/**
 * Creates a new marker and adds it to a group
 */
function addMarkerToGroup(H: any, group: any, lat: number, lng: number, customIcon: string, html: string) {
    const customMarker = new H.map.Marker({ lat, lng }, { icon: customIcon });
    // add custom data to the marker
    customMarker.setData(html);
    group.addObject(customMarker);
}

/**
 * Add the restaurants markers.
 * Hovering or touching on a marker opens an infobubble which holds HTML content related to the marker.
 */
function addRestaurantsInfoBubbles(H: any, map: any, ui: any, restaurants: Array<RestaurantInfo>) {
    const customRestaurantIcon = new H.map.Icon(restaurantIconSvgAsString, { size: { w: 32, h: 32 } });

    const group = new H.map.Group();

    // add 'pointerenter' event listener, that opens info bubble, to the group
    group.addEventListener(
        'pointerenter',
        function (evt: any) {
            // event target is the marker itself, group is a parent event target
            // for all objects that it contains
            const bubble = new H.ui.InfoBubble(evt.target.getGeometry(), {
                // read custom data
                content: evt.target.getData(),
            });

            //remove infobubbles
            // ui.getBubbles().forEach((bub: any) => ui.removeBubble(bub));
            // show info bubble
            ui.addBubble(bubble);

            bubble.getElement().addEventListener(
                'pointerleave',
                function (evt: any) {
                    console.log('PointerLeave');
                    ui.removeBubble(bubble);
                },
                true,
            );
        },
        true,
    );

    restaurants.forEach((restaurant) => {
        addMarkerToGroup(
            H,
            group,
            restaurant.location.lat,
            restaurant.location.lng,
            customRestaurantIcon,
            `<div><h4>${restaurant.name}</h4></div>` +
                `<div>Rate: ${restaurant.rating} ⭐<br />Crow fligth distance: ${restaurant.distanceInKMeters} km</div>`,
        );
    });

    map.addObject(group);
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

        // MapEvents enables the event system
        // Behavior implements default interactions for pan/zoom (also on mobile touch environments)
        // This variable is unused and is present for explanatory purposes
        const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(hMap));

        // Create the default UI components to allow the user to interact with them
        // This variable is unused
        const ui = H.ui.UI.createDefault(hMap, defaultLayers);

        // Add a marker to display user location
        const customUserIcon = new H.map.Icon(userIconSvgAsString, { size: { w: 32, h: 32 } });
        const customMarker = new H.map.Marker({ lat: props.lat, lng: props.lng }, { icon: customUserIcon });
        hMap.addObject(customMarker);

        // Add a marker for each restaurant
        addRestaurantsInfoBubbles(H, hMap, ui, props.restaurants);

        // This will act as a cleanup to run once this hook runs again.
        // This includes when the component un-mounts
        return () => {
            hMap.dispose();
        };
    }, [mapRef, props]); // This will run this hook every time this ref is updated

    return <div className='map' ref={mapRef} style={{ height: '100vh' }} />;
};
