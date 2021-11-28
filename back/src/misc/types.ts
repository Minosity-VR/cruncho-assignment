// https://developers.google.com/maps/documentation/places/web-service/search-nearby#PlacesSearchStatus
export type GoogleApiPlacesSearchStatus =
    | 'OK'
    | 'ZERO_RESULTS'
    | 'INVALID_REQUEST'
    | 'OVER_QUERY_LIMIT'
    | 'REQUEST_DENIED'
    | 'UNKNOWN_ERROR';

// https://developers.google.com/maps/documentation/places/web-service/search-nearby#Geometry
export type GoogleApiLatLngLiteral = {
    lat: number;
    lng: number;
};
type GoogleApiBounds = {
    northeast: GoogleApiLatLngLiteral;
    southwest: GoogleApiLatLngLiteral;
};
export type GoogleApiGeometry = {
    location: GoogleApiLatLngLiteral;
    viewport: GoogleApiBounds;
};

// https://developers.google.com/maps/documentation/places/web-service/search-nearby#Place
export type GooglApiPlaces = {
    address_components?: Array<{}>;
    adr_address?: string;
    business_status?: string;
    formatted_address?: string;
    formatted_phone_number?: string;
    geometry?: GoogleApiGeometry;
    icon?: string;
    icon_background_color?: string;
    icon_mask_base_uri?: string;
    international_phone_number?: string;
    name?: string;
    opening_hours?: {};
    permanently_closed?: boolean;
    photos?: Array<{}>;
    place_id?: string;
    plus_code?: {};
    price_level?: 0 | 1 | 2 | 3 | 4;
    rating?: number;
    reference?: string;
    reviews?: Array<{}>;
    scope?: string;
    types?: Array<{ string }>;
    url?: string;
    user_ratings_total?: number;
    utc_offset?: number;
    vicinity?: string;
    website?: string;
};

// https://developers.google.com/maps/documentation/places/web-service/search-nearby#nearby-search-responses
export type GoogleApiData = {
    html_attributions: Array<string>;
    results: Array<GooglApiPlaces>;
    status: GoogleApiPlacesSearchStatus;
    error_message?: string;
    info_messages?: string;
    next_page_token?: string;
};

// Custom Restaurant Info type
export type RestaurantInfo = {
    businessStatus: string;
    distanceInKMeters: number;
    location: GoogleApiLatLngLiteral;
    name: string,
    priceLevel: number;
    rating: number
};