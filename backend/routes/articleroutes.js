const express = require('express');
const router = express.Router();
const {getTrendingArticles,
    searchNews,
    summarizeAndAnalyzeSentiment,
    getSavedArticles,
    saveArticle,
    deleteArticle,
    resummarizeArticle,
    getDashboardAnalytics}=require('../controllers/articleController');
const auth=require('../middleware/authmiddleware');

// @route   GET api/articles/trending
router.get('/trending', getTrendingArticles);

// @route   GET api/articles/search
router.get('/search', searchNews);

// @route   POST api/articles/summarize
router.post('/summarize', summarizeAndAnalyzeSentiment);

// @route   GET api/articles/saved
router.get('/saved', auth, getSavedArticles);

// @route   POST api/articles/save
router.post('/save', auth, saveArticle);

// @route   DELETE api/articles/:id
router.delete('/:id', auth, deleteArticle);

// @route   PUT api/articles/resummarize/:id
router.put('/resummarize/:id', auth, resummarizeArticle);

// @route   GET api/articles/analytics
router.get('/analytics', auth, getDashboardAnalytics);

module.exports = router;
