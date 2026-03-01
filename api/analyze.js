// api/analyze.js — Vercel Serverless Function
// Accepts resume text + job description, calls Gemini API, returns structured analysis JSON

import { GoogleGenerativeAI } from '@google/generative-ai';

// Vercel Serverless Function configuration
export const maxDuration = 60; // 60 seconds (max for Hobby tier)

// CORS headers for all responses
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
};

export default async function handler(req, res) {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        res.writeHead(204, corsHeaders);
        res.end();
        return;
    }

    // Only allow POST
    if (req.method !== 'POST') {
        res.writeHead(405, corsHeaders);
        res.end(JSON.stringify({ error: 'Method not allowed. Use POST.' }));
        return;
    }

    try {
        const { resumeText, jobDescription } = req.body;

        // Validate inputs
        if (!resumeText || typeof resumeText !== 'string' || resumeText.trim().length < 50) {
            res.writeHead(400, corsHeaders);
            res.end(JSON.stringify({ error: 'Resume text is missing or too short. Please upload a valid resume.' }));
            return;
        }

        if (!jobDescription || typeof jobDescription !== 'string' || jobDescription.trim().length < 20) {
            res.writeHead(400, corsHeaders);
            res.end(JSON.stringify({ error: 'Job description is missing or too short. Please add a job description.' }));
            return;
        }

        // Validate API key
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            res.writeHead(500, corsHeaders);
            res.end(JSON.stringify({ error: 'Server configuration error: Gemini API key not set.' }));
            return;
        }

        // Initialize Gemini
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
        });

        // Build the analysis prompt
        const prompt = `You are an expert ATS resume analyzer and career coach.
Analyze the following resume against the job description.
Return ONLY a valid JSON object with no markdown, no explanation, no code fences, just raw JSON.

JSON structure:
{
  "score": number (0-100, overall ATS match score),
  "matched_skills": string[] (skills in resume that match the job),
  "missing_skills": string[] (skills required by the job but missing from resume),
  "experience_match": string (1-2 sentence assessment of experience alignment),
  "education_match": string (1-2 sentence assessment of education alignment),
  "suggestions": string[] (exactly 4 specific, actionable improvement tips),
  "summary": string (2-3 sentence overall assessment),
  "strengths": string[] (top 3 strengths the candidate brings)
}

Job Description:
${jobDescription.trim()}

Resume:
${resumeText.trim()}`;

        // Call Gemini with timeout (45 seconds)
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Analysis timed out. Please try again.')), 45000)
        );

        const apiPromise = model.generateContent(prompt);
        const result = await Promise.race([apiPromise, timeoutPromise]);
        const responseText = result.response.text().trim();

        // Safely parse the JSON response
        let analysis;
        try {
            // Find the first `{` and last `}` to extract just the JSON
            const firstBrace = responseText.indexOf('{');
            const lastBrace = responseText.lastIndexOf('}');
            if (firstBrace === -1 || lastBrace === -1) {
                throw new Error('No JSON object found in response');
            }
            const cleaned = responseText.substring(firstBrace, lastBrace + 1);
            analysis = JSON.parse(cleaned);
        } catch (parseError) {
            console.error('JSON parse error:', parseError, '\nRaw response:', responseText);
            res.writeHead(500, corsHeaders);
            res.end(JSON.stringify({ error: 'Failed to parse AI response. Please try again.' }));
            return;
        }

        // Validate and sanitize the response structure
        const validated = {
            score: Math.min(100, Math.max(0, Number(analysis.score) || 0)),
            matched_skills: Array.isArray(analysis.matched_skills) ? analysis.matched_skills : [],
            missing_skills: Array.isArray(analysis.missing_skills) ? analysis.missing_skills : [],
            experience_match: String(analysis.experience_match || 'Not assessed'),
            education_match: String(analysis.education_match || 'Not assessed'),
            suggestions: Array.isArray(analysis.suggestions) ? analysis.suggestions.slice(0, 4) : [],
            summary: String(analysis.summary || ''),
            strengths: Array.isArray(analysis.strengths) ? analysis.strengths.slice(0, 3) : [],
        };

        res.writeHead(200, corsHeaders);
        res.end(JSON.stringify(validated));
    } catch (error) {
        console.error('Analysis error:', error);
        res.writeHead(500, corsHeaders);
        res.end(JSON.stringify({
            error: error.message || 'An unexpected error occurred. Please try again.',
        }));
    }
};
