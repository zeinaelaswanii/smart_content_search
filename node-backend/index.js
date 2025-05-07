const express = require('express');
const cors = require('cors');
const smartController = require('./controller/smartController'); 
const app = express();
const port = 5005;

app.use(cors());
app.use(express.json());

app.use('/search', smartController);

app.listen(port, () => {
  console.log(`Node.js server running on http://localhost:${port}`);
});
