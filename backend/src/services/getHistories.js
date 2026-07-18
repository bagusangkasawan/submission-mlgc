const { Firestore } = require('@google-cloud/firestore');

const db = new Firestore();

async function getHistories() {
  const predictCollection = db.collection('predictions');
  const snapshot = await predictCollection.get();

  const histories = [];
  snapshot.forEach((doc) => {
    const data = doc.data();
    histories.push({
      id: doc.id,
      history: {
        result: data.result,
        createdAt: data.createdAt,
        suggestion: data.suggestion,
        id: data.id,
      },
    });
  });

  return histories;
}

module.exports = { getHistories };
