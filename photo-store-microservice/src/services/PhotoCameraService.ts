import { Injectable } from '@nestjs/common';
import PhotoCamera from "../model/PhotoCamera";

@Injectable()
export class PhotoCameraService {
    private lastId: number = 0;
    private photoCameras: PhotoCamera[] = [];

    getAll(): PhotoCamera[] {
        return this.photoCameras;
    }

    add(photoCamera: PhotoCamera): PhotoCamera {
        photoCamera.id = this.lastId;
        this.lastId++;
        this.photoCameras.push(photoCamera);

        return photoCamera;
    }

    delete(photoCameraId: number): PhotoCamera {
        const index = this.photoCameras.findIndex(camera => camera.id == photoCameraId);

        if (index < 0) {
            return null;
        }

        const deletedPhotoCamera = this.photoCameras[index];
        this.photoCameras.splice(index, 1);

        return deletedPhotoCamera;
    }
}
