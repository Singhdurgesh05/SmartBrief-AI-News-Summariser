const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testModels() {
    console.log('Testing Gemini models...\n');

    const modelNames = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro', 'gemini-1.0-pro'];

    for (const modelName of modelNames) {
        try {
            console.log(`Testing model: ${modelName}`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent('Say "Hello"');
            const response = result.response.text();
            console.log(`✓ ${modelName} works! Response: ${response.substring(0, 50)}...\n`);
            break; // If this works, we found a working model
        } catch (error) {
            console.log(`✗ ${modelName} failed: ${error.message}\n`);
        }
    }
}

testModels();
