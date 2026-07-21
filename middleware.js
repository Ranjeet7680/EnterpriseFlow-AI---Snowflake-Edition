import { get } from '@vercel/edge-config';

export const config = {
  matcher: '/welcome',
};

export default async function middleware(request) {
  try {
    const greeting = await get('greeting');
    return new Response(JSON.stringify(greeting || "Welcome to EnterpriseFlow AI!"), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: "Edge Config connection failed",
      message: error.message 
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
    });
  }
}
