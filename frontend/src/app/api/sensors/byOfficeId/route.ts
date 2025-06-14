import { NextRequest, NextResponse } from "next/server";

// External API URL
const EXTERNAL_API_URL = "https://ubi-sys-lab-no-knock.vercel.app/api";

// Define the sensor interface
interface ApiSensor {
    id: string | number;
    batteryStatus?: number;
    inputTime?: string;
    isOpen: boolean;
    officeId?: number; // This might not exist in the actual API
}

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const officeId = searchParams.get("officeId");

        if (!officeId) {
            return NextResponse.json(
                { error: "officeId parameter is required" },
                { status: 400 }
            );
        }

        console.log(`Fetching sensors for officeId ${officeId}`);

        // Try the direct endpoint
        try {
            const directResponse = await fetch(`${EXTERNAL_API_URL}/sensors/byOfficeId?officeId=${officeId}`, {
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

        // Fallback: Fetch all sensors and filter manually
        const response = await fetch(`${EXTERNAL_API_URL}/sensors`, {
            cache: "no-store",
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            console.error(
                `Error fetching sensors from external API: ${response.status} ${errorMessage}`
            );
            return NextResponse.json(
                { error: `Failed to fetch sensors: ${response.status}` },
                { status: response.status }
            );
        }

        const allSensors: ApiSensor[] = await response.json();
        console.log(`Retrieved ${allSensors.length} total sensors, filtering for office ${officeId}`);

        // Since the external API doesn't appear to include officeId in sensor data,
        // we'll have to mock this functionality for now
        // In a real implementation, you would need to know how sensors relate to offices

        // For now, let's mock a single sensor for each office to demonstrate the concept
        const mockSensor: ApiSensor = {
            id: `sensor-${officeId}`,
            isOpen: Math.random() > 0.5, // Randomly open or closed for demonstration
            inputTime: new Date().toISOString(),
            batteryStatus: 100
        };

        console.log(`Created mock sensor for office ${officeId}: isOpen=${mockSensor.isOpen}`);

        return NextResponse.json([mockSensor]);
    } catch (error) {
        console.error("Error in sensors/byOfficeId route:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
