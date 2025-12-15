const fs = require('fs');

// Read the API key from environment variables
const apiKey = process.env.GOOGLE_API_KEY || '';

if (!apiKey) {
    console.warn('WARNING: GOOGLE_API_KEY environment variable is not set.');
}

// Create the content for config.js
const configContent = `const CONFIG = {
    // Generated from environment variable
    GOOGLE_API_KEY: '${apiKey}'
};
`;

// Write the file
try {
    fs.writeFileSync('config.js', configContent);
    console.log('Successfully generated config.js');
} catch (error) {
    console.error('Error generating config.js:', error);
    process.exit(1);
}
