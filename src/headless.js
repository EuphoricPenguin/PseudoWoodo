const fs = require('fs');
const path = require('path');
const PseudoWoodoInterpreter = require('./script');

// Define a callback function for logging
const onLog = (message) => {
    console.log(message);
};

// Create an instance of the interpreter
const interpreter = new PseudoWoodoInterpreter(onLog);

// Function to read and execute PseudoWoodo code from a file
const executePseudoWoodoFile = (filePath) => {
    try {
        // Resolve the absolute path of the file
        const absolutePath = path.resolve(filePath);

        // Check if the file exists and has the correct extension
        if (!fs.existsSync(absolutePath)) {
            console.error(`error: File '${absolutePath}' does not exist.`);
            process.exit(1);
        }
        if (path.extname(absolutePath) !== '.pw') {
            console.error(`error: File '${absolutePath}' must have a .pw extension.`);
            process.exit(1);
        }

        // Read the file content
        const code = fs.readFileSync(absolutePath, 'utf-8');

        // Execute the code
        interpreter.execute(code)
            .catch((error) => {
                console.error('error:', error);
            });
    } catch (error) {
        console.error('file error:', error);
        process.exit(1);
    }
};

// Parse command-line arguments
const args = process.argv.slice(2);

// Check for the --file flag
const fileIndex = args.indexOf('--file');
if (fileIndex === -1 || fileIndex === args.length - 1) {
    console.error('error: Missing --file flag or file path.');
    console.log('usage: node main.js --file <path-to-file.pw>');
    process.exit(1);
}

// Get the file path from the flag
const filePath = args[fileIndex + 1];

// Execute the PseudoWoodo file
executePseudoWoodoFile(filePath);