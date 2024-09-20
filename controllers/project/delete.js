const ProjectModel = require('../../models/project');

const deleteProject = async (req, res) => {
    const { id } = req.params;
    try {
        // Check if the project exists
        const existingProject = await ProjectModel.findById(id);
        if (!existingProject) {
            return res.status(404).json({ "Error": "Project does not exist!" });
        }
        
        // Delete the project
        await ProjectModel.findByIdAndDelete(id);
        
        // Send a success response
        return res.status(204).send(); // No content response
    } catch (error) {
        console.error(`Failed to delete project: ${error.message}`);
        return res.status(500).json({ "message": "Failed to delete project" });
    }
}

module.exports = deleteProject;
