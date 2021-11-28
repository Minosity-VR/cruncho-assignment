
export type GoogleApiPlacesSearchStatus = 'OK' | 'ZERO_RESULTS' | 'INVALID_REQUEST' | 'OVER_QUERY_LIMIT' | 'REQUEST_DENIED' | 'UNKNOWN_ERROR'

export type GooglApiPlaces = {
    address_components?: Array<{}>,
    
}

export type GoogleApiData = {
    html_attributions: Array<string>,
    results: Array<GooglApiPlaces>,
    status: GoogleApiPlacesSearchStatus,
    error_message?: string,
    info_messages?: string,
    next_page_token?: string,
}