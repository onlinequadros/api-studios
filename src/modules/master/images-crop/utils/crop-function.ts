import * as Jimp from 'jimp';
import * as JPEG from 'jpeg-js';

Jimp.decoders['image/jpeg'] = (data: Buffer) => JPEG.decode(data);

const crop = async (
  id: string,
  url: string,
  paramX: number,
  paramY: number,
  paramWidth: number,
  paramHeight: number,
): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    const image = await Jimp.read(url);
    image
      .crop(paramX, paramY, paramWidth, paramHeight)
      .write(`tmp/${id}.jpeg`, (res) => {
        resolve(`tmp/${id}.jpeg`);
      });
  });
};

export { crop };
