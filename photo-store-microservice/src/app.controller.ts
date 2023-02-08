import { Controller } from '@nestjs/common';
import { PhotoCameraService } from "./services/PhotoCameraService";
import { EventPattern, MessagePattern } from "@nestjs/microservices";
import PhotoCamera from "./model/PhotoCamera";

@Controller()
export class AppController {
  constructor(private readonly photoCameraService: PhotoCameraService) {}

  @MessagePattern({ cmd: 'get-all' })
  async getPhotoCameras(): Promise<PhotoCamera[]> {
    console.log("> get-all");
    return this.photoCameraService.getAll();
  }

  @MessagePattern({ cmd: 'add' })
  async addPhotoCamera(photoCamera: PhotoCamera): Promise<PhotoCamera> {
    console.log("> add");
    return this.photoCameraService.add(photoCamera);
  }

  @MessagePattern({ cmd: 'delete' })
  async deletePhotoCamera(photoCameraId: number): Promise<PhotoCamera> {
    console.log("> delete");
    return this.photoCameraService.delete(photoCameraId);
  }

  @EventPattern('read-event')
  async handleReadEvent(data: Record<string, unknown>) {
    console.log(`>>> Read event.`);
  }

  @EventPattern('write-event')
  async handleWriteEvent(data: Record<string, unknown>) {
    console.log(`>>> Write event.`);
  }
}
