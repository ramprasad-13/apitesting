const express = require('express');
const app = express();
require('dotenv').config();
const db = require('./connection');
const { getswaggerData, getEndpoints, generateTestCases } = require('./updatedCode');
const port = process.env.PORT || 3000;

const getProject = require('./routes/project/get');
const getProjects = require('./routes/project/getall');
const createProject = require('./routes/project/create');
const updateProject = require('./routes/project/update');
const deleteProject = require('./routes/project/delete');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//connect to database
db();

//routes
app.get('/', (req, res) => {
    res.status(200).json({ "message": "App is working" });
});

app.post('/fetchSwaggerData', async (req, res) => {
    const { swaggerUrl } = req.body;
    try {
        if (!swaggerUrl) {
            return res.status(400).json({ "error": "swaggerUrl is required" });
        }

        // Fetch Swagger data
        const swaggerData = await getswaggerData(swaggerUrl);
        if (!swaggerData) {
            return res.status(500).json({ "error": "Failed to fetch Swagger data" });
        }

        // Get endpoints
        const endpoints = getEndpoints(swaggerData);

        // Generate test cases
        const testCases = generateTestCases(endpoints);

        // For demonstration purposes, just send back the test cases
        res.status(200).json(testCases);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ "error": error.message });
    }
});

// Express Route
app.use('/api',getProject);
app.use('/api',getProjects);
app.use('/api',createProject);
app.use('/api',updateProject);
app.use('/api',deleteProject);

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
