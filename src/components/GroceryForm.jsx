import React, { useState, useEffect } from 'react';
import './GroceryForm.css';
import { formatDayForDatePicker } from '../utils.js';

const GroceryForm = ({ selectedEntry, onSubmit, onCancelEdit }) => {
  const today = formatDayForDatePicker(new Date());
  
  const [date, setDate] = useState(today);
  const [totalAmount, setTotalAmount] = useState('');
  const [discountAmount, setDiscountAmount] = useState('');

  useEffect(() => {
    if (selectedEntry) {
      setDate(formatDayForDatePicker(selectedEntry.date));
      setTotalAmount(Number(selectedEntry.totalAmount).toFixed(2));
      setDiscountAmount(Number(selectedEntry.discountAmount).toFixed(2));
    } else {
      setDate(today);
      setTotalAmount('');
      setDiscountAmount('');
    }
  }, [selectedEntry, today]);

  const handleBlur = (e, setter) => {
    const value = e.target.value;
    const parsed = parseFloat(value);
    if (isNaN(parsed) || parsed < 0) {
      setter('');
      return;
    }
    setter((Math.round(parsed * 4) / 4).toFixed(2)); // round to nearest 0.25
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const entry = {
      date: date || today,
      totalAmount: parseFloat(totalAmount || '0.00'),
      discountAmount: parseFloat(discountAmount || '0.00'),
    };
    onSubmit(entry);
    
    if (selectedEntry) {
      onCancelEdit();
    } else {
      setDate(today);
      setTotalAmount('');
      setDiscountAmount('');
    }
  };

  const handleCancelEdit = () => onCancelEdit();

  return (
    <form className="grocery-form" onSubmit={handleSubmit}>
      <div>
        <label htmlFor=".date">Date</label>
        <input id=".date" type="date" value={date} 
          onChange={(e) => setDate(e.target.value)} required />
      </div>
      <div>
        <label htmlFor=".totalAmount">Total</label>
        <input id=".totalAmount" type="number" value={totalAmount}
          step="0.25" min="0.25" 
          onChange={(e) => setTotalAmount(e.target.value)} onBlur={(e) => handleBlur(e, setTotalAmount)}
          required 
        />
      </div>
      <div>
        <label htmlFor=".discountAmount">Discount</label>
        <input id=".discountAmount" type="number" value={discountAmount}
          step="0.25" min="0"
          onChange={(e) => setDiscountAmount(e.target.value)} onBlur={(e) => handleBlur(e, setDiscountAmount)} 
        />
      </div>
      <div>
        {!selectedEntry && <button type="submit">Add</button>}
        {selectedEntry && <>
          <button type="submit" title="Save">💾</button>
          <button onClick={handleCancelEdit} title="Cancel">❌</button>
        </>}
      </div>
    </form>
  );
};

export default GroceryForm;
