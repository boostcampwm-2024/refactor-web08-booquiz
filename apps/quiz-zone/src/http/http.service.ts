import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { firstValueFrom, map } from 'rxjs';
import { HttpService } from '@nestjs/axios';
@Injectable()
export class CustomHttpService {
    constructor(private readonly httpService: HttpService) {}

    async get<T = any>(url: string, params?: any, headers?: any): Promise<T> {
        return await firstValueFrom(
            this.httpService.get<T>(url, { params, headers }).pipe(
                map((response: AxiosResponse<T>) => response.data),
            ),
        );
    }

    async post<T = any>(
        url: string,
        data?: any,
        params?: any,
        headers?: any,
    ): Promise<T> {
        return await firstValueFrom(
            this.httpService.post<T>(url, data, { params, headers }).pipe(
                map((response: AxiosResponse<T>) => response.data),
            ),
        );
    }

    async put<T = any>(url: string, data: any, params?: any): Promise<T> {
        return await firstValueFrom(
            this.httpService.put<T>(url, data, { params }).pipe(
                map((response: AxiosResponse<T>) => response.data),
            ),
        );
    }

    async patch<T = any>(url: string, data: any, params?: any): Promise<T> {
        return await firstValueFrom(
            this.httpService.patch<T>(url, data, { params }).pipe(
                map((response: AxiosResponse<T>) => response.data),
            ),
        );
    }

    async delete<T = any>(url: string, params?: any): Promise<T> {
        return await firstValueFrom(
            this.httpService.delete<T>(url, { params }).pipe(
                map((response: AxiosResponse<T>) => response.data),
            ),
        );
    }


}
