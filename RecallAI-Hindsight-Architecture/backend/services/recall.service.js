const { pool, getEmbedding } = require('./hindsight.service');
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function recallContext(userId, queryText, contactId = null) {
    const queryEmbedding = await getEmbedding(queryText);
    const vectorString = `[${queryEmbedding.join(',')}]`;

    const memoryQuery = `
        SELECT content, 1 - (embedding <=> $1::vector) AS similarity 
        FROM memories 
        WHERE user_id = $2 AND is_active = TRUE
        ORDER BY embedding <=> $1::vector 
        LIMIT 5;
    `;
    const memories = (await pool.query(memoryQuery, [vectorString, userId])).rows;

    const reflectionQuery = `
        SELECT reflection_type, content, 1 - (embedding <=> $1::vector) AS similarity 
        FROM reflections 
        WHERE user_id = $2
        ORDER BY embedding <=> $1::vector 
        LIMIT 5;
    `;
    const reflections = (await pool.query(reflectionQuery, [vectorString, userId])).rows;

    const timelineQuery = `SELECT title, description, event_timestamp FROM timeline_events WHERE user_id = $1 ORDER BY event_timestamp DESC LIMIT 5;`;
    const timeline = (await pool.query(timelineQuery, [userId])).rows;

    const contextPrompt = `
    You are RecallAI's Hindsight Memory Engine. Use ONLY the retrieved context below to answer the user query accurately.

    --- RETRIEVED MEMORIES ---
    ${JSON.stringify(memories)}

    --- RETRIEVED REFLECTIONS ---
    ${JSON.stringify(reflections)}

    --- RECENT TIMELINE ---
    ${JSON.stringify(timeline)}

    User Query: ${queryText}
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: contextPrompt
    });

    return {
        answer: response.text(),
        sources: { memories, reflections, timeline }
    };
}

module.exports = { recallContext };
