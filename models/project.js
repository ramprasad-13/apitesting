const mongoose = require('mongoose');

// Define the Project Schema
const ProjectSchema = new mongoose.Schema({
    projectName: {
        type: String,
        required: true,
        unique: true
    },
    swaggerUrl: {
        type: String,
        required: true,
    }
});

// Create the Project Model
const ProjectModel = mongoose.model('Project', ProjectSchema);

module.exports = ProjectModel;
