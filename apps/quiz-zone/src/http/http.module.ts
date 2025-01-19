import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CustomHttpService } from './http.service';

@Module({
    imports: [HttpModule],
    providers: [CustomHttpService],
    exports: [CustomHttpService],
})
export class CustomHttpModule {}
