// backend/src/ecg/ecg.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';

@Injectable()
export class EcgService {
  constructor(private readonly httpService: HttpService) {}

  async evaluateTelemetryWaveform(deviceId: string, telemetry: number[]): Promise<any> {
    const targetUrl = 'http://127.0.0.1:8000/api/v1/quantum-engine/predict';
    try {
      // Proxy packet telemetry to running Python sub-engine with explicit AxiosResponse typing
      const response: AxiosResponse<any> = await firstValueFrom(
        this.httpService.post(targetUrl, { lead_telemetry: telemetry })
      );
      
      return {
        status: 'success',
        device_id: deviceId,
        processed_timestamp: new Date().toISOString(),
        quantum_analysis: response.data,
      };
    } catch (error: any) {
      throw new InternalServerErrorException(`ML Engine Link Mismatch Error: ${error.message || error}`);
    }
  }
}