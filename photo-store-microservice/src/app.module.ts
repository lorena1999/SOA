import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PhotoCameraService } from "./services/PhotoCameraService";

@Module({
  imports: [],
  controllers: [AppController],
  providers: [PhotoCameraService]
})
export class AppModule {}
