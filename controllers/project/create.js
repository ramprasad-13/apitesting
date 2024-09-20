const ProjectModel = require('../../models/project');

const createProject = async (req, res) => {
    const { projectName, swaggerUrl } = req.body;

    // Basic validation
    if (!projectName || !swaggerUrl) {
        return res.status(400).json({ "Error": "Project name and Swagger URL are required." });
    }

    try {
        // Check if the project already exists
        const existingProject = await ProjectModel.findOne({ projectName });
        if (existingProject) {
            return res.status(400).json({ "Error": "Project already exists!" });
        }
        
        // Create and save the new project
        const newProject = new ProjectModel({ projectName, swaggerUrl });
        await newProject.save();
        
        // Send a success response
        return res.status(201).json({ "message": "Project creation successful", "Project": newProject });
    } catch (error) {
        console.error(`Failed to create project: ${error.message}`);
        return res.status(500).json({ "message": "Failed to create project" });
    }
}

module.exports = createProject;
