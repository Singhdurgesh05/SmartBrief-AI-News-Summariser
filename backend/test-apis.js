const axios = require('axios');

const BASE_URL = 'http://localhost:7000/api';
let authToken = '';
let testUserId = '';
let savedArticleId = '';

// Test colors
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  reset: '\x1b[0m',
  cyan: '\x1b[36m'
};

const testEmail = `test_${Date.now()}@example.com`;
const testPassword = 'Test123456';

console.log(`\n${colors.cyan}========================================`);
console.log(`Testing SmartBrief API Endpoints`);
console.log(`========================================${colors.reset}\n`);

// Helper function to log test results
function logTest(name, success, error = null) {
  if (success) {
    console.log(`${colors.green}✓${colors.reset} ${name}`);
  } else {
    console.log(`${colors.red}✗${colors.reset} ${name}`);
    if (error) {
      console.log(`  ${colors.red}Error: ${error.message}${colors.reset}`);
      if (error.response?.data) {
        console.log(`  ${colors.yellow}Response: ${JSON.stringify(error.response.data)}${colors.reset}`);
      }
    }
  }
}

// Test functions
async function testRegister() {
  try {
    const response = await axios.post(`${BASE_URL}/auth/register`, {
      email: testEmail,
      password: testPassword
    });
    authToken = response.data.token;
    testUserId = response.data.user.id;
    logTest('POST /api/auth/register', true);
    return true;
  } catch (error) {
    logTest('POST /api/auth/register', false, error);
    return false;
  }
}

async function testLogin() {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: testEmail,
      password: testPassword
    });
    authToken = response.data.token;
    logTest('POST /api/auth/login', true);
    return true;
  } catch (error) {
    logTest('POST /api/auth/login', false, error);
    return false;
  }
}

async function testGetUser() {
  try {
    await axios.get(`${BASE_URL}/auth/user`, {
      headers: { 'x-auth-token': authToken }
    });
    logTest('GET /api/auth/user', true);
    return true;
  } catch (error) {
    logTest('GET /api/auth/user', false, error);
    return false;
  }
}

async function testGetTrending() {
  try {
    const response = await axios.get(`${BASE_URL}/articles/trending`);
    if (response.data && Array.isArray(response.data)) {
      logTest('GET /api/articles/trending', true);
      return true;
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    logTest('GET /api/articles/trending', false, error);
    return false;
  }
}

async function testSearchNews() {
  try {
    const response = await axios.get(`${BASE_URL}/articles/search?q=technology`);
    if (response.data && Array.isArray(response.data)) {
      logTest('GET /api/articles/search', true);
      return true;
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    logTest('GET /api/articles/search', false, error);
    return false;
  }
}

async function testSummarize() {
  try {
    const response = await axios.post(`${BASE_URL}/articles/summarize`, {
      articleUrl: 'https://www.bbc.com/news/technology'
    });
    if (response.data && response.data.summary && response.data.sentiment) {
      logTest('POST /api/articles/summarize', true);
      return true;
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    logTest('POST /api/articles/summarize', false, error);
    return false;
  }
}

async function testSaveArticle() {
  try {
    const response = await axios.post(`${BASE_URL}/articles/save`, {
      title: 'Test Article - BBC Technology News',
      source: 'BBC',
      url: 'https://www.bbc.com/news/technology',
      urlToImage: 'https://ichef.bbci.co.uk/news/1024/branded_news/1234/production/_example.jpg',
      summary: 'This is a test article summary about technology',
      sentiment: 'NEUTRAL',
      publishedAt: new Date().toISOString()
    }, {
      headers: { 'x-auth-token': authToken }
    });
    savedArticleId = response.data._id;
    logTest('POST /api/articles/save', true);
    return true;
  } catch (error) {
    logTest('POST /api/articles/save', false, error);
    return false;
  }
}

async function testGetSavedArticles() {
  try {
    const response = await axios.get(`${BASE_URL}/articles/saved`, {
      headers: { 'x-auth-token': authToken }
    });
    if (response.data && Array.isArray(response.data)) {
      logTest('GET /api/articles/saved', true);
      return true;
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    logTest('GET /api/articles/saved', false, error);
    return false;
  }
}

async function testResummarizeArticle() {
  try {
    const response = await axios.put(`${BASE_URL}/articles/resummarize/${savedArticleId}`, {}, {
      headers: { 'x-auth-token': authToken }
    });
    if (response.data && response.data.summary && response.data.sentiment) {
      logTest('PUT /api/articles/resummarize/:id', true);
      return true;
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    logTest('PUT /api/articles/resummarize/:id', false, error);
    return false;
  }
}

async function testDeleteArticle() {
  try {
    await axios.delete(`${BASE_URL}/articles/${savedArticleId}`, {
      headers: { 'x-auth-token': authToken }
    });
    logTest('DELETE /api/articles/:id', true);
    return true;
  } catch (error) {
    logTest('DELETE /api/articles/:id', false, error);
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log(`${colors.cyan}Auth Endpoints:${colors.reset}`);
  await testRegister();
  await testLogin();
  await testGetUser();

  console.log(`\n${colors.cyan}Article Endpoints (Public):${colors.reset}`);
  await testGetTrending();
  await testSearchNews();
  await testSummarize();

  console.log(`\n${colors.cyan}Article Endpoints (Protected):${colors.reset}`);
  await testSaveArticle();
  await testGetSavedArticles();
  await testResummarizeArticle();
  await testDeleteArticle();

  console.log(`\n${colors.cyan}========================================`);
  console.log(`Testing Complete!`);
  console.log(`========================================${colors.reset}\n`);
}

runTests().catch(error => {
  console.error(`${colors.red}Unexpected error:${colors.reset}`, error);
  process.exit(1);
});
