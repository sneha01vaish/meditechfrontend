import axios from 'axios';

export const API_BASE = 'https://unique-wisdom-production-a6d8.up.railway.app';

const client = axios.create({ baseURL: API_BASE });

export async function checkHealth() {
  const res = await client.get('/');
  return res.data;
}

export async function uploadPDFs(files) {
  const form = new FormData();
  files.forEach(f => form.append('files', f));
  const res = await client.post('/upload_pdfs/', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

export async function askQuestion(question) {
  const form = new FormData();
  form.append('question', question);
  const res = await client.post('/ask/', form);
  return res.data;
}
