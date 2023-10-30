import { NextRequest, NextResponse } from 'next/server';

export type Error = {
  error: string;
};

export async function GET(
  request: NextRequest,
  { params }: { params: Record<string, string | string[]> },
): Promise<NextResponse<Error>> {
  return NextResponse.json(
    {
      error: `not implemented`,
    },
    { status: 404 },
  );
}
