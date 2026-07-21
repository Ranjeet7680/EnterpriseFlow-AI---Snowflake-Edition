/**
 * proxy.js (Next.js 16+ — replaces middleware.js)
 *
 * This proxy intercepts all requests to /welcome and responds
 * with the greeting value read from your Vercel Edge Config store.
 */
import { NextResponse } from 'next/server';
import { get } from '@vercel/edge-config';

// Only intercept requests to /welcome
export const config = { matcher: '/welcome' };

// Next.js 16+ proxy file requires a default export or a named export named 'proxy'
export default async function proxy() {
  try {
    const greeting = await get('greeting');
    if (!greeting) {
      return NextResponse.json({
        greeting: "Welcome to EnterpriseFlow AI!",
        source: "Fallback (Edge Config empty or not connected)",
        timestamp: new Date().toISOString()
      });
    }
    return NextResponse.json(greeting);
  } catch (error) {
    return NextResponse.json({
      error: "Edge Config connection failed",
      message: error.message,
      tip: "Please configure EDGE_CONFIG in your environment variables."
    }, { status: 500 });
  }
}
