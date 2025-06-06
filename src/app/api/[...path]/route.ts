import { NextRequest, NextResponse } from 'next/server';

const API_URL = 'https://finsenseibackend-production.up.railway.app';

async function handleRequest(
  request: NextRequest,
  method: string
) {
  try {
    const path = request.nextUrl.pathname.replace('/api/', '');
    const url = `${API_URL}/api/${path}`;
    
    const headers = new Headers(request.headers);
    headers.set('Content-Type', 'application/json');
    
    const response = await fetch(url, {
      method,
      headers,
      body: method !== 'GET' ? await request.text() : undefined,
    });

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return handleRequest(request, 'GET');
}

export async function POST(request: NextRequest) {
  return handleRequest(request, 'POST');
}

export async function PUT(request: NextRequest) {
  return handleRequest(request, 'PUT');
}

export async function DELETE(request: NextRequest) {
  return handleRequest(request, 'DELETE');
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
} 