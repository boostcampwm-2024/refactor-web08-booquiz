import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService extends Redis implements OnModuleInit, OnModuleDestroy{
    constructor() {
        super({
            host: 'localhost',
            port: Number(6379),
            lazyConnect: true,
        })
    }

    async onModuleInit() {
        await this.connect();
    }
    async onModuleDestroy() {
        await this.quit();
    }
}