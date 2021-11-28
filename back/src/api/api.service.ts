import { Injectable } from '@nestjs/common';
import { RestaurantsQueryDto } from './api.dto';
import axiosRequestHandler from 'src/misc/axiosRequest';

@Injectable()
export class ApiService {

    // Set axios config (replace values in Google API URL)
    setAxiosConfig(lat: number, lng: number, radius: number, type: string) {
        const axiosConfig = {
            method: 'GET',
            url: `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat}%2C${lng}&radius=${radius}&type=${type}&key=${process.env.GOOGLE_PLACES_API_KEY}`,
            headers: {},
        };

        return axiosConfig;
    }

    // Fetch restaurants data
    async fetchRestaurants(axiosConfig: object) {
        const restaurants = {}

        const response = await axiosRequestHandler(axiosConfig);
        
        if (!response.success) {
            return response;
        }

        response.data.results.forEach(element => {
            
        });
    }


    findAroundLoc(query: RestaurantsQueryDto): object {
        return { lat: query.lat, lng: query.lng };
    }
}
