const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
    try {
        console.log('Attempting to list available models...\n');
        const models = await genAI.listModels();
        console.log('Available models:');
        for await (const model of models) {
            console.log(`- ${model.name}`);
        }
    } catch (error) {
        console.log('Error listing models:', error.message);
        console.log('\nTrying to test API key with direct API call...\n');

        // Try a simple API test
        const axios = require('axios');
        const url = `https://generativelanguage.googleapis.com/v1/models?key=${process.env.GEMINI_API_KEY}`;

        try {
            const response = await axios.get(url);
            console.log('API Key is valid! Available models:');
            response.data.models.forEach(model => {
                if (model.supportedGenerationMethods && model.supportedGenerationMethods.includes('generateContent')) {
                    console.log(`- ${model.name}`);
                }
            });
        } catch (apiError) {
            console.log('API Error:', apiError.response?.data || apiError.message);
        }
    }
}

listModels();
