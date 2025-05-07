const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const FLASK_BASE_URL = 'http://localhost:5006';

async function uploadLecture(req) {
  if (!req.files || req.files.length === 0) {
    throw new Error("No files provided");
  }
  
  const form = new FormData();
  req.files.forEach(file => {
    form.append('files', fs.createReadStream(file.path), file.originalname);
  });
  
  const response = await axios.post(`${FLASK_BASE_URL}/upload`, form, {
    headers: form.getHeaders(),
    maxContentLength: Infinity,
    maxBodyLength: Infinity
  });
  
  req.files.forEach(file => {
    fs.unlink(file.path, err => {
      if (err) console.error(`Error deleting file ${file.path}:`, err);
    });
  });
  
  return response.data;
}

async function processLecture(lectureId) {
  let url = `${FLASK_BASE_URL}/process`;
  if (lectureId) {
    url += `/${lectureId}`;
  }
  const response = await axios.post(url);
  return response.data;
}

async function searchContent(queryParams) {
  const response = await axios.get(`${FLASK_BASE_URL}/search`, {
    params: queryParams,
    timeout: 20000
  });
  return response.data;
}

module.exports = {
  uploadLecture,
  processLecture,
  searchContent
};
