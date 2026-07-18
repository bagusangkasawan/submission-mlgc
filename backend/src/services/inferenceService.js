const tf = require('@tensorflow/tfjs');
const sharp = require('sharp');

async function inferenceService(model, imageBuffer) {
  try {
    // Decode & resize image using sharp, tapi BIARKAN channel aslinya
    const { data, info } = await sharp(imageBuffer)
      .resize(224, 224)
      .raw()               // Get raw pixel buffer (channels will be 1, 3, or 4)
      .toBuffer({ resolveWithObject: true });

    // Convert raw pixel data to tensor [1, 224, 224, channels]
    // Jika channels bukan 3 (misal gambar grayscale), model.predict akan melempar error!
    const tensor = tf.tensor4d(
      new Float32Array(data).map((v) => v / 255.0), // Normalize to [0, 1]
      [1, 224, 224, info.channels]
    );

    // Run prediction
    const prediction = model.predict(tensor);
    const result = await prediction.data();

    // Cleanup tensors to prevent memory leaks
    tensor.dispose();
    prediction.dispose();

    // Return the prediction score (0-1)
    return result[0];
  } catch (error) {
    console.error('Inference error:', error);
    throw new Error('Terjadi kesalahan dalam melakukan prediksi');
  }
}

module.exports = { inferenceService };
