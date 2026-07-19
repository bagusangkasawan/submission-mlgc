const crypto = require('crypto');
const { inferenceService } = require('./services/inferenceService');
const { storeData } = require('./services/storeData');
const { getHistories } = require('./services/getHistories');
const InputError = require('./exceptions/InputError');

const predictHandler = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 'fail',
        message: 'Terjadi kesalahan dalam melakukan prediksi',
      });
    }

    const model = req.app.locals.model;
    const image = req.file.buffer;

    const { label, suggestion } = await inferenceService(model, image);
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const data = {
      id,
      result: label,
      suggestion,
      createdAt,
    };

    await storeData(id, data);

    return res.status(201).json({
      status: 'success',
      message: 'Model is predicted successfully',
      data,
    });
  } catch (error) {
    if (error instanceof InputError) {
      return res.status(error.statusCode).json({
        status: 'fail',
        message: error.message,
      });
    }

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
