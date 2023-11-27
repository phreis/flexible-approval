import { NextResponse } from 'next/server';

export type Error = {
  error: string;
};

export async function GET(): Promise<NextResponse<Error>> {
  return await NextResponse.json(
    {
      error: `not implemented`,
    },
    { status: 404 },
  );
}
