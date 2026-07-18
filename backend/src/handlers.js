const { v4: uuidv4 } = require('uuid');
const { inferenceService } = require('./services/inferenceService');
const { storeData } = require('./services/storeData');
const { getHistories } = require('./services/getHistories');

const predictHandler = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 'fail',
        message: 'Terjadi kesalahan dalam melakukan prediksi',
      });
    }

    const model = req.app.locals.model;
    const imageBuffer = req.file.buffer;

    // Run inference
    const result = await inferenceService(model, imageBuffer);

    const id = uuidv4();
    const createdAt = new Date().toISOString();

    const isCancer = result > 0.5;
    const suggestion = isCancer
      ? 'Segera periksa ke dokter!'
      : 'Penyakit kanker tidak terdeteksi.';

    const data = {
      id,
      result: isCancer ? 'Cancer' : 'Non-cancer',
      suggestion,
      createdAt,
    };

    // Store to Firestore
    await storeData(id, data);

    return res.status(201).json({
      status: 'success',
      message: 'Model is predicted successfully',
      data,
    });
  } catch (error) {
    console.error('Prediction error:', error);
    return res.status(400).json({
      status: 'fail',
      message: 'Terjadi kesalahan dalam melakukan prediksi',
    });
  }
};

const getHistoriesHandler = async (req, res) => {
  try {
    const histories = await getHistories();
    return res.status(200).json({
      status: 'success',
      data: histories,
    });
  } catch (error) {
    console.error('Get histories error:', error);
    return res.status(500).json({
      status: 'fail',
      message: 'Terjadi kesalahan dalam mengambil riwayat prediksi',
    });
  }
};

module.exports = { predictHandler, getHistoriesHandler };
