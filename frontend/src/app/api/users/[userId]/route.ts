import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = "https://ubi-sys-lab-no-knock.vercel.app/api";

export async function GET(
    request: NextRequest,
    { params }: { params: { userId: string } }
) {
    try {
        const userId = params.userId;
        console.log(`Fetching user ${userId} from:`, `${API_BASE_URL}/users/${userId}`);
        console.log(`Type of userId param:`, typeof userId);

        // First try to fetch the specific user
        const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
            cache: 'no-store'
        });

        // If the direct user fetch fails, try getting all users and filtering
        if (!response.ok) {
            console.log(`Direct fetch for user ${userId} failed with status: ${response.status}, trying to get all users`);

            const allUsersResponse = await fetch(`${API_BASE_URL}/users`, {
                cache: 'no-store'
            });

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
            return NextResponse.json(user);
        }

        const data = await response.json();
        console.log(`User ${userId} API response:`, data);
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
            },
            body: JSON.stringify(body),
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`);
        }

        const data = await response.json();
        console.log(`User ${userId} update response:`, data);
        return NextResponse.json(data);
    } catch (error) {
        console.error(`Error updating user ${params.userId}:`, error);
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }
}
