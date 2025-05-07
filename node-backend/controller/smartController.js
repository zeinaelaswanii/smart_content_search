const express = require('express');
const router = express.Router();
const multer = require('multer');
const smartService = require('../services/smart_service');

// multer to temporarily store uploaded files
const upload = multer({ dest: 'temp_uploads/' });

router.post('/upload', upload.array('files'), async (req, res) => {
  try {
    const result = await smartService.uploadLecture(req);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.post('/process/:lecture_id?', async (req, res) => {
  try {
    const lectureId = req.params.lecture_id;
    const result = await smartService.processLecture(lectureId);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/search', async (req, res) => {
  try {
    const result = await smartService.searchContent(req.query);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
