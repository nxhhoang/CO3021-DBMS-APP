// Add handler base on the follwing API description:
/*### 2. Users & Profile

#### Profile

**Auth: Required**

| Endpoint                                | Method | Auth Required | Role Required | Status |
| --------------------------------------- | ------ | ------------- | ------------- | ------ |
| /users/profile                          | GET    | Yes           | N/A           | [ ]    |
| /users/profile                          | PUT    | Yes           | N/A           | [ ]    |
| /users/addresses                        | GET    | Yes           | N/A           | [ ]    |
| /users/addresses                        | POST   | Yes           | N/A           | [ ]    |
| /users/addresses/:addressID             | PUT    | Yes           | N/A           | [ ]    |
| /users/addresses/:addressID             | DELETE | Yes           | N/A           | [ ]    |
| /users/addresses/:addressID/set-default | PATCH  | Yes           | N/A           | [ ]    |
*/
import { http } from 'msw';
import { BASE_URL } from '@/constants/api';
import { MOCK_USERS } from '../data/users';

type User = {
  userId: string;
  email: string;
  role: 'customer' | 'admin';
};

export const userHandlers = [
  // 1. (GET /users/profile)
  http.get(`${BASE_URL}/users/profile`, async ({ request }) => {
    // Giả sử chúng ta lấy userId từ accessToken (ở đây là mock nên sẽ cố định)
    const userId = 'uuid-gen-123456789'; // Thay bằng logic lấy từ token nếu cần

    const user = MOCK_USERS.find((u) => u.userId === userId);

    if (!user) {
      return new Response(
        JSON.stringify({ message: 'User không tồn tại', data: null }),
        { status: 404, headers: { 'Content-Type': 'application/json' } },
      );
    }

    return new Response(
      JSON.stringify({
        message: 'Lấy thông tin profile thành công',
        data: {
          userId: user.userId,
          email: user.email,
          role: user.role,
        },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  }),

  // 2. (PUT /users/profile)
  http.put(`${BASE_URL}/users/profile`, async ({ request }) => {
    // Giả sử chúng ta lấy userId từ accessToken (ở đây là mock nên sẽ cố định)
    const userId = 'uuid-gen-123456789'; // Thay bằng logic lấy từ token nếu cần

    const userIndex = MOCK_USERS.findIndex((u) => u.userId === userId);

    if (userIndex === -1) {
      return new Response(
        JSON.stringify({ message: 'User không tồn tại', data: null }),
        { status: 404, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const body = (await request.json()) as Partial<
      Pick<User, 'email' | 'role'>
    >;
    const { email, role } = body;

    // Cập nhật thông tin user trong mock data
    MOCK_USERS[userIndex] = {
      ...MOCK_USERS[userIndex],
      email: email || MOCK_USERS[userIndex].email,
      role: role || MOCK_USERS[userIndex].role,
    };

    return new Response(
      JSON.stringify({
        message: 'Cập nhật thông tin profile thành công',
        data: {
          userId: MOCK_USERS[userIndex].userId,
          email: MOCK_USERS[userIndex].email,
          role: MOCK_USERS[userIndex].role,
        },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  }),

  //3. (GET /users/addresses)
  http.get(`${BASE_URL}/users/addresses`, async ({ request }) => {
    // Giả sử chúng ta lấy userId từ accessToken (ở đây là mock nên sẽ cố định)
    const userId = 'uuid-gen-123456789'; // Thay bằng logic lấy từ token nếu cần

    // Lấy thông tin user từ mock data
    const user = MOCK_USERS.find((u) => u.userId === userId);

    if (!user) {
      return new Response(
        JSON.stringify({ message: 'User không tồn tại', data: null }),
        { status: 404, headers: { 'Content-Type': 'application/json' } },
      );
    }

    // Trả về danh sách địa chỉ của user
    return new Response(
      JSON.stringify({
        message: 'Lấy danh sách địa chỉ thành công',
        data: user.addresses || [],
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  }),
  //4. (POST /users/addresses)
  http.post(`${BASE_URL}/users/addresses`, async ({ request }) => {
    // Giả sử chúng ta lấy userId từ accessToken (ở đây là mock nên sẽ cố định)
    const userId = 'uuid-gen-123456789'; // Thay bằng logic lấy từ token nếu cần

    const userIndex = MOCK_USERS.findIndex((u) => u.userId === userId);

    if (userIndex === -1) {
      return new Response(
        JSON.stringify({ message: 'User không tồn tại', data: null }),
        { status: 404, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const body = (await request.json()) as {
      addressLine: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };

    const newAddress = {
      addressId: `addr-${Date.now()}`, // Tạo ID địa chỉ mới
      ...body,
    };

    // Thêm địa chỉ mới vào mock data
    if (!MOCK_USERS[userIndex].addresses) {
      MOCK_USERS[userIndex].addresses = [];
    }
    MOCK_USERS[userIndex].addresses!.push(newAddress);

    return new Response(
      JSON.stringify({
        message: 'Thêm địa chỉ mới thành công',
        data: newAddress,
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } },
    );
  }),
  //5. (PUT /users/addresses/:addressID)
  http.put(
    `${BASE_URL}/users/addresses/:addressID`,
    async ({ request, params }) => {
      // Giả sử chúng ta lấy userId từ accessToken (ở đây là mock nên sẽ cố định)
      const userId = 'uuid-gen-123456789'; // Thay bằng logic lấy từ token nếu cần
      const { addressID } = params;

      const userIndex = MOCK_USERS.findIndex((u) => u.userId === userId);

      if (userIndex === -1) {
        return new Response(
          JSON.stringify({ message: 'User không tồn tại', data: null }),
          { status: 404, headers: { 'Content-Type': 'application/json' } },
        );
      }

      const addressIndex = MOCK_USERS[userIndex].addresses?.findIndex(
        (a) => a.addressId === addressID,
      );

      if (addressIndex === undefined || addressIndex === -1) {
        return new Response(
          JSON.stringify({ message: 'Địa chỉ không tồn tại', data: null }),
          { status: 404, headers: { 'Content-Type': 'application/json' } },
        );
      }

      const body = (await request.json()) as {
        addressLine?: string;
        city?: string;
        state?: string;
        postalCode?: string;
        country?: string;
      };

      // Cập nhật thông tin địa chỉ trong mock data
      MOCK_USERS[userIndex].addresses![addressIndex] = {
        ...MOCK_USERS[userIndex].addresses![addressIndex],
        ...body,
      };

      return new Response(
        JSON.stringify({
          message: 'Cập nhật địa chỉ thành công',
          data: MOCK_USERS[userIndex].addresses![addressIndex],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      );
    },
  ),
  //6. (DELETE /users/addresses/:addressID)
  http.delete(
    `${BASE_URL}/users/addresses/:addressID`,
    async ({ request, params }) => {
      // Giả sử chúng ta lấy userId từ accessToken (ở đây là mock nên sẽ cố định)
      const userId = 'uuid-gen-123456789'; // Thay bằng logic lấy từ token nếu cần
      const { addressID } = params;

      const userIndex = MOCK_USERS.findIndex((u) => u.userId === userId);

      if (userIndex === -1) {
        return new Response(
          JSON.stringify({ message: 'User không tồn tại', data: null }),
          { status: 404, headers: { 'Content-Type': 'application/json' } },
        );
      }

      const addressIndex = MOCK_USERS[userIndex].addresses?.findIndex(
        (a) => a.addressId === addressID,
      );

      if (addressIndex === undefined || addressIndex === -1) {
        return new Response(
          JSON.stringify({ message: 'Địa chỉ không tồn tại', data: null }),
          { status: 404, headers: { 'Content-Type': 'application/json' } },
        );
      }

      // Xóa địa chỉ khỏi mock data
      MOCK_USERS[userIndex].addresses!.splice(addressIndex, 1);

      return new Response(
        JSON.stringify({
          message: 'Xóa địa chỉ thành công',
          data: null,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      );
    },
  ),
  //7. (PATCH /users/addresses/:addressID/set-default)
  http.patch(
    `${BASE_URL}/users/addresses/:addressID/set-default`,
    async ({ request, params }) => {
      // Giả sử chúng ta lấy userId từ accessToken (ở đây là mock nên sẽ cố định)
      const userId = 'uuid-gen-123456789'; // Thay bằng logic lấy từ token nếu cần
      const { addressID } = params;

      const userIndex = MOCK_USERS.findIndex((u) => u.userId === userId);

      if (userIndex === -1) {
        return new Response(
          JSON.stringify({ message: 'User không tồn tại', data: null }),
          { status: 404, headers: { 'Content-Type': 'application/json' } },
        );
      }

      const addressIndex = MOCK_USERS[userIndex].addresses?.findIndex(
        (a) => a.addressId === addressID,
      );

      if (addressIndex === undefined || addressIndex === -1) {
        return new Response(
          JSON.stringify({ message: 'Địa chỉ không tồn tại', data: null }),
          { status: 404, headers: { 'Content-Type': 'application/json' } },
        );
      }

      // Đặt tất cả địa chỉ khác là không mặc định
      MOCK_USERS[userIndex].addresses = MOCK_USERS[userIndex].addresses!.map(
        (a, index) => ({
          ...a,
          isDefault: index === addressIndex,
        }),
      );

      return new Response(
        JSON.stringify({
          message: 'Đặt địa chỉ mặc định thành công',
          data: MOCK_USERS[userIndex].addresses![addressIndex],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      );
    },
  ),
];
