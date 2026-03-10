import { http, HttpResponse } from 'msw';
import {
  CreateAddressRequest,
  UpdateAddressesRequest,
} from '@/types/address.types';
import { BASE_URL } from '@/constants/api';
import { MOCK_ADDRESSES } from '../data/addresses';

export const addressHandlers = [
  // 1. GET /users/addresses - Lấy danh sách địa chỉ
  http.get(`${BASE_URL}/users/addresses`, () => {
    return HttpResponse.json({
      message: 'Lấy danh sách địa chỉ thành công',
      data: MOCK_ADDRESSES,
    });
  }),

  // 2. POST /users/addresses - Thêm mới địa chỉ
  http.post(`${BASE_URL}/users/addresses`, async ({ request }) => {
    // QUAN TRỌNG: Phải có async/await ở đây
    const body = (await request.json()) as CreateAddressRequest;
    const { addressName, addressLine, city, district, isDefault } = body;

    const newAddress = {
      addressID: Math.floor(Math.random() * 1000) + 3,
      addressName,
      addressLine,
      city,
      district,
      isDefault: MOCK_ADDRESSES.length === 0 ? true : isDefault,
    };
    // Giả lập thêm địa chỉ mới
    MOCK_ADDRESSES.push(newAddress);

    return HttpResponse.json(
      {
        message: 'Thêm địa chỉ thành công',
        data: newAddress,
      },
      { status: 201 },
    );
  }),

  // 3. PUT /users/addresses/:addressID - Cập nhật địa chỉ
  http.put<{ addressID: string }>(
    `${BASE_URL}/users/addresses/:addressID`,
    async ({ request, params }) => {
      const { addressID } = params;
      const body = (await request.json()) as CreateAddressRequest;
      const { addressName, addressLine, city, district, isDefault } = body;

      // 1. Tìm vị trí của địa chỉ trong mảng giả lập
      const addressIndex = MOCK_ADDRESSES.findIndex(
        (addr) => addr.addressID === Number(addressID),
      );

      // 2. Nếu không tìm thấy, trả về lỗi 404
      if (addressIndex === -1) {
        return HttpResponse.json(
          { message: 'Không tìm thấy địa chỉ để cập nhật' },
          { status: 404 },
        );
      }

      // 3. Logic xử lý isDefault:
      // Nếu bản ghi này được sửa thành mặc định (true),
      // thì tất cả các bản ghi khác phải thành false.
      if (isDefault) {
        MOCK_ADDRESSES.forEach((addr) => {
          addr.isDefault = false;
        });
      }

      // 4. Cập nhật dữ liệu mới vào mảng
      const updatedAddress = {
        ...MOCK_ADDRESSES[addressIndex], // Giữ lại các field cũ nếu có (vd: createdAt)
        addressName,
        addressLine,
        city,
        district,
        isDefault,
      };

      MOCK_ADDRESSES[addressIndex] = updatedAddress;

      return HttpResponse.json({
        message: 'Cập nhật địa chỉ thành công',
        data: updatedAddress,
      });
    },
  ),
  // 4. DELETE /users/addresses/:addressID - Xóa địa chỉ
  http.delete(`${BASE_URL}/users/addresses/:addressID`, ({ params }) => {
    const { addressID } = params;

    // Giả lập xóa địa chỉ
    const addressIndex = MOCK_ADDRESSES.findIndex(
      (addr) => addr.addressID === Number(addressID),
    );

    if (addressIndex === -1) {
      return HttpResponse.json(
        { message: 'Không tìm thấy địa chỉ để xóa' },
        { status: 404 },
      );
    }

    MOCK_ADDRESSES.splice(addressIndex, 1);
    return HttpResponse.json({
      message: `Đã xóa địa chỉ có ID ${addressID}`,
    });
  }),

  // 5. PATCH /users/addresses/:addressID/set-default - Thiết lập địa chỉ mặc định
  http.patch(
    `${BASE_URL}/users/addresses/:addressID/set-default`,
    ({ params }) => {
      const { addressID } = params;

      // Giả lập thiết lập địa chỉ mặc định
      const addressIndex = MOCK_ADDRESSES.findIndex(
        (addr) => addr.addressID === Number(addressID),
      );

      if (addressIndex === -1) {
        return HttpResponse.json(
          { message: 'Không tìm thấy địa chỉ để thiết lập mặc định' },
          { status: 404 },
        );
      }

      // Logic xử lý isDefault:
      // Khi thiết lập một địa chỉ thành mặc định (true),
      // thì tất cả các địa chỉ khác phải thành false.
      MOCK_ADDRESSES.forEach((addr, index) => {
        addr.isDefault = index === addressIndex;
      });
      return HttpResponse.json({
        message: `Đã thiết lập địa chỉ có ID ${addressID} làm mặc định`,
      });
    },
  ),
];

// Example for GET /users/addresses using fetch API:
// fetch('http://localhost:3000/api/v1/users/addresses', {
//   method: 'GET',
//   headers: {
//     'Content-Type': 'application/json',
//     Authorization: 'Bearer access-token-admin',
//   },
// })
//   .then((response) => response.json())
//   .then((data) => console.log(data))
//   .catch((error) => console.error('Error:', error));

// Example for POST /users/addresses using fetch API:
// fetch('http://localhost:3000/api/v1/users/addresses', {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//     Authorization: 'Bearer access-token-admin',
//   },
//   body: JSON.stringify({
//     addressLine: '123 Ly Thuong Kiet',
//     city: 'HCM',
//     district: 'District 10',
//     isDefault: true,
//   }),
// })
//   .then((response) => response.json())
//   .then((data) => console.log(data))
//   .catch((error) => console.error('Error:', error));

// Example for PUT /users/addresses/:addressID using fetch API:
// fetch('http://localhost:3000/api/v1/users/addresses/1', {
//   method: 'PUT',
//   headers: {
//     'Content-Type': 'application/json',
//     Authorization: 'Bearer access-token-admin',
//   },
//   body: JSON.stringify({
//     addressLine: 'So 1, Dai Co Viet',
//     city: 'Ha Noi',
//     district: 'Hai Ba Trung',
//     isDefault: false,
//   }),
// })
//   .then((response) => response.json())
//   .then((data) => console.log(data))
//   .catch((error) => console.error('Error:', error));

// Example for PUT /users/addresses/:addressID using fetch API::
// fetch('http://localhost:3000/api/v1/users/addresses/1', {
//   method: 'PUT',
//   headers: {
//     'Content-Type': 'application/json',
//     Authorization: 'Bearer access-token-admin',
//   },
//   body: JSON.stringify({
//     addressLine: 'So 1, Dai Co Viet',
//     city: 'Ha Noi',
//     district: 'Hai Ba Trung',
//     isDefault: false,
//   }),
// })
//   .then((response) => response.json())
//   .then((data) => console.log(data))
//   .catch((error) => console.error('Error:', error));

// Example for DELETE /users/addresses/:addressID using fetch API:
// fetch('http://localhost:3000/api/v1/users/addresses/1', {
//   method: 'DELETE',
//   headers: {
//     Authorization: 'Bearer access-token-admin',
//   },
// })
//   .then((response) => response.json())
//   .then((data) => console.log(data))
//   .catch((error) => console.error('Error:', error));

// Example for PATCH /users/addresses/:addressID/set-default using fetch API:
// fetch('http://localhost:3000/api/v1/users/addresses/1/set-default', {
//   method: 'PATCH',
//   headers: {
//     Authorization: 'Bearer access-token-admin',
//   },
// })
//   .then((response) => response.json())
//   .then((data) => console.log(data))
//   .catch((error) => console.error('Error:', error));
