const { Firestore } = require('@google-cloud/firestore');

const db = new Firestore();

async function storeData(id, data) {
  const predictCollection = db.collection('predictions');
  await predictCollection.doc(id).set(data);
  console.log(`Prediction stored with id: ${id}`);
}

module.exports = { storeData };
