const axios = require('axios');
const Article = require('../models/article'); // Corrected import (lowercase 'a')
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Init GenAI - Using the correct key and initialization
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// Use gemini-2.5-flash which is available in the API
const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash"
});

// Simple in-memory cache for NewsAPI calls (15 minutes TTL)
const newsCache = new Map();
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

const getCachedNews = (category) => {
    const cached = newsCache.get(category);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
    }
    return null;
};

const setCachedNews = (category, data) => {
    newsCache.set(category, { data, timestamp: Date.now() });
};

// --- Helper Function ---
// Fetch article content from URL
const fetchArticleContent = async (articleUrl) => {
    try {
        const response = await axios.get(articleUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 10000
        });
        // Extract text from HTML (simple extraction - gets the HTML content)
        let text = response.data;
        // Remove script and style tags and their content
        text = text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        text = text.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
        // Remove HTML tags
        text = text.replace(/<[^>]+>/g, ' ');
        // Clean up whitespace
        text = text.replace(/\s+/g, ' ').trim();
        // Limit to first 5000 characters to avoid token limits
        return text.substring(0, 5000);
    } catch (error) {
        throw new Error('Failed to fetch article content');
    }
};

// This function constructs the prompt for Gemini
const constructingPrompt = (articleContent) => {
    return `Analyze the following article content and provide a JSON response:

${articleContent}

Return ONLY a valid JSON object with these exact keys:
- "summary": A concise, 3-sentence summary of the article
- "sentiment": Must be exactly one of: "POSITIVE", "NEGATIVE", or "NEUTRAL"

Example response format:
{"summary": "Brief summary here.", "sentiment": "POSITIVE"}`;
};


// --- Controller Functions ---

// @desc    Get trending news
const getTrendingArticles = async (req, res) => {
    const { category = 'general', refresh } = req.query;

    // Use a larger pageSize to get more articles and randomize selection
    const pageSize = 100; // Get more articles
    const url = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&pageSize=${pageSize}&apiKey=${process.env.NEWS_API_KEY}`;

    try {
        const response = await axios.get(url, {
            headers: {
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        });

        let articles = response.data.articles || [];

        // If refresh is requested, shuffle articles to show different ones
        if (refresh && articles.length > 20) {
            // Fisher-Yates shuffle algorithm
            for (let i = articles.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [articles[i], articles[j]] = [articles[j], articles[i]];
            }
        }

        res.json(articles);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error fetching trending news' });
    }
};

// @desc    Search for news articles (Added back - required for search bar)
const searchNews = async (req, res) => {
    const { q, refresh } = req.query;
    if (!q) {
        return res.status(400).json({ message: 'Search query is required' });
    }

    // Use different sort orders to get varied results
    const sortBy = refresh ? 'publishedAt' : 'popularity'; // Switch sorting on refresh
    const pageSize = 100; // Get more results
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(q)}&sortBy=${sortBy}&pageSize=${pageSize}&apiKey=${process.env.NEWS_API_KEY}`;

    try {
        const response = await axios.get(url, {
            headers: {
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        });

        let articles = response.data.articles || [];

        // If refresh is requested and we have many articles, shuffle them
        if (refresh && articles.length > 20) {
            // Fisher-Yates shuffle
            for (let i = articles.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [articles[i], articles[j]] = [articles[j], articles[i]];
            }
        }

        res.json(articles);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error searching for news' });
    }
};

// @desc    Summarize and analyze an article
const summarizeAndAnalyzeSentiment = async (req, res) => {
    const { articleUrl } = req.body;
    if (!articleUrl) {
        return res.status(400).json({ msg: 'Please provide article URL' });
    }
    try {
        // Fetch article content
        const articleContent = await fetchArticleContent(articleUrl);
        const prompt = constructingPrompt(articleContent);
        const result = await model.generateContent(prompt);
        let responseText = result.response.text();

        // Clean up response - remove markdown code blocks if present
        responseText = responseText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();

        // Parse the JSON string from Gemini
        const data = JSON.parse(responseText);

        if (!data.summary || !data.sentiment) {
            return res.status(500).json({ msg: 'Invalid response from AI model' });
        }
        res.json({
            summary: data.summary,
            sentiment: data.sentiment
        });
    } catch (err) {
        console.error('Error in summarize:', err.message);
        res.status(500).json({ message: 'Failed to summarize article' });
    }
};

// @desc    Get user's saved articles
const getSavedArticles = async (req, res) => {
    try {
        // FIXED: Query should be { user: req.user.id } to match the model
        const articles = await Article.find({ user: req.user.id }).sort({ savedAt: -1 });
        res.json(articles);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error fetching saved articles' }); // Send JSON error
    }
};

// @desc    Save an article (FIXED: Typo in function name)
const saveArticle = async (req, res) => {
    const { title, source, url, urlToImage, summary, sentiment, publishedAt } = req.body;
    try {
        const newArticle = new Article({
            user: req.user.id,
            title,
            source,
            url,
            urlToImage,
            summary,
            sentiment,
            publishedAt,
            summarizedAt: new Date() // Set summarizedAt when article is saved with summary
        });
        const article = await newArticle.save();
        res.status(201).json(article); // Send 201 status for creation
    } catch (error) {
        console.error(error.message);
        if (error.code === 11000) {
            return res.status(400).json({ msg: 'Article already saved' });
        }
        res.status(500).json({ message: 'Server error' }); // Send JSON error
    }
};

// @desc    Delete a saved article
const deleteArticle = async (req, res) => {
    try {
         const article = await Article.findOne({ _id: req.params.id, user: req.user.id });
        if (!article) return res.status(404).json({ msg: 'Article not found' });
        
        await Article.findByIdAndDelete(req.params.id);
        res.json({ success: true, msg: 'Article deleted' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error deleting article' }); // Send JSON error
    }
};

// @desc    Re-summarize a saved article
const resummarizeArticle = async (req, res) => {
    try {
        const article = await Article.findOne({ _id: req.params.id, user: req.user.id });
        if (!article) return res.status(404).json({ msg: 'Article not found' });

        // Fetch article content
        const articleContent = await fetchArticleContent(article.url);
        const prompt = constructingPrompt(articleContent);
        const result = await model.generateContent(prompt);
        let responseText = result.response.text();

        // Clean up response - remove markdown code blocks if present
        responseText = responseText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();

        const data = JSON.parse(responseText);
        if (!data.summary || !data.sentiment) {
            return res.status(500).json({ msg: 'Invalid response from AI model' });
        }
        article.summary = data.summary;
        article.sentiment = data.sentiment;
        article.summarizedAt = new Date(); // Update summarizedAt when article is re-summarized
        await article.save();
        res.json(article);
    } catch (err) {
        console.error('Error in resummarize:', err.message);
        res.status(500).json({ message: 'Failed to re-summarize article' });
    }
};

// @desc    Get dashboard analytics
const getDashboardAnalytics = async (req, res) => {
    try {
        const userId = req.user.id;

        // Get saved articles for the user
        const savedArticles = await Article.find({ user: userId });

        // Calculate statistics
        const totalSaved = savedArticles.length;

        // Get unique sources
        const uniqueSources = new Set(savedArticles.map(article => article.source));
        const totalSources = uniqueSources.size;

        // Get total articles count across all users (platform-wide)
        const totalArticlesCount = await Article.countDocuments();

        // Extract keywords from saved articles (top words from titles)
        const extractKeywords = (articles) => {
            const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can']);
            const wordFreq = {};

            articles.forEach(article => {
                const words = article.title.toLowerCase().split(/\W+/);
                words.forEach(word => {
                    if (word.length > 3 && !stopWords.has(word)) {
                        wordFreq[word] = (wordFreq[word] || 0) + 1;
                    }
                });
            });

            return Object.keys(wordFreq).length;
        };

        const keywordsCount = extractKeywords(savedArticles);

        // Get today's date for comparison
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Articles summarized today (using summarizedAt field)
        const articlesAddedToday = savedArticles.filter(article => {
            const summarizedDate = new Date(article.summarizedAt);
            summarizedDate.setHours(0, 0, 0, 0);
            return summarizedDate.getTime() === today.getTime();
        }).length;

        // Yesterday
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const articlesAddedYesterday = savedArticles.filter(article => {
            const summarizedDate = new Date(article.summarizedAt);
            summarizedDate.setHours(0, 0, 0, 0);
            return summarizedDate.getTime() === yesterday.getTime();
        }).length;

        // Calculate sentiment distribution
        const sentimentCounts = {
            POSITIVE: 0,
            NEGATIVE: 0,
            NEUTRAL: 0
        };

        savedArticles.forEach(article => {
            const sentiment = article.sentiment?.toUpperCase();
            if (sentimentCounts.hasOwnProperty(sentiment)) {
                sentimentCounts[sentiment]++;
            }
        });

        // Calculate percentages
        const positivePercent = totalSaved > 0 ? Math.round((sentimentCounts.POSITIVE / totalSaved) * 100) : 0;
        const negativePercent = totalSaved > 0 ? Math.round((sentimentCounts.NEGATIVE / totalSaved) * 100) : 0;

        // Fetch trending articles from NewsAPI for category analysis
        const categories = ['technology', 'business', 'health', 'science'];
        const categoryStats = [];

        // Analyze sentiment from user's saved articles by category
        const categorySentimentMap = {};
        savedArticles.forEach(article => {
            const titleLower = article.title.toLowerCase();
            let detectedCategory = null;

            // Simple keyword-based category detection
            if (titleLower.includes('tech') || titleLower.includes('software') || titleLower.includes('ai') || titleLower.includes('cyber') || titleLower.includes('digital') || titleLower.includes('computer')) {
                detectedCategory = 'technology';
            } else if (titleLower.includes('business') || titleLower.includes('market') || titleLower.includes('economy') || titleLower.includes('trade') || titleLower.includes('stock') || titleLower.includes('company')) {
                detectedCategory = 'business';
            } else if (titleLower.includes('health') || titleLower.includes('medical') || titleLower.includes('doctor') || titleLower.includes('disease') || titleLower.includes('hospital') || titleLower.includes('wellness')) {
                detectedCategory = 'health';
            } else if (titleLower.includes('science') || titleLower.includes('research') || titleLower.includes('study') || titleLower.includes('discovery') || titleLower.includes('scientist') || titleLower.includes('experiment')) {
                detectedCategory = 'science';
            }

            if (detectedCategory) {
                if (!categorySentimentMap[detectedCategory]) {
                    categorySentimentMap[detectedCategory] = { POSITIVE: 0, NEGATIVE: 0, NEUTRAL: 0, total: 0 };
                }
                const sentiment = article.sentiment?.toUpperCase() || 'NEUTRAL';
                if (categorySentimentMap[detectedCategory].hasOwnProperty(sentiment)) {
                    categorySentimentMap[detectedCategory][sentiment]++;
                    categorySentimentMap[detectedCategory].total++;
                }
            }
        });

        for (const category of categories) {
            try {
                // Check cache first
                let articles = getCachedNews(category);
                let articleCount = 0;

                if (!articles) {
                    // Fetch from API if not cached
                    const url = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&pageSize=20&apiKey=${process.env.NEWS_API_KEY}`;
                    const response = await axios.get(url);
                    articles = response.data.articles || [];
                    setCachedNews(category, articles);
                }

                articleCount = articles.length;

                // Use real sentiment data if available, otherwise use balanced distribution
                let positive, negative, neutral;
                if (categorySentimentMap[category] && categorySentimentMap[category].total > 0) {
                    const catData = categorySentimentMap[category];
                    positive = Math.round((catData.POSITIVE / catData.total) * 100);
                    negative = Math.round((catData.NEGATIVE / catData.total) * 100);
                    neutral = 100 - positive - negative;
                } else {
                    // Default balanced distribution when no data available
                    positive = 50;
                    neutral = 30;
                    negative = 20;
                }

                categoryStats.push({
                    category,
                    articleCount,
                    sentiments: {
                        positive,
                        neutral,
                        negative
                    }
                });
            } catch (error) {
                console.error(`Error fetching ${category} articles:`, error.message);
                // Add category with default values even if API call fails
                categoryStats.push({
                    category,
                    articleCount: 0,
                    sentiments: {
                        positive: 50,
                        neutral: 30,
                        negative: 20
                    }
                });
            }
        }

        res.json({
            summary: {
                articlesAddedToday,
                changeFromYesterday: articlesAddedToday - articlesAddedYesterday,
                sentimentOverview: {
                    positivePercent,
                    negativePercent
                }
            },
            quickStats: {
                totalArticles: totalArticlesCount, // Real count from database
                savedItems: totalSaved,
                sources: totalSources,
                keywords: keywordsCount // Extracted from article titles
            },
            categoryAnalytics: categoryStats
        });

    } catch (error) {
        console.error('Error fetching dashboard analytics:', error.message);
        res.status(500).json({ message: 'Error fetching dashboard analytics' });
    }
};

module.exports = {
    getTrendingArticles,
    searchNews, 
    summarizeAndAnalyzeSentiment,
    getSavedArticles,
    saveArticle,
    deleteArticle,
    resummarizeArticle,
    getDashboardAnalytics
};

