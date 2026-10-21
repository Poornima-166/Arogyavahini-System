/**
 * ==============================================================================
 * PROJECT: AROGYAVAHINI
 * MODULE:  Vercel Serverless Function Entry Point
 * ==============================================================================
 * Handles incoming API requests when Arogyavahini is deployed on Vercel.
 * Rewritten from /api/(.*) via vercel.json.
 */

import { app } from '../server/app.js';
import { ensureDatabaseReady } from '../server/config/database.js';

let dbReadyPromise: Promise<void> | null = null;

function ensureDatabase() {
  if (!dbReadyPromise) {
    dbReadyPromise = ensureDatabaseReady().catch((err) => {
      console.warn('[Vercel Serverless] DB init notice:', err);
      dbReadyPromise = null;
      throw err;
    });
  }
  return dbReadyPromise;
}

// Vercel Serverless Handler
export default async function handler(req: any, res: any) {
  try {
    await ensureDatabase();
  } catch (err) {
    console.error('[Vercel Serverless] Fatal DB init failure:', err);
    return res.status(503).json({
      error: 'Database unavailable',
      status: 503,
      timestamp: new Date().toISOString(),
    });
  }
  return app(req, res);
}
