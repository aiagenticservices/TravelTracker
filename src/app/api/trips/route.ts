import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const trips = await prisma.trip.findMany({
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json(trips);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { fullName, destination, startDate, endDate, budget } = body;

  if (!fullName || !destination || !startDate || !endDate || budget == null) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const trip = await prisma.trip.create({
    data: {
      fullName,
      destination,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      budget: Number(budget)
    }
  });

  return NextResponse.json(trip, { status: 201 });
}
