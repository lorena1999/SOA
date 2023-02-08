import PhotoCamera from './PhotoCamera';

export default class Cart {
  username: string;
  photoCameras: PhotoCamera[];

  constructor(username: string, photoCameras: PhotoCamera[]) {
    this.username = username;
    this.photoCameras = photoCameras;
  }
}
