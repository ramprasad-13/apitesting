const ProjectModel = require('../../models/project');

const getProjects = async (req, res) => {

    try {
        // Check if the project already exists
        const Projects = await ProjectModel.find();
        if (Projects.length==0) {
            return res.status(400).json({ "Error": "Projects Not exists!" });
        }
        
        // Send a success response
        return res.status(200).json({ "message": "Projects retrived successful", "Projects": Projects });
    } catch (error) {
        console.error(`Failed to retrive projects: ${error.message}`);
        return res.status(500).json({ "message": "Failed to retrive projects" });
    }
}

module.exports = getProjects;
