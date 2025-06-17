import express from 'express';
import axios from 'axios';
import { google } from 'googleapis';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3001;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

function adminAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : header;
  if (process.env.ADMIN_TOKEN && token === process.env.ADMIN_TOKEN) {
    return next();
  }
  res.status(401).send('Unauthorized');
}

app.use('/admin', adminAuth, express.static(path.join(__dirname, 'admin')));

// --- TOOL SYSTEM ---
const tools = {
  async web_search({ query }) {
    // Example: Use DuckDuckGo Instant Answer API (no key needed, limited)
    const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_redirect=1&no_html=1`;
    const { data } = await axios.get(url);
    return {
      type: 'web_search',
      query,
      abstract: data.AbstractText,
      relatedTopics: data.RelatedTopics?.slice(0, 3) || [],
      source: 'DuckDuckGo Instant Answer',
    };
  },
  async calculator({ expression }) {
    try {
      // Simple JS eval for demo (never use eval with untrusted input in production!)
      const result = eval(expression);
      return { type: 'calculator', expression, result };
    } catch {
      return { type: 'calculator', expression, error: 'Invalid expression' };
    }
  },
};

// --- AGENT ENDPOINT ---
app.post('/agent', async (req, res) => {
  const { tool, params } = req.body;
  if (!tool || !tools[tool]) {
    return res.status(400).json({ error: 'Unknown or missing tool' });
  }
  try {
    const result = await tools[tool](params || {});
    res.json({ ok: true, result });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.get('/admin/analytics', adminAuth, async (req, res) => {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GA_CREDENTIALS || '{}'),
      scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
    });
    const analytics = google.analyticsdata({
      version: 'v1beta',
      auth: await auth.getClient(),
    });
    const propertyId = process.env.GA_PROPERTY_ID;
    const response = await analytics.properties.runReport({
      property: `properties/${propertyId}`,
      requestBody: {
        dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
        metrics: [{ name: 'activeUsers' }, { name: 'newUsers' }],
      },
    });
    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

app.get('/', (req, res) => {
  res.send('MCP Server for Agents is running.');
});

app.listen(PORT, () => {
  console.log(`MCP Server listening on port ${PORT}`);
});
