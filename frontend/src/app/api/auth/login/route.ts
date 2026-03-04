// import { NextResponse } from 'next/server';

// export async function POST(req: Request) {
//   const body = await req.json();

//   const { email, password } = body;

//   if (email === 'user@example.com' && password === '123456') {
//     return NextResponse.json({
//       message: 'Đăng nhập thành công',
//       data: {
//         accessToken: 'fake-access-token-123',
//         refreshToken: 'fake-refresh-token-abc',
//         user: {
//           userId: 'uuid-123',
//           role: 'CUSTOMER',
//         },
//       },
//     });
//   }

//   return NextResponse.json(
//     { message: 'Sai email hoặc mật khẩu' },
//     { status: 401 },
//   );
// }
