import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import admin from 'firebase-admin';
import serviceAccountJson from '../configuration/photocamerastore-3bac2-firebase-adminsdk-t4x5f-104a5b7129.json';
import _firestore from '@google-cloud/firestore';
import { ServiceAccount } from 'firebase-admin/lib/credential';
import PhotoCamera from '../model/PhotoCamera';
import Cart from '../model/Cart';
import { JwtAuthGuard } from '../auth/JwtAuthGuard';

@Controller()
export class FirebaseCartController {
  private db: _firestore.Firestore;

  constructor() {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccountJson as ServiceAccount),
    });

    this.db = admin.firestore();
    console.log('Firebase is up.');
  }

  @Get('cart/:username')
  @UseGuards(JwtAuthGuard)
  async getCart(@Param('username') username: string): Promise<Cart> {
    console.log(`> GET /cart/{${username}}`);
    return this.getCartFromFirebase(username);
  }

  private async getCartFromFirebase(username: string): Promise<Cart> {
    const snapshot = await this.db.collection('carts').get();

    for (const doc of snapshot.docs) {
      if (doc.id == username) {
        return doc.data() as Cart;
      }
    }

    return new Cart(username, []);
  }

  @Post('cart/:username')
  @UseGuards(JwtAuthGuard)
  async addToCart(@Param('username') username: string, @Body() photoCamera: PhotoCamera): Promise<number> {
    console.log(`> POST /cart/${username} add {${photoCamera.id}}`);

    const cart: Cart = await this.getCartFromFirebase(username);
    cart.photoCameras.push(photoCamera);

    const docRef = this.db.collection('carts').doc(username);
    await docRef.set(JSON.parse(JSON.stringify(cart)));
    return cart.photoCameras.length;
  }

  @Delete('cart/:username')
  @UseGuards(JwtAuthGuard)
  async removeFromCart(@Param('username') username: string, @Body() photoCamera: PhotoCamera): Promise<number> {
    console.log(`> DELETE /cart/${username} remove {${photoCamera.id}}`);

    const cart: Cart = await this.getCartFromFirebase(username);

    const index = cart.photoCameras.findIndex(camera => camera.id == photoCamera.id);
    if (index < 0) {
      return cart.photoCameras.length;
    }
    cart.photoCameras.splice(index, 1);

    const docRef = this.db.collection('carts').doc(username);
    await docRef.set(JSON.parse(JSON.stringify(cart)));
    return cart.photoCameras.length;
  }
}
