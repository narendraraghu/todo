import axios from 'axios';

const API_URL = '/api/tasks';

export async function fetchTasks() {
  const res = await axios.get(API_URL);
  return res.data;
}

export async function updateTask(id, data) {
  const res = await axios.put(`${API_URL}/${id}`, data);
  return res.data;
}

export async function addTask(data) {
  const res = await axios.post(API_URL, data);
  return res.data;
}

export async function editTask(id, data) {
  const res = await axios.put(`${API_URL}/${id}`, data);
  return res.data;
}

export async function deleteTask(id) {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
}

export async function toggleCompletion(id, completed) {
  const res = await axios.put(`${API_URL}/${id}`, { completed, updatedAt: new Date().toISOString() });
  return res.data;
}

// Add more API methods as needed 