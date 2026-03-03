import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({
    message: 'Cấp lại token thành công',
    data: {
      accessToken: 'new-access-token-xyz',
      refreshToken: 'new-refresh-token-abc',
    },
  });
}
