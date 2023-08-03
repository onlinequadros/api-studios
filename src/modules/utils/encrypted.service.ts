import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class EncryptedService {
  async encryptedImageName(originalname) {
    const splitNameImage = originalname.split('.');
    const extension = splitNameImage.pop();
    const encryptedName = uuidv4(splitNameImage.shift());
    const encryptedImageName = encryptedName + '.' + extension;

    return encryptedImageName;
  }

  async addExtensionsInImageName(originalname) {
    const splitNameImage = originalname.split('.');
    const extension = splitNameImage.pop();
    const encryptedName = uuidv4(splitNameImage.shift());
    const encryptedImageName = encryptedName + '.' + extension;

    return encryptedImageName;
  }
}
