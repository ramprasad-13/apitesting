const axios = require('axios');

// Function to fetch Swagger JSON data
const getswaggerData = async (url) => {
    try {
        const response = await axios.get(url); // Use axios.get(url) instead of axios(url)
        return response.data;
    } catch (error) {
        console.error('Error fetching Swagger data:', error);
        return null; // Return null or handle error as needed
    }
};

// Function to generate unique values
function generateUniqueValue(prefix) {
    return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
}

// Function to get all endpoints with parameters
function getEndpoints(swaggerData) {
    if (!swaggerData || !swaggerData.paths) {
        console.error('Invalid Swagger data');
        return [];
    }

    const paths = swaggerData.paths;
    const endpoints = [];

    for (const path in paths) {
        const methods = paths[path];
        for (const method in methods) {
            if (methods.hasOwnProperty(method)) {
                const operation = methods[method];
                const parameters = operation.parameters || [];

                const formattedParameters = parameters.map(param => ({
                    name: param.name,
                    in: param.in,
                    description: param.description || '',
                    required: param.required || false,
                    type: param.type,
                    format: param.format || null,
                    enum: param.enum || null
                }));

                endpoints.push({
                    path: path,
                    method: method.toUpperCase(), // Convert method to uppercase for standardization
                    parameters: formattedParameters
                });
            }
        }
    }

    return endpoints;
}

// Function to generate test cases
function generateTestCases(endpoints) {
    const testCases = [];

    endpoints.forEach(endpoint => {
        const { path, method, parameters } = endpoint;

        const testCaseName = `Test ${method} ${path}`;

        // Generate test case template
        let testCase = {
            name: testCaseName,
            description: `Test cases for ${method} ${path}`,
            tests: []
        };

        // Create test cases based on parameters
        if (parameters.length > 0) {
            parameters.forEach(param => {
                const validValue = generateUniqueValue(param.name);
                const invalidValue = 'invalidValue';
                const negativeValue = -Math.floor(Math.random() * 1000); // Generate a negative number
                const alphanumericValue = `${generateUniqueValue('alpha')}abc123`; // Generate an alphanumeric value
                const specialCharValue = `${generateUniqueValue('special')}!@#$%^&*()`; // Generate a value with special characters

                if (param.required) {
                    // Test case for missing required parameter
                    testCase.tests.push({
                        name: `Verify response for a non-existing ${param.name} ID`,
                        request: {
                            method,
                            path: path.replace(`{${param.name}}`, ''), // Remove parameter from path
                            params: {}, // Ensure the required parameter is missing
                        },
                        expected: {
                            statusCode: 400, // Assuming a 400 Bad Request for missing required parameters
                            body: { error: `${param.name} is required` }
                        }
                    });
                }

                // Test case with valid parameter
                testCase.tests.push({
                    name: `Verify successful retrieval of an existing ${param.name} Id`,
                    request: {
                        method,
                        path: path.replace(`{${param.name}}`, validValue),
                        params: { [param.name]: validValue },
                    },
                    expected: {
                        statusCode: 200 // Assuming a 200 OK for valid request
                    }
                });

                // Test case with invalid parameter
                testCase.tests.push({
                    name: `Verify fail when ${param.name} is invalid`,
                    request: {
                        method,
                        path: path.replace(`{${param.name}}`, invalidValue),
                        params: { [param.name]: invalidValue },
                    },
                    expected: {
                        statusCode: 400, // Assuming a 400 Bad Request for invalid parameters
                        body: { error: `Invalid ${param.name}` }
                    }
                });

                // Test case with negative number
                testCase.tests.push({
                    name: `Should fail when ${param.name} is a negative number`,
                    request: {
                        method,
                        path: path.replace(`{${param.name}}`, negativeValue),
                        params: { [param.name]: negativeValue },
                    },
                    expected: {
                        statusCode: 400, // Assuming a 400 Bad Request for invalid negative number
                        body: { error: `Invalid ${param.name}` }
                    }
                });

                // Test case with alphanumeric value
                testCase.tests.push({
                    name: `Should fail when ${param.name} is an alphanumeric value`,
                    request: {
                        method,
                        path: path.replace(`{${param.name}}`, alphanumericValue),
                        params: { [param.name]: alphanumericValue },
                    },
                    expected: {
                        statusCode: 400, // Assuming a 400 Bad Request for alphanumeric values where not allowed
                        body: { error: `Invalid ${param.name}` }
                    }
                });

                // Test case with special characters
                testCase.tests.push({
                    name: `Should fail when ${param.name} contains special characters`,
                    request: {
                        method,
                        path: path.replace(`{${param.name}}`, specialCharValue),
                        params: { [param.name]: specialCharValue },
                    },
                    expected: {
                        statusCode: 400, // Assuming a 400 Bad Request for special characters where not allowed
                        body: { error: `Invalid ${param.name}` }
                    }
                });

                // Test case for response time within acceptable limit
                testCase.tests.push({
                    name: `Should fail if ${param.name} response time is within acceptable limit`,
                    request: {
                        method,
                        path: path.replace(`{${param.name}}`, validValue), // Use a valid value for parameter
                        params: { [param.name]: validValue },
                    },
                    expected: {
                        statusCode: 400, // Assuming this will fail if the response time is acceptable
                        body: { error: `Response time should exceed the acceptable limit` }
                    },
                    // Adding a custom field for response time handling
                    responseTime: {
                        acceptableLimit: 2000, // Define the acceptable response time limit in milliseconds
                        shouldFailIfWithinLimit: true // Flag to indicate this test should fail if response time is within the acceptable limit
                    }
                });
            });
        } else {
            // For endpoints with no parameters
            testCase.tests.push({
                name: 'Should succeed with no parameters',
                request: {
                    method,
                    path
                },
                expected: {
                    statusCode: 200 // Assuming a 200 OK for valid request
                }
            });
        }

        testCases.push(testCase);
    });

    return testCases;
}

// Main function to execute the logic
const main = async () => {
    const url = 'https://petstore.swagger.io/v2/swagger.json';
    const swaggerData = await getswaggerData(url); // Await the promise
    const endpoints = getEndpoints(swaggerData);
    console.log(JSON.stringify(endpoints, null, 2)); // Print endpoints in a readable format

    // Generate test cases
    const testCases = generateTestCases(endpoints);

    // Log test cases to the console
    console.log(JSON.stringify(testCases, null, 2));
};

// Execute the main function
main();
