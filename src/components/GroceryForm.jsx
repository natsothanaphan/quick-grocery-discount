import React, { useState, useEffect } from 'react';
import "./GroceryForm.css"; // Import the CSS file

function GroceryForm({ onSubmit, selectedEntry, onCancelEdit }) {
  // Compute today's date in YYYY-MM-DD format using Thailand timezone
  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Bangkok' });
  
  // Initialize total and discount as formatted strings with 2 decimal points.
  const [date, setDate] = useState(today);
  const [totalAmount, setTotalAmount] = useState('0.00');
  const [discountAmount, setDiscountAmount] = useState('0.00');

  // Populate form fields when an entry is selected for editing, or reset when not.
  useEffect(() => {
    if (selectedEntry) {
      setDate(selectedEntry.date || today);
      setTotalAmount(
        selectedEntry.totalAmount !== undefined && selectedEntry.totalAmount !== null
          ? Number(selectedEntry.totalAmount).toFixed(2)
          : '0.00'
      );
      setDiscountAmount(
        selectedEntry.discountAmount !== undefined && selectedEntry.discountAmount !== null
          ? Number(selectedEntry.discountAmount).toFixed(2)
          : '0.00'
      );
    } else {
      setDate(today);
      setTotalAmount('0.00');
      setDiscountAmount('0.00');
    }
  }, [selectedEntry, today]);

  // Generic onBlur handler to format numeric input to 2 decimal places and round to nearest 0.25
  const handleBlur = (e, setFunction) => {
    const value = e.target.value;
    let parsed = parseFloat(value);
    if (!isNaN(parsed)) {
      if (parsed < 0) {
        parsed = 0;
      }
      // Round to the nearest 0.25
      parsed = Math.round(parsed * 4) / 4;
      setFunction(parsed.toFixed(2));
    } else {
      setFunction('0.00');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Build the entry object, converting amounts to numeric values
    const entry = {
      date,
      totalAmount: parseFloat(totalAmount),
      discountAmount: parseFloat(discountAmount),
    };
    onSubmit(entry);
    
    // After adding, reset the form fields to default values if not editing an existing entry.
    if (selectedEntry) {
      // In edit mode, let the parent handle clearing the selected entry.
      onCancelEdit && onCancelEdit();
    } else {
      setDate(today);
      setTotalAmount('0.00');
      setDiscountAmount('0.00');
    }
  };

  return (
    <form className="grocery-form" onSubmit={handleSubmit}>
      <div>
        <label>Date: </label>
        <input 
          type="date" 
          lang="th-TH"
          value={date} 
          onChange={(e) => setDate(e.target.value)} 
          required 
        />
      </div>
      <div>
        <label>Total: </label>
        <input 
          type="number" 
          step="0.25"
          min="0.25" 
          value={totalAmount}
          onChange={(e) => setTotalAmount(e.target.value)} 
          onBlur={(e) => handleBlur(e, setTotalAmount)}
          required 
        />
      </div>
      <div>
        <label>Discount: </label>
        <input 
          type="number" 
          step="0.25" 
          min="0"
          value={discountAmount}
          onChange={(e) => setDiscountAmount(e.target.value)} 
          onBlur={(e) => handleBlur(e, setDiscountAmount)}
          required 
        />
      </div>
      <div>
        <button type="submit" className="submit-button">
          {selectedEntry ? 'Update' : 'Add'}
        </button>
        {selectedEntry && (
          <button type="button" onClick={onCancelEdit} className="cancel-button">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default GroceryForm;
