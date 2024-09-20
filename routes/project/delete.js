const express = require('express');
const router = express.Router();
const deleteProject = require('../../controllers/project/delete');

router.delete('/delete/:id',deleteProject);

module.exports = router;