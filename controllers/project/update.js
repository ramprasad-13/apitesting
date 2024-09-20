const ProjectModel = require('../../models/project');

const updateProject = async (req, res) => {
    const { id } = req.params;
    const { projectName, swaggerUrl } = req.body;

    try {
        // Check if the project exists
        const existingProject = await ProjectModel.findById(id);
        if (!existingProject) {
            return res.status(404).json({ "Error": "Project does not exist!" });
        }

        // Update the project
        const updatedProject = await ProjectModel.findByIdAndUpdate(
            id,
            { projectName, swaggerUrl },
            { new: true } // This option returns the updated document
        );

        // Check if the update was successful
        if (!updatedProject) {
            return res.status(400).json({ "Error": "Failed to update project!" });
        }

        // Send a success response
        return res.status(200).json({ "message": "Project updated successfully", "Project": updatedProject });
    } catch (error) {
        console.error(`Failed to update Project: ${error.message}`);
        return res.status(500).json({ "message": "Failed to update Project" });
    }
}

module.exports = updateProject;
