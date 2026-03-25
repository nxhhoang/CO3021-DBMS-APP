INSERT INTO USERS (userID, email, password, fullName, phoneNum, role)
VALUES (
    'admin-uuid-001', 
    'admin@ecommerce.com', 
    '90d985f6b4155b2a5d7390fc25a8fd12bed2d8bc822b4025b961596c59ca9130',
    /** password trong db được lưu ở dạng hash: password + PASSWORD_SECRET dựa theo README của Đức */ 
    'System Admin', 
    '0909123456', 
    'ADMIN'
),
/** password hiện tại giống nhau để dễ thao tác */
('user-uuid-001','user1@ecommerce.com','90d985f6b4155b2a5d7390fc25a8fd12bed2d8bc822b4025b961596c59ca9130','Nguyen Van A','0912345678','CUSTOMER'),
('user-uuid-002','user2@ecommerce.com','90d985f6b4155b2a5d7390fc25a8fd12bed2d8bc822b4025b961596c59ca9130','Tran Thi B','0987654321','CUSTOMER'),
('user-uuid-003','user3@ecommerce.com','90d985f6b4155b2a5d7390fc25a8fd12bed2d8bc822b4025b961596c59ca9130','Le Van C','0909988776','CUSTOMER');

INSERT INTO ADDRESSES (userID, addressLine, addressName, city, district, isDefault)
VALUES
    ('user-uuid-001', '123 Ly Thuong Kiet', 'Home', 'HCM', 'District 10', TRUE),
    ('user-uuid-001', 'So 1, Dai Co Viet', 'Obama''s White House', 'Ha Noi', 'Hai Ba Trung', FALSE),

    ('user-uuid-002', '364 Cong Hoa', 'Cong ty', 'HCM', 'Tan Binh', TRUE),
    ('user-uuid-002', '12 Phan Dinh Phung', 'Nha ba me', 'Ha Noi', 'Ba Dinh', FALSE),

    ('user-uuid-003', '99 Le Loi', 'Nha', 'HCM', 'District 1', TRUE),
    ('user-uuid-003', '45 Nguyen Van Cu', 'Truong hoc', 'HCM', 'District 5', FALSE);