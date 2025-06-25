import { NextResponse } from 'next/server';

const API_BASE_URL = "https://ubi-sys-lab-no-knock.vercel.app/api";

// Cache for all users with 1-minute TTL
interface ApiUser {
    id: string | number;
    name: string;
    title: string;
    department: string;
    email: string;
    officeId: number;
    isPublic: boolean;
    [key: string]: string | number | boolean | undefined;
}

interface CacheEntry {
    data: ApiUser[];
    timestamp: number;
}

let usersCache: CacheEntry | null = null;
const CACHE_TTL = 60000; // 1 minute in milliseconds

export async function GET() {
    try {
        // Check cache first
        if (usersCache && (Date.now() - usersCache.timestamp < CACHE_TTL)) {
            console.log('Using cached data for all users');
            return NextResponse.json(usersCache.data);
        }

        console.log('Fetching users from:', `${API_BASE_URL}/users`);
        const response = await fetch(`${API_BASE_URL}/users`, {
            // Add cache: 'no-store' to ensure we don't get cached responses
            cache: 'no-store',
            headers: {
                'Cache-Control': 'no-cache'
            }
        });

        if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Users API response:', data);

        // Store in cache
        usersCache = { data, timestamp: Date.now() };

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}
