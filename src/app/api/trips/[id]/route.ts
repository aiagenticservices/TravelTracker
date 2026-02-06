import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: { id: string } };

export async function GET(_req: Request, { params }: Params) {
  const trip = await prisma.trip.findUnique({
    where: { id: Number(params.id) }
  });
  if (!trip) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(trip);
}

export async function DELETE(_req: Request, { params }: Params) {
  await prisma.trip.delete({
    where: { id: Number(params.id) }
  });
  return NextResponse.json({ success: true });
}
