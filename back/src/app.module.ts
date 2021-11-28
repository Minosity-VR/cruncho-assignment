import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApiController } from './api/api.controller';
import { ApiService } from './api/api.service';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
    ],
    controllers: [ApiController],
    providers: [ApiService],
})
export class AppModule {}
