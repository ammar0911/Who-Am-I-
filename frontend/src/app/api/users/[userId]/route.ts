import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = "https://ubi-sys-lab-no-knock.vercel.app/api";

// Cache for user data with 1-minute TTL
interface ApiUser {
    id: string | number;
    name: string;
    title: string;
    department: string;
    email: string;
    officeId: number;
    isPublic: boolean;
    [key: string]: string | number | boolean | undefined; // For any additional properties
}

interface CacheEntry {
    data: ApiUser;
    timestamp: number;
}

const userCache = new Map<string, CacheEntry>();
const CACHE_TTL = 60000; // 1 minute in milliseconds

export async function GET(
    request: NextRequest,
    { params }: { params: { userId: string } }
) {
    try {
        const userId = params.userId;
        console.log(`Fetching user ${userId}`);

        // Check cache first
        const cachedUser = userCache.get(userId);
        if (cachedUser && (Date.now() - cachedUser.timestamp < CACHE_TTL)) {
            console.log(`Using cached data for user ${userId}`);
            return NextResponse.json(cachedUser.data);
        }

        // Add cache control header to request
        const fetchOptions = {
            cache: 'no-store' as RequestCache,
            headers: {
                'Cache-Control': 'no-cache'
            }
        };

        // First try to fetch the specific user
        const response = await fetch(`${API_BASE_URL}/users/${userId}`, fetchOptions);

        // If the direct user fetch fails, try getting all users and filtering
        if (!response.ok) {
            console.log(`Direct fetch for user ${userId} failed with status: ${response.status}, trying to get all users`);

            const allUsersResponse = await fetch(`${API_BASE_URL}/users`, fetchOptions);

            if (!allUsersResponse.ok) {
                throw new Error(`API responded with status: ${allUsersResponse.status}`);
            }

            const allUsers = await allUsersResponse.json();
            console.log(`Fetched all users, count:`, allUsers.length);

            // Find the user with the matching ID by comparing string values
            const user = allUsers.find((u: { id: string | number }) => String(u.id) === String(userId));

            if (!user) {
                console.log(`User ${userId} not found in the list of all users`);
                return NextResponse.json({ error: 'User not found' }, { status: 404 });
            }

            console.log(`Found user ${userId} in the list:`, user);

            // Store in cache
            userCache.set(userId, { data: user, timestamp: Date.now() });

            return NextResponse.json(user);
        }

        const data = await response.json();
        console.log(`User ${userId} API response:`, data);

        // Store in cache
        userCache.set(userId, { data, timestamp: Date.now() });

        return NextResponse.json(data);
    } catch (error) {
        console.error(`Error fetching user ${params.userId}:`, error);
        return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: { userId: string } }
) {
    try {
        const userId = params.userId;
        const body = await request.json();

        console.log(`Updating user ${userId} with data:`, body);

        const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`);
        }

        const data = await response.json();
        console.log(`User ${userId} update response:`, data);

        // Remove from cache since data was updated
        userCache.delete(userId);

        return NextResponse.json(data);
    } catch (error) {
        console.error(`Error updating user ${params.userId}:`, error);
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }
}
