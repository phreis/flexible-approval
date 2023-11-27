import { NextRequest, NextResponse } from 'next/server';

export type Error = {
  error: string;
};

export async function GET(): Promise<NextResponse<Error>> {
  return NextResponse.json(
    {
      error: `not implemented`,
    },
    { status: 404 },
  );
}
