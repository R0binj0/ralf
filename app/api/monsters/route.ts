import { NextRequest, NextResponse } from 'next/server';
import { getMonsters, searchMonsters } from '@/app/services/monsterService';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
  const search = searchParams.get('search');

  try {
    let monsters;
    if (search) {
      monsters = await searchMonsters(search);
    } else {
      monsters = await getMonsters(limit);
    }

    return NextResponse.json(monsters);
  } catch (error) {
    console.error('Error fetching monsters:', error);
    return NextResponse.json(
      { error: 'Failed to fetch monsters' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.description || !body.behavior) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Here you would typically save the monster to a database
    // For now, we'll just return the monster data
    const newMonster = {
      id: Date.now(), // Temporary ID generation
      ...body,
      added: new Date().toISOString(),
      edited: new Date().toISOString()
    };

    return NextResponse.json(newMonster, { status: 201 });
  } catch (error) {
    console.error('Error creating monster:', error);
    return NextResponse.json(
      { error: 'Failed to create monster' },
      { status: 500 }
    );
  }
} 