export const checkWaterMark = (watermarkCheck) => {
  const watermark =
    watermarkCheck.width > 2250 && watermarkCheck.height > 2200
      ? 'watermark-big'
      : watermarkCheck.width < 2250 &&
        watermarkCheck.height < 2200 &&
        watermarkCheck.width >= 1150 &&
        watermarkCheck.height >= 1150
      ? 'watermark-medium'
      : watermarkCheck.width < 1550 &&
        watermarkCheck.height < 1150 &&
        watermarkCheck.width >= 300 &&
        watermarkCheck.height >= 300
      ? 'watermark-small'
      : 'watermark-tiny';
  return watermark;
};
