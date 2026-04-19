# import os
# import random

# OUTPUT_FILE = './postgres/scripts/05_insert_data.sql'
# TABLE_USERS = 'USERS'
# TABLE_ADDRESSES = 'ADDRESSES'

# TOTAL_RECORDS = 100000
# BATCH_SIZE = 1000 

# ADDRESS_POOL = [
#     ("123 Ly Thuong Kiet", "Home", "HCM", "District 10"),
#     ("So 1, Dai Co Viet", "Obama''s White House", "Ha Noi", "Hai Ba Trung"),
#     ("364 Cong Hoa", "Cong ty", "HCM", "Tan Binh"),
#     ("12 Phan Dinh Phung", "Nha ba me", "Ha Noi", "Ba Dinh"),
#     ("99 Le Loi", "Nha", "HCM", "District 1"),
#     ("45 Nguyen Van Cu", "Truong hoc", "HCM", "District 5"),
#     ("234 Nguyen Hue", "Apartment", "HCM", "District 1"),
#     ("89 Tran Phu", "Home", "Da Nang", "Hai Chau"),
#     ("56 Le Duan", "Workplace", "Da Nang", "Thanh Khe"),
#     ("102 Thai Ha", "Home", "Ha Noi", "Dong Da"),
#     ("8 Vo Van Ngan", "Dormitory", "HCM", "Thu Duc"),
#     ("77 Nguyen Thi Minh Khai", "Studio", "HCM", "District 3"),
#     ("200 Dien Bien Phu", "Company", "HCM", "Binh Thanh"),
#     ("15 Le Van Sy", "Home", "HCM", "Phu Nhuan"),
#     ("33 Xuan Thuy", "Home", "Ha Noi", "Cau Giay"),
#     ("68 Tran Duy Hung", "Office", "Ha Noi", "Cau Giay"),
#     ("19 Nguyen Trai", "Home", "Ha Noi", "Thanh Xuan"),
#     ("55 Le Dai Hanh", "Home", "Ha Noi", "Hai Ba Trung"),
#     ("92 Quang Trung", "Shop", "HCM", "Go Vap"),
#     ("112 Kinh Duong Vuong", "Home", "HCM", "Binh Tan")
# ]

# def number_to_chars(num):
#     mapping = 'abcdefghij'
#     num_str = str(num)
#     result = ''.join(mapping[int(digit)] for digit in num_str)
#     return result.capitalize()

# print(f"About {TOTAL_RECORDS} lines of user data và {TOTAL_RECORDS * 2} lines of address data")

# with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
#     f.write("-- Creat data using py py mo ny\n\n")
    
#     f.write(f"INSERT INTO {TABLE_USERS} (userID, email, password, fullName, phoneNum, role) VALUES\n")
#     f.write(f"(\n")
#     f.write(f"    'admin-uuid-001',\n")
#     f.write(f"    'admin@ecommerce.com',\n")
#     f.write(f"    '90d985f6b4155b2a5d7390fc25a8fd12bed2d8bc822b4025b961596c59ca9130',\n")
#     f.write(f"    /* password trong db được lưu ở dạng hash: password + PASSWORD_SECRET dựa theo README của Đức */\n")
#     f.write(f"    'System Admin',\n")
#     f.write(f"    '0909123456',\n")
#     f.write(f"    'ADMIN'\n")
#     f.write(f");\n\n")
    
#     f.write("/* password hiện tại giống nhau để dễ thao tác */\n\n")
    
#     for i in range(0, TOTAL_RECORDS, BATCH_SIZE):
#         users_values = []
#         addresses_values = []
        
#         for j in range(BATCH_SIZE):
#             current_num = i + j + 1
            
#             user_id = f"user-uuid-{current_num:06d}" 
#             email = f"user{current_num}@ecommerce.com"
#             password = "90d985f6b4155b2a5d7390fc25a8fd12bed2d8bc822b4025b961596c59ca9130"
#             full_name = f"Nguyen Van {number_to_chars(current_num)}"
#             phone_num = "0123456789"
#             role = "CUSTOMER"
            
#             users_values.append(f"('{user_id}', '{email}', '{password}', '{full_name}', '{phone_num}', '{role}')")
            
#             addr1, addr2 = random.sample(ADDRESS_POOL, 2)
            
#             addresses_values.append(
#                 f"('{user_id}', '{addr1[0]}', '{addr1[1]}', '{addr1[2]}', '{addr1[3]}', TRUE)"
#             )
#             addresses_values.append(
#                 f"('{user_id}', '{addr2[0]}', '{addr2[1]}', '{addr2[2]}', '{addr2[3]}', FALSE)"
#             )
        
#         f.write(f"INSERT INTO {TABLE_USERS} (userID, email, password, fullName, phoneNum, role) VALUES\n")
#         f.write(",\n".join(users_values) + ";\n\n")
        
#         f.write(f"INSERT INTO {TABLE_ADDRESSES} (userID, addressLine, addressName, city, district, isDefault) VALUES\n")
#         f.write(",\n".join(addresses_values) + ";\n\n")

# print(f"Finish creating script to insert data in {OUTPUT_FILE}")
import os
import random
import csv

OUTPUT_DIR = './postgres/scripts'
USERS_CSV = os.path.join(OUTPUT_DIR, 'users.csv')
ADDRESSES_CSV = os.path.join(OUTPUT_DIR, 'addresses.csv')

TOTAL_RECORDS = 100000

ADDRESS_POOL = [
    ("123 Ly Thuong Kiet", "Home", "HCM", "District 10"),
    ("So 1, Dai Co Viet", "Obama''s White House", "Ha Noi", "Hai Ba Trung"),
    ("364 Cong Hoa", "Cong ty", "HCM", "Tan Binh"),
    ("12 Phan Dinh Phung", "Nha ba me", "Ha Noi", "Ba Dinh"),
    ("99 Le Loi", "Nha", "HCM", "District 1"),
    ("45 Nguyen Van Cu", "Truong hoc", "HCM", "District 5"),
    ("234 Nguyen Hue", "Apartment", "HCM", "District 1"),
    ("89 Tran Phu", "Home", "Da Nang", "Hai Chau"),
    ("56 Le Duan", "Workplace", "Da Nang", "Thanh Khe"),
    ("102 Thai Ha", "Home", "Ha Noi", "Dong Da"),
    ("8 Vo Van Ngan", "Dormitory", "HCM", "Thu Duc"),
    ("77 Nguyen Thi Minh Khai", "Studio", "HCM", "District 3"),
    ("200 Dien Bien Phu", "Company", "HCM", "Binh Thanh"),
    ("15 Le Van Sy", "Home", "HCM", "Phu Nhuan"),
    ("33 Xuan Thuy", "Home", "Ha Noi", "Cau Giay"),
    ("68 Tran Duy Hung", "Office", "Ha Noi", "Cau Giay"),
    ("19 Nguyen Trai", "Home", "Ha Noi", "Thanh Xuan"),
    ("55 Le Dai Hanh", "Home", "Ha Noi", "Hai Ba Trung"),
    ("92 Quang Trung", "Shop", "HCM", "Go Vap"),
    ("112 Kinh Duong Vuong", "Home", "HCM", "Binh Tan")
]

def number_to_chars(num):
    mapping = 'abcdefghij'
    num_str = str(num)
    return ''.join(mapping[int(digit)] for digit in num_str).capitalize()

print(f"Bắt đầu tạo {TOTAL_RECORDS} Users và {TOTAL_RECORDS * 2} Addresses ra file CSV...")

with open(USERS_CSV, 'w', newline='', encoding='utf-8') as f_users, \
     open(ADDRESSES_CSV, 'w', newline='', encoding='utf-8') as f_addresses:
    
    writer_users = csv.writer(f_users)
    writer_addresses = csv.writer(f_addresses)
    
    writer_users.writerow([
        'admin-uuid-001', 'admin@ecommerce.com', 
        '90d985f6b4155b2a5d7390fc25a8fd12bed2d8bc822b4025b961596c59ca9130', 
        'System Admin', '0909123456', 'ADMIN'
    ])
    
    for i in range(TOTAL_RECORDS):
        current_num = i + 1
        user_id = f"user-uuid-{current_num:06d}" 
        
        writer_users.writerow([
            user_id,
            f"user{current_num}@ecommerce.com",
            "90d985f6b4155b2a5d7390fc25a8fd12bed2d8bc822b4025b961596c59ca9130",
            f"Nguyen Van {number_to_chars(current_num)}",
            "0123456789",
            "CUSTOMER"
        ])
        
        addr1, addr2 = random.sample(ADDRESS_POOL, 2)
        writer_addresses.writerow([user_id, addr1[0], addr1[1], addr1[2], addr1[3], True])
        writer_addresses.writerow([user_id, addr2[0], addr2[1], addr2[2], addr2[3], False])

print("✅ Đã tạo xong file users.csv và addresses.csv!")