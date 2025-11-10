// API route: /api/auth/login
// Handles admin authentication

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Parse request body
    let body = {};
    try {
        body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    } catch (e) {
        return res.status(400).json({ error: 'Invalid JSON body' });
    }

    const { password } = body;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    if (!ADMIN_PASSWORD) {
        return res.status(500).json({ error: 'Admin password not configured. Please set ADMIN_PASSWORD in Vercel environment variables.' });
    }

    // Simple password comparison (in production, use bcrypt for hashing)
    if (password === ADMIN_PASSWORD) {
        // Generate a simple token (in production, use JWT)
        const token = generateToken();
        return res.status(200).json({ 
            success: true, 
            token: token,
            expiresIn: 3600 // 1 hour
        });
    } else {
        return res.status(401).json({ error: 'Invalid password' });
    }
}

// Simple token generator (in production, use proper JWT)
function generateToken() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < 32; i++) {
        token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token + Date.now().toString(36);
}
