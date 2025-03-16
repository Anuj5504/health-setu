const express = require('express');
const router = express.Router();
const axios = require('axios');
const session = require('express-session');

// Fitbit API credentials
const CLIENT_ID = process.env.FITBIT_CLIENT_ID || '23Q3V2';
const CLIENT_SECRET = process.env.FITBIT_CLIENT_SECRET || '4f8232cb7d1aacf386bb05f6f693ce73';
const REDIRECT_URI = process.env.FITBIT_REDIRECT_URI || 'http://localhost:5000/connect';

// Initialize OAuth flow
router.get('/auth', (req, res) => {
  try {
    // Generate random state for CSRF protection
    const state = Math.random().toString(36).substring(7);
    req.session.fitbitState = state;

    const scopes = [
      'activity',
      'heartrate',
      'location',
      'nutrition',
      'profile',
      'settings',
      'sleep',
      'social',
      'weight'
    ].join(' ');
    
    const authUrl = new URL('https://www.fitbit.com/oauth2/authorize');
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('client_id', CLIENT_ID);
    authUrl.searchParams.append('scope', scopes);
    authUrl.searchParams.append('redirect_uri', REDIRECT_URI);
    authUrl.searchParams.append('state', state);
    authUrl.searchParams.append('prompt', 'login consent');
    
    console.log('Generated Auth URL:', authUrl.toString());
    res.json({ authUrl: authUrl.toString() });
  } catch (error) {
    console.error('Auth URL generation error:', error);
    res.status(500).json({ error: 'Failed to generate authorization URL' });
  }
});

// Handle OAuth callback
router.get('/callback', async (req, res) => {
  try {
    const { code, state } = req.query;

    // Verify state to prevent CSRF
    if (state !== req.session.fitbitState) {
      throw new Error('Invalid state parameter');
    }

    const tokenResponse = await axios({
      method: 'post',
      url: 'https://api.fitbit.com/oauth2/token',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI
      }).toString()
    });

    // Store tokens in session
    req.session.fitbitTokens = {
      accessToken: tokenResponse.data.access_token,
      refreshToken: tokenResponse.data.refresh_token,
      expiresIn: tokenResponse.data.expires_in,
      userId: tokenResponse.data.user_id
    };

    res.redirect('/fitbit-data');
  } catch (error) {
    console.error('Token exchange error:', error.response?.data || error);
    res.redirect('/fitbit-data?error=' + encodeURIComponent('Failed to connect to Fitbit'));
  }
});

// Token exchange endpoint
router.post('/token', async (req, res) => {
  try {
    const { code } = req.body;

    const tokenResponse = await axios({
      method: 'post',
      url: 'https://api.fitbit.com/oauth2/token',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI
      }).toString()
    });

    const tokens = {
      accessToken: tokenResponse.data.access_token,
      refreshToken: tokenResponse.data.refresh_token,
      expiresIn: tokenResponse.data.expires_in,
      expiresAt: Date.now() + (tokenResponse.data.expires_in * 1000),
      userId: tokenResponse.data.user_id
    };

    // Store in session
    req.session.fitbitTokens = tokens;

    res.json({
      success: true,
      tokens
    });
  } catch (error) {
    console.error('Token exchange error:', error.response?.data || error);
    res.status(500).json({
      success: false,
      error: 'Failed to exchange token'
    });
  }
});

// Get Fitbit data
router.get('/data', async (req, res) => {
  try {
    if (!req.session.fitbitTokens) {
      return res.status(401).json({ error: 'Not authenticated with Fitbit' });
    }

    const { accessToken } = req.session.fitbitTokens;

    // Fetch various Fitbit data
    const [profile, activities, sleep, heartRate] = await Promise.all([
      axios.get('https://api.fitbit.com/1/user/-/profile.json', {
        headers: { Authorization: `Bearer ${accessToken}` }
      }),
      axios.get('https://api.fitbit.com/1/user/-/activities/date/today.json', {
        headers: { Authorization: `Bearer ${accessToken}` }
      }),
      axios.get('https://api.fitbit.com/1.2/user/-/sleep/date/today.json', {
        headers: { Authorization: `Bearer ${accessToken}` }
      }),
      axios.get('https://api.fitbit.com/1/user/-/activities/heart/date/today/1d.json', {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
    ]);

    res.json({
      profile: profile.data,
      activities: activities.data,
      sleep: sleep.data,
      heartRate: heartRate.data
    });
  } catch (error) {
    console.error('Data fetch error:', error.response?.data || error);
    res.status(500).json({ error: 'Failed to fetch Fitbit data' });
  }
});

module.exports = router; 