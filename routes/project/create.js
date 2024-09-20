const express = require('express');
const router = express.Router();
const createProject = require('../../controllers/project/create');

router.post('/create',createProject);

module.exports = router;