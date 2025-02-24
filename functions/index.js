require('dotenv').config({ path: ['.env', '.env.default'] });
const { initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const { setGlobalOptions } = require('firebase-functions/v2');
const { onRequest } = require('firebase-functions/v2/https');
const logger = require('firebase-functions/logger');
const express = require('express');

setGlobalOptions({ region: 'asia-southeast1' });
initializeApp();
const db = getFirestore();

const app = express();
app.use(express.json());

async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }
  const idToken = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await getAuth().verifyIdToken(idToken);
    req.uid = decodedToken.uid;
    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};
app.use(authenticate);

app.get('/api/ping', (req, res) => {
  res.send('pong');
});

app.post('/api/groceryEntries', async (req, res) => {
  const { date, totalAmount, discountAmount } = req.body;
  if (!date || totalAmount === undefined || discountAmount === undefined) {
    return res.status(400).json({ error: 'date, totalAmount, discountAmount are required' });
  }
  const entryDate = new Date(date);
  if (isNaN(entryDate.getTime())) {
    return res.status(400).json({ error: 'Invalid date' });
  }
  
  const groceryData = {
    date: entryDate,
    totalAmount,
    discountAmount: discountAmount,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  };
  try {
    const docRef = await db
      .collection('users').doc(req.uid)
      .collection('groceryEntries').add(groceryData);
    return res.status(201).json({ id: docRef.id, ...groceryData });
  } catch (error) {
    logger.error('Error adding grocery entry:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/groceryEntries', async (req, res) => {
  try {
    const snapshot = await db
      .collection('users').doc(req.uid)
      .collection('groceryEntries').get();
    const entries = [];
    snapshot.forEach((doc) => {
      entries.push({ id: doc.id, ...doc.data() });
    });
    return res.json(entries);
  } catch (error) {
    logger.error('Error fetching grocery entries:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.patch('/api/groceryEntries/:id', async (req, res) => {
  const entryId = req.params.id;
  const { date, totalAmount, discountAmount } = req.body;
  const updateData = {};

  if (date) {
    const updatedDate = new Date(date);
    if (isNaN(updatedDate.getTime())) {
      return res.status(400).json({ error: 'Invalid date' });
    }
    updateData.date = updatedDate;
  }
  if (totalAmount !== undefined) updateData.totalAmount = totalAmount;
  if (discountAmount !== undefined) updateData.discountAmount = discountAmount;
  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ error: 'No valid fields provided for update' });
  }
  updateData.updatedAt = FieldValue.serverTimestamp();

  try {
    const entryRef = db
      .collection('users').doc(req.uid)
      .collection('groceryEntries').doc(entryId);
    const docSnapshot = await entryRef.get();
    if (!docSnapshot.exists) {
      return res.status(404).json({ error: 'Grocery entry not found' });
    }
    await entryRef.update(updateData);
    const updatedDoc = await entryRef.get();
    return res.json({ id: entryId, ...updatedDoc.data() });
  } catch (error) {
    logger.error('Error updating grocery entry:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/api/groceryEntries/:id', async (req, res) => {
  const entryId = req.params.id;
  try {
    const entryRef = db
      .collection('users').doc(req.uid)
      .collection('groceryEntries').doc(entryId);
    const docSnapshot = await entryRef.get();
    if (!docSnapshot.exists) {
      return res.status(404).json({ error: 'Grocery entry not found' });
    }
    await entryRef.delete();
    return res.status(204).send();
  } catch (error) {
    logger.error('Error deleting grocery entry:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

exports.app = onRequest(app);
