// API route: /api/auth/verify
// Verifies admin authentication token

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Get token from Authorization header or body
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace('Bearer ', '') || req.body?.token;

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    // Simple token validation (in production, use proper JWT verification)
    // For now, we'll just check if token exists and is recent (within 1 hour)
    const tokenTimestamp = parseInt(token.slice(-8), 36);
    const currentTime = Date.now();
    const oneHour = 60 * 60 * 1000;

    if (currentTime - tokenTimestamp > oneHour) {
        return res.status(401).json({ error: 'Token expired' });
    }

    return res.status(200).json({ success: true, valid: true });
}
