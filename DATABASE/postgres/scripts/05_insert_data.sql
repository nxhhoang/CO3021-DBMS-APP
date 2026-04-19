-- Dùng lệnh COPY để nạp trực tiếp file CSV vào Database
-- Lưu ý: Đường dẫn ở đây là đường dẫn bên trong container của Docker

COPY USERS (userID, email, password, fullName, phoneNum, role) 
FROM '/docker-entrypoint-initdb.d/users.csv' 
DELIMITER ',' 
CSV;

COPY ADDRESSES (userID, addressLine, addressName, city, district, isDefault) 
FROM '/docker-entrypoint-initdb.d/addresses.csv' 
DELIMITER ',' 
CSV;