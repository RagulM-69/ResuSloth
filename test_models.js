import 'dotenv/config';
import fs from 'fs';

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.models) {
        const names = data.models.map(m => m.name);
        fs.writeFileSync('models.txt', names.join('\n'));
        console.log("Wrote to models.txt");
    } else {
        fs.writeFileSync('models.txt', JSON.stringify(data, null, 2));
    }
}
listModels();
