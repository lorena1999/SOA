import { SensorSize } from "./SensorSize";

export default class PhotoCamera {
    id: number;
    name: string;
    sensorSize: SensorSize;

    constructor(id: number, name: string, sensorSize: SensorSize) {
        this.id = id;
        this.name = name;
        this.sensorSize = sensorSize;
    }
}