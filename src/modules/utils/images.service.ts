export class ImagesService {
  async split(image) {
    const result = image[0].split('.')[0];

    return result;
  }
}
