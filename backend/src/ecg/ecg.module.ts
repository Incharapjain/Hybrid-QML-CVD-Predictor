// backend/src/ecg/ecg.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { EcgController } from './ecg.controller';
import { EcgService } from './ecg.service'; // Points to the correctly named file

@Module({
  imports: [HttpModule], // Provides the HttpService used by EcgService
  controllers: [EcgController],
  providers: [EcgService],
})
export class EcgModule {}