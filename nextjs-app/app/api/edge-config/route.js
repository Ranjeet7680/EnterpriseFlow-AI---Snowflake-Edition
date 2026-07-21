/**
 * app/api/edge-config/route.js
 *
 * A server-side API route to read values from Vercel Edge Config.
 * Useful for debugging what keys are in your Edge Config store.
 *
 * GET /api/edge-config?key=greeting
 * GET /api/edge-config                 → returns all keys
 */
import { get, getAll, has } from '@vercel/edge-config';
import { NextResponse } from 'next/server';

export const runtime = 'edge'; // Run on the Edge network for lowest latency

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (key) {
      // Check if key exists first
      const exists = await has(key);
      if (!exists) {
        return NextResponse.json(
          {
            error: `Key "${key}" not found in Edge Config`,
            tip: 'Add it in the Vercel Dashboard → Storage → Edge Config → Items',
          },
          { status: 404 }
        );
      }

      const value = await get(key);
      return NextResponse.json({ key, value });
    }

    // No key provided — return all values
    const all = await getAll();
    return NextResponse.json({
      store: all,
      count: Object.keys(all).length,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    // EDGE_CONFIG env var is missing or invalid
    return NextResponse.json(
      {
        error: 'Edge Config connection failed',
        message: err.message,
        fix: 'Run: vercel env pull .env.local — then restart the dev server',
      },
      { status: 500 }
    );
  }
}
