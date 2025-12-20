import { NextResponse } from 'next/server';

// Firebase Auth handles OAuth callbacks automatically via popup/redirect flow
// This route can redirect users after authentication
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  
  // Firebase Auth will automatically complete the OAuth flow
  // Just redirect to the practice page
  return NextResponse.redirect(new URL('/practice', requestUrl.origin));
}
