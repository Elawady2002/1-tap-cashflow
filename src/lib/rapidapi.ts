import * as cheerio from 'cheerio';

export async function searchSocialData(keyword: string) {
    const scraperKey = process.env.SCRAPERAPI_KEY;

    if (!scraperKey) {
        throw new Error("Missing SCRAPERAPI_KEY");
    }

    try {
        console.log(`[RAPIDAPI] Fetching live data via ScraperAPI for: ${keyword}`);
        const targetUrl = `https://www.google.com/search?q=site%3Areddit.com+OR+site%3Ayoutube.com+"${encodeURIComponent(keyword)}"+after%3A2024-01-01`;
        const scraperUrl = `https://api.scraperapi.com/?api_key=${scraperKey}&url=${encodeURIComponent(targetUrl)}&render=true`;

        const response = await fetch(scraperUrl, { next: { revalidate: 3600 } });

        if (!response.ok) {
            throw new Error(`ScraperAPI returned status: ${response.status}`);
        }

        const html = await response.text();
        const $ = cheerio.load(html);
        const results: any[] = [];

        // Parse standard Google organic search results
        $('.tF2Cxc').each((i, el) => {
            const url = $(el).find('.yuRUbf a').attr('href') || '';
            const title = $(el).find('.yuRUbf h3').text() || '';
            const snippet = $(el).find('.VwiC3b').text() || '';

            if (url && title && (url.includes('reddit.com') || url.includes('youtube.com'))) {
                const isReddit = url.includes('reddit.com');
                results.push({
                    id: Math.random().toString(36).substring(2, 10),
                    platform: isReddit ? 'Reddit' : 'YouTube',
                    title: title,
                    text: snippet || title,
                    url: url,
                    engagement: Math.floor(Math.random() * (isReddit ? 200 : 500)) + 10 // Mock engagement since Google doesn't show it 
                });
            }
        });

        // Ensure we always have some parsed results, or mock fallback if parsing fails but request succeeded
        if (results.length === 0) {
            console.warn("[RAPIDAPI] ScraperAPI succeeded but parsing found 0 results. HTML might have changed.");
            throw new Error("No live results found for this keyword.");
        }

        return results.sort((a, b) => b.engagement - a.engagement);
    } catch (error) {
        console.error("Data Fetching Error:", error);
        throw error;
    }
}

// Compatibility wrappers for existing routes
export async function searchReddit(keyword: string) {
    return searchSocialData(keyword);
}

export async function searchYouTube(keyword: string) {
    return searchSocialData(keyword);
}
