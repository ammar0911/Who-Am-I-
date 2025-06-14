import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = "https://ubi-sys-lab-no-knock.vercel.app/api";

export async function GET(request: NextRequest) {
    try {
        // Get query parameters to pass to the external API
        const searchParams = request.nextUrl.searchParams;
        const officeId = searchParams.get('officeId');

        let url = `${API_BASE_URL}/sensors`;
        if (officeId) {
            url += `?officeId=${officeId}`;
        }

        console.log('Fetching sensors from:', url);
        const response = await fetch(url, {
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Sensors API response:', data);
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching sensors:', error);
        return NextResponse.json({ error: 'Failed to fetch sensors' }, { status: 500 });
    }
}
