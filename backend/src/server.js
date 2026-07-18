require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const { loadModel } = require('./services/loadModel');

const app = express();
const PORT = process.env.PORT || 8080;

// Enable CORS for frontend access
app.use(cors());

// Start server after loading model
(async () => {
  try {
    const model = await loadModel();
    app.locals.model = model;
    console.log('Model loaded successfully');

    app.use('/', routes);

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to load model:', error);
    process.exit(1);
  }
})();

module.exports = app;
