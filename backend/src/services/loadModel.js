const tf = require('@tensorflow/tfjs-node');

async function loadModel() {
  await tf.ready();
  console.log(`TF.js backend: ${tf.getBackend()}`);

  const bucketName = process.env.MODEL_BUCKET_NAME;
  const modelFileName = process.env.MODEL_FILE_NAME || 'model.json';

  if (!bucketName) {
    throw new Error('MODEL_BUCKET_NAME environment variable is required');
  }

  const modelUrl = `https://storage.googleapis.com/${bucketName}/${modelFileName}`;
  console.log(`Loading model from Cloud Storage: ${modelUrl}`);
  const model = await tf.loadGraphModel(modelUrl);
  console.log('Model loaded successfully from Cloud Storage');
  return model;
}

module.exports = { loadModel };
