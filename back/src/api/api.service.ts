import { Injectable } from '@nestjs/common';
import { RestaurantsQueryDto } from './api.dto';
import axiosRequestHandler from 'src/misc/axiosRequest';
import { GoogleApiData, GoogleApiLatLngLiteral, RestaurantInfo } from 'src/misc/types';
import { distanceCompute } from 'src/misc/distanceCompute';

@Injectable()
export class ApiService {
    // Set axios config (replace values in Google API URL)
    setAxiosConfig(args: { lat: number; lng: number; radius: number; type: string }) {
        const axiosConfig = {
            method: 'GET',
            url: `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${args.lat}%2C${args.lng}&radius=${args.radius}&type=${args.type}&key=${process.env.GOOGLE_PLACES_API_KEY}`,
            headers: {},
        };

        return axiosConfig;
    }

    // Fetch restaurants data
    async fetchRestaurants(axiosConfig: object, userPos: GoogleApiLatLngLiteral ): Promise<{
        success: boolean;
        restaurants?: Array<RestaurantInfo>;
        err?: {};
    }> {
        const response = await axiosRequestHandler(axiosConfig);

        if (!response.success) {
            return { success: false, err: response.err };
        }

        const googleApiData = response.data as GoogleApiData;

        switch (googleApiData.status) {
            case 'REQUEST_DENIED':
                return { success: false, err: 'Google API request denied' };
            case 'INVALID_REQUEST':
                return { success: false, err: 'Google API invalid request' };
            case 'OVER_QUERY_LIMIT':
                return { success: false, err: 'Google API query limit exceeded' };
            case 'UNKNOWN_ERROR':
                return { success: false, err: 'Google API unknown error' };
            case 'ZERO_RESULTS':
                return { success: true, restaurants: [] };
            case 'OK':
                break;
        }

        const restaurants: Array<RestaurantInfo> = [];

        googleApiData.results.forEach((restaurant) => {
            // In our case, we do not care about restaurants without locations, as we want to pin them on a map
            if (restaurant.geometry.location) {
                const restaurantInfo: RestaurantInfo = {
                    businessStatus: restaurant.business_status || 'Unknown',
                    distanceInKMeters: distanceCompute(userPos, restaurant.geometry.location),
                    location: restaurant.geometry.location,
                    name: restaurant.name || 'Unknown',
                    priceLevel: restaurant.price_level || -1,
                    rating: restaurant.rating || -1,
                }
                restaurants.push(restaurantInfo);
            }
        });

        return { success: true, restaurants };
    }

    async findAroundLoc(query: RestaurantsQueryDto): Promise<{
        success: boolean;
        restaurants?: Array<RestaurantInfo>;
        err?: {};
    }> {
        const axiosConfig = this.setAxiosConfig({
            lat: query.lat,
            lng: query.lng,
            radius: parseInt(process.env.SEARCH_RADIUS) || 50000, // default max radius
            type: 'restaurant',
        });

        const googleApiResponse = await this.fetchRestaurants(axiosConfig, { lat: query.lat, lng: query.lng });

        return googleApiResponse;
    }
}
