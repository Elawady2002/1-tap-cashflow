export async function callChatGPT(messages: { role: string; content: string }[]) {
    const apiKey = process.env.RAPIDAPI_KEY;
    const host = process.env.RAPIDAPI_HOST_CHATGPT || 'chatgpt-42.p.rapidapi.com';

    if (!apiKey) {
        throw new Error("Missing RAPIDAPI_KEY for ChatGPT");
    }

    const response = await fetch(`https://${host}/gpt4`, {
        method: 'POST',
        headers: {
            'x-rapidapi-key': apiKey,
            'x-rapidapi-host': host,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            messages: messages,
            web_access: false
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`ChatGPT API Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log(`ChatGPT API Response (${host}):`, JSON.stringify(data).substring(0, 200) + "...");
    
    const result = data.result || data.choices?.[0]?.message?.content || data.response || null;
    
    if (!result) {
        console.error("ChatGPT API Error: Unexpected response structure", data);
        throw new Error("ChatGPT API Error: Unexpected response structure");
    }
    
    return typeof result === 'string' ? result : JSON.stringify(result);
}

export async function expandKeywords(keyword: string): Promise<string[]> {
    const prompt = `Act as a marketing expert. Expand the keyword "${keyword}" into 10-12 specific, high-intent social media search variations. Return ONLY a JSON array of strings. No conversational text. Example: ["Keyword 1", "Keyword 2"]`;

    const result = await callChatGPT([{ role: "user", content: prompt }]);
    try {
        const cleaned = result.replace(/```json|```/g, '').trim();
        return JSON.parse(cleaned);
    } catch (e) {
        console.error("Failed to parse keyword variations:", result);
        return [keyword, `${keyword} review`, `${keyword} vs`].slice(0, 10);
    }
}

export async function classifyActivity(keyword: string, sampleData: string): Promise<{ level: string; count: number; classification: string }> {
    const prompt = `Analyze this social media data for "${keyword}":\n${sampleData}\n\nTasks:\n1. Determine Activity Level (Low Activity, Active, High Activity).\n2. Count total posts/comments accurately.\n3. Write a 2-sentence classification of user intent (Questions, Complaints, Recommendations).\n\nReturn ONLY a JSON object: {"level": "...", "count": 12, "classification": "..."}`;

    const result = await callChatGPT([{ role: "user", content: prompt }]);
    try {
        const cleaned = result.replace(/```json|```/g, '').trim();
        return JSON.parse(cleaned);
    } catch (e) {
        return { level: "Active", count: 0, classification: "Analysis failed, please try again." };
    }
}

export async function generateReplies(posts: any[], affiliateLink: string): Promise<any[]> {
    const postsJson = JSON.stringify(posts.map(p => ({ id: p.id, text: p.text })));
    const prompt = `For each of these posts, generate 3 distinct natural, human responses.
    Affiliate/Target Link: ${affiliateLink}
    
    Styles:
    1. Short: Casual, direct.
    2. Medium: Helpful, detailed.
    3. Curiosity: Hook-based.
    
    Posts:
    ${postsJson}
    
    Return ONLY a JSON array of objects: [{"id": "post_id", "text": "original_text", "replies": ["Short...", "Medium...", "Curiosity..."]}]`;

    const result = await callChatGPT([{ role: "user", content: prompt }]);
    try {
        const cleaned = result.replace(/```json|```/g, '').trim();
        return JSON.parse(cleaned);
    } catch (e) {
        console.error("Generation failed:", result);
        return [];
    }
}
