// backend/src/ecg/ecg.controller.ts
import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { EcgService } from './ecg.service'; // Points to the correctly named file

@Controller('api/v1/diagnose')
export class EcgController {
  constructor(private readonly ecgService: EcgService) {}

  @Post()
  async executeCvdAssessment(
    @Body() body: { device_id: string; lead_telemetry: number[] }
  ) {
    // Strict runtime payload verification map layer
    if (!body.device_id || !body.lead_telemetry) {
      throw new BadRequestException('Request payload must contain device_id and lead_telemetry arrays.');
    }
    
    // Forward the vetted packet parameters down to the core service layer
    return await this.ecgService.evaluateTelemetryWaveform(body.device_id, body.lead_telemetry);
  }
}