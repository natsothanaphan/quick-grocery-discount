import React, { useState, useEffect } from 'react';
import Auth from './components/Auth';
import GroceryForm from './components/GroceryForm';
import GroceryTable from './components/GroceryTable';
import './App.css';
import api from './api.js';
import { alertAndLogErr } from './utils.js';

const App = () => {
  const [user, setUser] = useState(null);

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState(null);

  const handleSignIn = (user) => setUser(user);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const idToken = await user.getIdToken();
      const data = await api.getGroceryEntries(idToken);
      setEntries(data);
    } catch (err) {
      alertAndLogErr(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchEntries();
    }
  }, [user]);

  const handleFormSubmit = async (entry) => {
    try {
      const idToken = await user.getIdToken();
      if (selectedEntry) {
        await api.updateGroceryEntry(idToken, selectedEntry.id, entry);

        setSelectedEntry(null);
        fetchEntries();
      } else {
        await api.createGroceryEntry(idToken, entry);

        fetchEntries();
      }
    } catch (err) {
      alertAndLogErr(err);
    }
  };
  const handleCancelEdit = () => setSelectedEntry(null);

  const handleEdit = (entry) => setSelectedEntry(entry);
  const handleDelete = async (entryId) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) return;
    try {
      const idToken = await user.getIdToken();
      await api.deleteGroceryEntry(idToken, entryId);

      fetchEntries();
      alert('Entry deleted');
    } catch (err) {
      alertAndLogErr(err);
    }
  };

  return (
    <div className="App">
      {!user && <Auth onSignIn={handleSignIn} />}
      {user && <>
        <GroceryForm 
          selectedEntry={selectedEntry}
          onSubmit={handleFormSubmit} 
          onCancelEdit={handleCancelEdit}
        />
        <GroceryTable 
          entries={entries} loading={loading}
          onEdit={handleEdit} onDelete={handleDelete}
        />
      </>}
    </div>
  );
};

export default App;
