import React, { useState, useEffect } from 'react';
import GroceryForm from './GroceryForm';
import GroceryTable from './GroceryTable';
import { 
  subscribeToGroceryEntries, 
  addGroceryEntry, 
  updateGroceryEntry, 
  deleteGroceryEntry 
} from './firestoreService';
import './App.css';

function App() {
  // Initialize entries to an empty array and loading to true.
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [highlightedEntryId, setHighlightedEntryId] = useState(null);

  // Subscribe to Firestore and update both entries and loading state.
  useEffect(() => {
    const unsubscribe = subscribeToGroceryEntries((data) => {
      setEntries(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Handler for form submission: add a new entry or update an existing one
  const handleFormSubmit = async (entry) => {
    try {
      let idToHighlight;
      if (selectedEntry) {
        await updateGroceryEntry(selectedEntry.id, entry);
        idToHighlight = selectedEntry.id;
      } else {
        // addGroceryEntry returns the ID of the newly created entry.
        const newId = await addGroceryEntry(entry);
        idToHighlight = newId;
      }
      setHighlightedEntryId(idToHighlight);
      setSelectedEntry(null);

      // Clear the highlight after a brief delay (e.g., 1.25 seconds)
      setTimeout(() => {
        setHighlightedEntryId(null);
      }, 1250);
    } catch (error) {
      console.error('Error saving entry:', error);
    }
  };

  // Set the entry to be edited
  const handleEdit = (entry) => {
    setSelectedEntry(entry);
  };

  // Cancel edit mode
  const handleCancelEdit = () => {
    setSelectedEntry(null);
  };

  // Delete the specified entry (with confirmation prompt)
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await deleteGroceryEntry(id);
      } catch (error) {
        console.error('Error deleting entry:', error);
      }
    }
  };

  return (
    <div className="App">
      <h1>Quick Grocery Discount</h1>
      <GroceryForm 
        onSubmit={handleFormSubmit} 
        selectedEntry={selectedEntry}
        onCancelEdit={handleCancelEdit}
      />
      <GroceryTable 
        entries={entries} 
        loading={loading}
        onEdit={handleEdit} 
        onDelete={handleDelete}
        highlightedEntryId={highlightedEntryId}
      />
    </div>
  );
}

export default App;
