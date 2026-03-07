const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" }); // Dummy init to access structure if needed, but actually we need generic client behavior if possible or just try-catch standard ones.
        // The SDK documentation says usually we can't just "list models" easily without strict setup, but let's try a direct fetch if sdk supports it?
        // Actually, the error message SUGGESTED calling ListModels.
        // In node SDK: nothing direct?
        // Wait, let's just try running a script that tries 'gemini-pro' and 'gemini-1.5-flash-latest'.

        // Better yet, let's just use the `gemini-pro` model which is generally available.
        // Or `gemini-1.5-flash-latest`

        console.log("Testing gemini-1.5-flash-latest...");
        try {
            const m1 = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
            const r1 = await m1.generateContent("Test");
            console.log("gemini-1.5-flash-latest: WORKS");
        } catch (e) { console.log("gemini-1.5-flash-latest: FAILED", e.message.split(':')[0]); }

        console.log("Testing gemini-pro...");
        try {
            const m2 = genAI.getGenerativeModel({ model: "gemini-pro" });
            const r2 = await m2.generateContent("Test");
            console.log("gemini-pro: WORKS");
        } catch (e) { console.log("gemini-pro: FAILED", e.message.split(':')[0]); }

    } catch (error) {
        console.error("Error:", error);
    }
}

listModels();
