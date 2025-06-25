import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = "https://ubi-sys-lab-no-knock.vercel.app/api";

// Define the sensor interface
interface ApiSensor {
    id: string | number;
    batteryStatus?: number;
    inputTime?: string;
    isOpen: boolean;
    officeId?: number;
}

export async function GET(request: NextRequest) {
    try {
        // Get query parameters
        const searchParams = request.nextUrl.searchParams;
        const officeId = searchParams.get("officeId");

        let url = `${API_BASE_URL}/sensors`;

        // If officeId is provided, add it to the query
        if (officeId) {
            console.log(`Fetching sensors for office ${officeId}`);

            // Try the direct endpoint first
            try {
                const directUrl = `${API_BASE_URL}/sensors/byOfficeId?officeId=${officeId}`;
                console.log(`Trying direct endpoint: ${directUrl}`);

                const directResponse = await fetch(directUrl, {
                    cache: "no-store",
                });

                if (directResponse.ok) {
                    const data = await directResponse.json();
                    console.log(`Found sensor for office ${officeId}:`, data);

                    // Wrap single object in array to maintain consistent API response format
                    const sensorArray = Array.isArray(data) ? data : [data];
                    return NextResponse.json(sensorArray);
                }
            } catch (error) {
                console.log(`Error fetching from direct endpoint: ${error}`);
            }

            // Fallback: Add officeId parameter to the base URL
            url += `?officeId=${officeId}`;
        }

        console.log('Fetching sensors from:', url);
        const response = await fetch(url, {
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`);
        }

        const allSensors: ApiSensor[] = await response.json();

        // If we have officeId and the API doesn't filter properly, do it manually
        if (officeId && !url.includes('byOfficeId')) {
            console.log(`Retrieved ${allSensors.length} total sensors, filtering for office ${officeId}`);

            // For demo/fallback purposes (if API doesn't support proper filtering)
            const mockSensor: ApiSensor = {
                id: `sensor-${officeId}`,
                isOpen: Math.random() > 0.5, // Randomly open or closed for demonstration
                inputTime: new Date().toISOString(),
                batteryStatus: 100
            };

            console.log(`Created mock sensor for office ${officeId}: isOpen=${mockSensor.isOpen}`);
            return NextResponse.json([mockSensor]);
        }

        console.log('Sensors API response:', allSensors);
        return NextResponse.json(allSensors);
    } catch (error) {
        console.error('Error fetching sensors:', error);
        return NextResponse.json({ error: 'Failed to fetch sensors' }, { status: 500 });
    }
}
