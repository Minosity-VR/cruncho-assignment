import { Get, Controller, Query } from '@nestjs/common';
import { ApiService } from './api.service';
import { RestaurantsQueryDto } from './api.dto';

@Controller('api')
export class ApiController {
    constructor(private readonly ApiService: ApiService) {}

    @Get('restaurants')
    async findAroundLoc(@Query() query: RestaurantsQueryDto): Promise<object> {
        console.log('Request on /api/restaurants');
        return this.ApiService.findAroundLoc(query);
    }
}
