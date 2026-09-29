const { GoogleGenAI } = require('@google/genai');
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function processInteraction(userId, interactionId, rawContent, contactId) {
    const prompt = `
    Analyze the following interaction and extract structured data in strict JSON format:
    {
      "facts": ["list of factual statements learned about the contact or project"],
      "commitments": [{"title": "task description", "due_date": "YYYY-MM-DD or null"}],
      "reflections": {
        "learnings": ["what was learned"],
        "risks": ["any emerging risks or tensions"],
        "opportunities": ["business or personal opportunities"],
        "shifts": ["notable changes in preference, role, or company"]
      },
      "entities": ["key tools, companies, or projects mentioned"]
    }

    Content:
    ${rawContent}
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
    });

    const parsedData = JSON.parse(response.text());

    for (const fact of parsedData.facts) {
        const embedding = await getEmbedding(fact);
        await pool.query(
            `INSERT INTO memories (user_id, contact_id, interaction_id, memory_type, content, embedding) VALUES ($1, $2, $3, 'fact', $4, $5)`,
            [userId, contactId, interactionId, fact, JSON.stringify(embedding)]
        );
    }

    for (const [type, items] of Object.entries(parsedData.reflections)) {
        for (const item of items) {
            const embedding = await getEmbedding(item);
            await pool.query(
                `INSERT INTO reflections (user_id, contact_id, interaction_id, reflection_type, content, embedding) VALUES ($1, $2, $3, $4, $5, $6)`,
                [userId, contactId, interactionId, type, item, JSON.stringify(embedding)]
            );
        }
    }

    for (const task of parsedData.commitments) {
        await pool.query(
            `INSERT INTO tasks (user_id, contact_id, interaction_id, title, due_date) VALUES ($1, $2, $3, $4, $5)`,
            [userId, contactId, interactionId, task.title, task.due_date || null]
        );
    }

    await pool.query(
        `INSERT INTO timeline_events (user_id, contact_id, event_type, title, description, event_timestamp, reference_id) VALUES ($1, $2, 'interaction', $3, $4, NOW(), $5)`,
        [userId, contactId, `Interaction Logged`, rawContent.substring(0, 100), interactionId]
    );
}

async function getEmbedding(text) {
    const res = await ai.models.embedContent({
        model: 'text-embedding-004',
        contents: text
    });
    return res.embedding.values;
}

module.exports = { processInteraction, getEmbedding, pool };
