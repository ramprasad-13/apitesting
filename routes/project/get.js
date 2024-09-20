const express = require('express');
const router = express.Router();
const getProject = require('../../controllers/project/get');

router.get('/get/:id',getProject);

module.exports = router;