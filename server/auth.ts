import { Router, type Request, type Response, type NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { storage } from './storage';
import { supabase } from './supabase';

const router = Router();

declare module 'express-session' {
  interface SessionData {
    userId?: number;
  }
}

interface AuthRequest extends Request {
  session: Request['session'] & {
    userId?: number;
  };
  user?: any;
}

router.post('/register', async (req: AuthRequest, res: Response) => {
  try {
    const { email, password, name, phone } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    const existingUser = await storage.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await storage.createUser({
      email,
      password: hashedPassword,
      name,
      phone: phone || null,
      role: 'client',
    });

    req.session.userId = user.id;

    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

router.post('/login', async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await storage.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!user.active) {
      return res.status(403).json({ error: 'Account is inactive' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    req.session.userId = user.id;

    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

router.post('/logout', (req: AuthRequest, res: Response) => {
  req.session.destroy((err: any) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to logout' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out successfully' });
  });
});

router.get('/me', async (req: AuthRequest, res: Response) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const user = await storage.getUserById(req.session.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// OAuth callback handler
router.post('/oauth/callback', async (req: AuthRequest, res: Response) => {
  try {
    const { access_token } = req.body;

    if (!access_token) {
      return res.status(400).json({ error: 'Missing access token' });
    }

    if (!supabase) {
      return res.status(500).json({ error: 'Supabase not configured' });
    }

    // Verify the access token with Supabase
    const { data: { user: supabaseUser }, error: userError } = await supabase.auth.getUser(access_token);

    if (userError || !supabaseUser) {
      console.error('Supabase user verification failed:', userError);
      return res.status(401).json({ error: 'Invalid access token' });
    }

    const email = supabaseUser.email;
    const provider = supabaseUser.app_metadata?.provider || 'unknown';
    const provider_id = supabaseUser.id;
    const name = supabaseUser.user_metadata?.full_name || 
                 supabaseUser.user_metadata?.name || 
                 email?.split('@')[0] || 'User';

    if (!email) {
      return res.status(400).json({ error: 'Email not provided by OAuth provider' });
    }

    // Check if user exists
    let user = await storage.getUserByEmail(email);

    if (!user) {
      // Create new user for OAuth login
      user = await storage.createUser({
        email,
        password: '', // No password for OAuth users
        name,
        phone: null,
        role: 'client',
      });
      
      console.log(`Created new user via ${provider} OAuth: ${email}`);
    } else {
      console.log(`Existing user logged in via ${provider} OAuth: ${email}`);
    }

    if (!user.active) {
      return res.status(403).json({ error: 'Account is inactive' });
    }

    // Set session
    req.session.userId = user.id;

    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.status(500).json({ error: 'Failed to process OAuth login' });
  }
});

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
}

export function requireRole(...roles: string[]) {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const user = await storage.getUserById(req.session.userId);
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    req.user = user;
    next();
  };
}

export default router;
