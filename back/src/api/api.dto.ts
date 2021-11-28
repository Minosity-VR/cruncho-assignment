import { IsNotEmpty, IsNumberString } from 'class-validator';

export class RestaurantsQueryDto {
    @IsNotEmpty()
    @IsNumberString()
    lat: number;

    @IsNotEmpty()
    @IsNumberString()
    lng: number;
}
