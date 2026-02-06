import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: any) {
  const trip = await prisma.trip.findUnique({
    where: { id: Number(params.id) }
  });
  return NextResponse.json(trip);
}

export async function DELETE(_req: Request, { params }: any) {
  await prisma.trip.delete({
    where: { id: Number(params.id) }
  });
  return NextResponse.json({ success: true });
}
