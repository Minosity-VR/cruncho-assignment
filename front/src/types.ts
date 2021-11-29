// https://developers.google.com/maps/documentation/places/web-service/search-nearby#Geometry
type GoogleApiLatLngLiteral = {
    lat: number;
    lng: number;
};

// Custom Position & Restaurants Info type
export type RestaurantInfo = {
    businessStatus: string;
    location: GoogleApiLatLngLiteral;
    distanceInKMeters: number;
    name: string;
    priceLevel: number;
    rating: number;
};

export type PositionAndRestaurantsState = {
    lat: number;
    lng: number;
    restaurants: Array<RestaurantInfo>;
};

export type DisplayMapProps = {
    lat: number;
    lng: number;
    zoom?: number;
    restaurants: Array<RestaurantInfo>;
};
