import React, { useMemo } from 'react';
import './GroceryTable.css';
import { formatDay } from '../utils.js';

const GroceryTable = ({ entries, loading, onEdit, onDelete }) => {
  const sortCriteria = [
    { key: 'date', direction: 'desc' },
    { key: 'totalAmount', direction: 'desc' },
    { key: 'discountAmount', direction: 'desc' },
  ];

  const sortedEntries = useMemo(() => {
    const sortableEntries = [...entries];
    sortableEntries.sort((a, b) => {
      for (const criterion of sortCriteria) {
        let aValue = a[criterion.key];
        let bValue = b[criterion.key];
        if (criterion.key === 'date') {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        } else {
          aValue = parseFloat(aValue);
          bValue = parseFloat(bValue);
        }

        if (aValue < bValue) return criterion.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return criterion.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    return sortableEntries;
  }, [entries]);

  const handleEdit = (entry) => onEdit(entry);
  const handleDelete = (entry) => onDelete(entry);

  if (loading) return <p>Loading...</p>;
  return (
    <table className="grocery-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Total</th>
          <th>Discount</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {sortedEntries.length === 0 && <tr><td colSpan="4">No entries.</td></tr>}
        {sortedEntries.length > 0 && sortedEntries.map((entry) => (
            <tr key={entry.id}>
              <td>{formatDay(entry.date)}</td>
              <td>{Number(entry.totalAmount).toFixed(2)}</td>
              <td>{Number(entry.discountAmount).toFixed(2)}</td>
              <td>
                <button onClick={() => handleEdit(entry)} title="Edit">✏️</button>{' '}
                <button onClick={() => handleDelete(entry.id)} title="Delete">🗑️</button>
              </td>
            </tr>
         ))}
      </tbody>
    </table>
  );
};

export default GroceryTable;
