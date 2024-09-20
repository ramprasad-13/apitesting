const express = require('express');
const router = express.Router();
const updateProject = require('../../controllers/project/update');

router.put('/update/:id',updateProject);

module.exports = router;