const ping = async (token) => {
  console.log('api ping start', {});
  const resp = await fetch(`/api/ping`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!resp.ok) {
    const errData = await resp.json();
    console.log('api ping error', { errData });
    throw new Error(errData.error || 'Failed api ping');
  }
  const data = await resp.text();
  console.log('api ping done', { data });
  return data;
};

const createGroceryEntry = async (token, { date, totalAmount, discountAmount }) => {
  console.log('api createGroceryEntry start', { date, totalAmount, discountAmount });
  const resp = await fetch(`/api/groceryEntries`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ date, totalAmount, discountAmount }),
  });
  if (!resp.ok) {
    const errData = await resp.json();
    console.log('api createGroceryEntry error', { errData });
    throw new Error(errData.error || 'Failed to create grocery entry');
  }
  const data = await resp.json();
  console.log('api createGroceryEntry done', { data });
  return data;
};

const getGroceryEntries = async (token) => {
  console.log('api getGroceryEntries start');
  const resp = await fetch(`/api/groceryEntries`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!resp.ok) {
    const errData = await resp.json();
    console.log('api getGroceryEntries error', { errData });
    throw new Error(errData.error || 'Failed to fetch grocery entries');
  }
  const data = await resp.json();
  console.log('api getGroceryEntries done', { data });
  return data;
};

const updateGroceryEntry = async (token, id, updateData) => {
  console.log('api updateGroceryEntry start', { id, updateData });
  const resp = await fetch(`/api/groceryEntries/${id}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updateData),
  });
  if (!resp.ok) {
    const errData = await resp.json();
    console.log('api updateGroceryEntry error', { errData });
    throw new Error(errData.error || 'Failed to update grocery entry');
  }
  const data = await resp.json();
  console.log('api updateGroceryEntry done', { data });
  return data;
};

const deleteGroceryEntry = async (token, id) => {
  console.log('api deleteGroceryEntry start', { id });
  const resp = await fetch(`/api/groceryEntries/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!resp.ok) {
    const errData = await resp.json();
    console.log('api deleteGroceryEntry error', { errData });
    throw new Error(errData.error || 'Failed to delete grocery entry');
  }
  console.log('api deleteGroceryEntry done');
};

export default {
  ping, createGroceryEntry, getGroceryEntries, updateGroceryEntry, deleteGroceryEntry,
};
