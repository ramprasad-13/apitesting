const express = require('express');
const router = express.Router();
const getProjects = require('../../controllers/project/getall');

router.get('/get',getProjects);

module.exports = router;