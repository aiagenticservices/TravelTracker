import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { destination, startDate, endDate, budget } = await req.json();

  // Placeholder for real live data integrations (Yelp, Booking, etc.)
  const mockData = {
    destination,
    budget,
    hotels: [
      { name: "Central City Hotel", avgPricePerNight: 150 },
      { name: "Budget Stay Inn", avgPricePerNight: 90 }
    ],
    restaurants: [
      { name: "Local Bistro", avgPricePerMeal: 30 },
      { name: "Street Food Corner", avgPricePerMeal: 15 }
    ],
    activities: [
      { name: "City Walking Tour", avgPricePerPerson: 40 },
      { name: "Museum Pass", avgPricePerPerson: 25 },
      { name: "Boat Ride", avgPricePerPerson: 60 }
    ],
    startDate,
    endDate
  };

  const topThings = [
    ...mockData.activities,
    ...mockData.hotels,
    ...mockData.restaurants
  ].slice(0, 5);

  return NextResponse.json({
    ...mockData,
    topThings
  });
}
