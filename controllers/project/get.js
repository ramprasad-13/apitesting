const ProjectModel = require('../../models/project');

const getProject = async (req, res) => {
    const { id } = req.params;

    try {
        // Check if the project already exists
        const Project = await ProjectModel.findById(id);
        if (!Project) {
            return res.status(400).json({ "Error": "Project Not exists!" });
        }
        
        // Send a success response
        return res.status(200).json({ "message": "Project retrival successful", "Project": Project });
    } catch (error) {
        console.error(`Failed to retrive project: ${error.message}`);
        return res.status(500).json({ "message": "Failed to retrive project" });
    }
}

module.exports = getProject;
