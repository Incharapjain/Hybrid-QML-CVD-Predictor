// backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { EcgModule } from './ecg/ecg.module'; // Ensures the path references your controller module

@Module({
  imports: [EcgModule], // Registers your ECG endpoints inside the global runtime map
  controllers: [],
  providers: [],
})
export class AppModule {}