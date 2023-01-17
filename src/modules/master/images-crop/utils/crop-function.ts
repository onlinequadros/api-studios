import * as Jimp from 'jimp';
import * as JPEG from 'jpeg-js';

Jimp.decoders['image/jpeg'] = (data: Buffer) =>
  JPEG.decode(data, { maxMemoryUsageInMB: 1024 });

const crop = async (
  id: string,
  url: string,
  paramX: number,
  paramY: number,
  paramWidth: number,
  paramHeight: number,
) => {
  const image = await Jimp.read(url);
  image.crop(paramX, paramY, paramWidth, paramHeight).write(`tmp/${id}.jpeg`);

  return `tmp/${id}.jpeg`;
};

export { crop };
