const alertAndLogErr = (err) => {
  console.error(err);
  alert(err.message);
};

// dd/mm/yyyy
const formatDay = (timestamp) => {
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${day}/${month}/${year}`;
};

// yyyy-mm-dd
const formatDayForDatePicker = (timestamp) => {
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export {
  alertAndLogErr,
  formatDay,
  formatDayForDatePicker,
};
