import { NextResponse } from 'next/server';

const API_BASE_URL = "https://ubi-sys-lab-no-knock.vercel.app/api";

export async function GET() {
    try {
        console.log('Fetching users from:', `${API_BASE_URL}/users`);
        const response = await fetch(`${API_BASE_URL}/users`, {
            // Add cache: 'no-store' to ensure we don't get cached responses
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Users API response:', data);
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}
