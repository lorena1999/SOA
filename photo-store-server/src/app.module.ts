import { Module } from '@nestjs/common';
import { PhotoCameraController } from './controllers/PhotoCameraController';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PHOTO_CAMERA_SERVER, SECRET_KEY } from './configuration/Constraints';
import { UserService } from './auth/user.service';
import { LocalStrategy } from './auth/LocalStrategy';
import { AuthService } from './auth/AuthService';
import { AppController } from './controllers/AppController';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './auth/JwtStrategy';
import { FirebaseCartController } from './controllers/FirebaseCartController';
import WebsocketGateway from './controllers/WebsocketGateway';

@Module({
  imports: [ClientsModule.register([{
    name: PHOTO_CAMERA_SERVER,
    transport: Transport.TCP,
    options: {
      host: 'host.docker.internal', // if you run from Docker
      port: 3002,
    },
  }]),
    PassportModule,
    JwtModule.register({
      secret: SECRET_KEY,
      signOptions: { expiresIn: '10 days' },
    }),
  ],
  controllers: [AppController, PhotoCameraController, FirebaseCartController],
  providers: [UserService, AuthService, LocalStrategy, JwtModule, JwtStrategy, WebsocketGateway],
  exports: [UserService],
})
export class AppModule {}
