import React, { useState, useMemo } from 'react';
import './GroceryTable.css';

function GroceryTable({ entries, onEdit, onDelete, highlightedEntryId, loading }) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  // Helper function to format date as dd/mm/yyyy.
  // It uses the Thai locale (which by default returns the Buddhist Era year)
  // and then subtracts 543 from the year value to display the AD year.
  const formatDate = (date) => {
    const d = new Date(date);
    // Guarantee Latin (Western) digits for day and month.
    const day = d.toLocaleDateString('th-TH-u-nu-latn', { day: '2-digit' });
    const month = d.toLocaleDateString('th-TH-u-nu-latn', { month: '2-digit' });
    // The year returned by the Thai locale is in Buddhist Era (BE) so subtract 543.
    const yearBE = d.toLocaleDateString('th-TH-u-nu-latn', { year: 'numeric' }).slice(-4);
    const yearAD = parseInt(yearBE, 10) - 543;
    return `${day}/${month}/${yearAD}`;
  };

  const handleSort = (columnKey) => {
    if (sortConfig.key === columnKey) {
      if (sortConfig.direction === 'asc') {
        setSortConfig({ key: columnKey, direction: 'desc' });
      } else if (sortConfig.direction === 'desc') {
        // Cycle back to unsorted: original order (which here is the default multi-sort order)
        setSortConfig({ key: null, direction: null });
      }
    } else {
      setSortConfig({ key: columnKey, direction: 'asc' });
    }
  };

  const sortedEntries = useMemo(() => {
    // Define the default sort priority:
    // 1. Date descending
    // 2. Total descending
    // 3. Discount descending
    const defaultCriteria = [
      { key: 'date', direction: 'desc' },
      { key: 'totalAmount', direction: 'desc' },
      { key: 'discountAmount', direction: 'desc' },
    ];

    // If the user has chosen a column to sort by, put that first.
    // Then, add the default sorting rules for the remaining keys.
    let sortCriteria = [];
    if (sortConfig.key) {
      sortCriteria = [
        { key: sortConfig.key, direction: sortConfig.direction },
        ...defaultCriteria.filter(item => item.key !== sortConfig.key)
      ];
    } else {
      // No active sortConfig, so use the default criteria.
      sortCriteria = defaultCriteria;
    }

    const sortableEntries = [...entries];
    sortableEntries.sort((a, b) => {
      // Iterate over each criterion to determine sort order.
      for (const criterion of sortCriteria) {
        let aValue = a[criterion.key];
        let bValue = b[criterion.key];

        // Convert values if they are dates or numbers.
        if (criterion.key === 'date') {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        } else {
          // For totalAmount and discountAmount, compare as floats.
          aValue = parseFloat(aValue);
          bValue = parseFloat(bValue);
        }

        if (aValue < bValue) {
          return criterion.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return criterion.direction === 'asc' ? 1 : -1;
        }
        // If equal, continue to the next criterion.
      }
      return 0;
    });
    return sortableEntries;
  }, [entries, sortConfig]);

  const renderSortIndicator = (columnKey) => {
    if (sortConfig.key === columnKey) {
      return sortConfig.direction === 'asc' ? ' ▲' : ' ▼';
    }
    return null;
  };

  return (
    <table className="grocery-table">
      <thead>
        <tr>
          <th className="sortable" onClick={() => handleSort('date')}>
            Date{renderSortIndicator('date')}
          </th>
          <th className="sortable" onClick={() => handleSort('totalAmount')}>
            Total{renderSortIndicator('totalAmount')}
          </th>
          <th className="sortable" onClick={() => handleSort('discountAmount')}>
            Discount{renderSortIndicator('discountAmount')}
          </th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr>
            <td colSpan="4">Loading...</td>
          </tr>
        ) : sortedEntries.length === 0 ? (
          <tr>
            <td colSpan="4">No entries available.</td>
          </tr>
        ) : (
          sortedEntries.map((entry) => (
            <tr
              key={entry.id}
              className={highlightedEntryId === entry.id ? 'flash' : ''}
            >
              <td>{formatDate(entry.date)}</td>
              <td>{Number(entry.totalAmount).toFixed(2)}</td>
              <td>{Number(entry.discountAmount).toFixed(2)}</td>
              <td>
                <button className="edit-button" onClick={() => onEdit(entry)} title="Edit">
                  ✏️
                </button>
                <button className="delete-button" onClick={() => onDelete(entry.id)} title="Delete">
                  🗑️
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

export default GroceryTable;
