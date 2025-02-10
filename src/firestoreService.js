// firestoreService.js
// This file provides functions to interact with the 'groceryEntries' Firestore collection

import { db } from './firebase';
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';

// Reference to the groceryEntries collection in Firestore
const groceryCollectionRef = collection(db, 'groceryEntries');

/**
 * Subscribes to real-time updates for the groceryEntries collection.
 * @param {function} callback - A function that receives the updated list of entries.
 * @returns {function} Unsubscribe function to stop listening for updates.
 */
export const subscribeToGroceryEntries = (callback) => {
  return onSnapshot(
    groceryCollectionRef,
    (snapshot) => {
      const entries = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(entries);
    },
    (error) => {
      console.error('Error fetching grocery entries:', error);
    }
  );
};

/**
 * Adds a new grocery entry to Firestore.
 * @param {Object} entry - The grocery entry to add (e.g., { date, totalAmount, discountAmount }).
 * @returns {Promise} Resolves with the document ID when successful.
 */
export const addGroceryEntry = async (entry) => {
  try {
    const docRef = await addDoc(groceryCollectionRef, entry);
    return docRef.id;
  } catch (error) {
    console.error('Error adding grocery entry:', error);
    throw error;
  }
};

/**
 * Updates an existing grocery entry.
 * @param {string} id - The document ID of the entry to update.
 * @param {Object} updatedData - The data to update.
 * @returns {Promise} Resolves when the update is complete.
 */
export const updateGroceryEntry = async (id, updatedData) => {
  try {
    const entryDoc = doc(db, 'groceryEntries', id);
    await updateDoc(entryDoc, updatedData);
  } catch (error) {
    console.error('Error updating grocery entry:', error);
    throw error;
  }
};

/**
 * Deletes a grocery entry from Firestore.
 * @param {string} id - The document ID of the entry to delete.
 * @returns {Promise} Resolves when the deletion is complete.
 */
export const deleteGroceryEntry = async (id) => {
  try {
    const entryDoc = doc(db, 'groceryEntries', id);
    await deleteDoc(entryDoc);
  } catch (error) {
    console.error('Error deleting grocery entry:', error);
    throw error;
  }
};
