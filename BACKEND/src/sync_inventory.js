const { MongoClient } = require('mongodb');
const { Client } = require('pg');

const MONGO_URI = 'mongodb://localhost:27018';
const PG_URI = 'postgresql://postgres:admin123@localhost:5433/hybrid_db';

const inventoryData = [
    // LAPTOP
    { slug: 'macbook-pro-m3', sku: 'MBP-M3-8-256-SLV', qty: 50 },
    { slug: 'macbook-pro-m3', sku: 'MBP-M3-16-512-SLV', qty: 30 },
    { slug: 'macbook-pro-m3', sku: 'MBP-M3-16-512-GRY', qty: 45 },
    { slug: 'dell-xps-15', sku: 'DXPS-16-512-BLK', qty: 40 },
    { slug: 'dell-xps-15', sku: 'DXPS-32-1TB-BLK', qty: 25 },
    { slug: 'dell-xps-15', sku: 'DXPS-32-1TB-SLV', qty: 20 },

    // ĐIỆN THOẠI
    { slug: 'iphone-15-pro', sku: 'IP15P-128-NAT', qty: 100 },
    { slug: 'iphone-15-pro', sku: 'IP15P-256-NAT', qty: 150 },
    { slug: 'iphone-15-pro', sku: 'IP15P-256-BLK', qty: 120 },
    { slug: 'samsung-s24-ultra', sku: 'SS24U-256-BLK', qty: 80 },
    { slug: 'samsung-s24-ultra', sku: 'SS24U-512-BLK', qty: 60 },
    { slug: 'samsung-s24-ultra', sku: 'SS24U-512-BLU', qty: 50 },

    // QUẦN ÁO
    { slug: 'ao-thun-nam-basic', sku: 'AT-M-BLK', qty: 300 },
    { slug: 'ao-thun-nam-basic', sku: 'AT-L-BLK', qty: 250 },
    { slug: 'ao-thun-nam-basic', sku: 'AT-L-WHT', qty: 350 },
    { slug: 'quan-jeans-ong-rong', sku: 'QJ-S-BLU', qty: 150 },
    { slug: 'quan-jeans-ong-rong', sku: 'QJ-M-BLU', qty: 200 },
    { slug: 'quan-jeans-ong-rong', sku: 'QJ-M-BLK', qty: 180 },

    // GIÀY
    { slug: 'nike-air-force-1', sku: 'AF1-39-WHT', qty: 60 },
    { slug: 'nike-air-force-1', sku: 'AF1-40-WHT', qty: 85 },
    { slug: 'nike-air-force-1', sku: 'AF1-41-WHT', qty: 70 },
    { slug: 'adidas-ultraboost-22', sku: 'UB-40-BLK', qty: 55 },
    { slug: 'adidas-ultraboost-22', sku: 'UB-41-BLK', qty: 90 },
    { slug: 'adidas-ultraboost-22', sku: 'UB-41-GRY', qty: 45 },

    // TAI NGHE
    { slug: 'airpods-pro-2', sku: 'APP2-WHT-PRO', qty: 200 },
    { slug: 'airpods-pro-2', sku: 'APP2-WHT-PRO-CC', qty: 150 },
    { slug: 'airpods-pro-2', sku: 'APP2-BLK-CUS', qty: 50 },
    { slug: 'sony-wh-1000xm5', sku: 'XM5-BLK', qty: 75 },
    { slug: 'sony-wh-1000xm5', sku: 'XM5-SLV', qty: 60 },
    { slug: 'sony-wh-1000xm5', sku: 'XM5-BLU', qty: 40 },

    // ĐỒNG HỒ
    { slug: 'apple-watch-s9', sku: 'AWS9-41-MID', qty: 110 },
    { slug: 'apple-watch-s9', sku: 'AWS9-45-MID', qty: 95 },
    { slug: 'apple-watch-s9', sku: 'AWS9-45-SLV', qty: 80 },
    { slug: 'casio-g-shock-ga2100', sku: 'GA2100-BLK', qty: 150 },
    { slug: 'casio-g-shock-ga2100', sku: 'GA2100-RED', qty: 90 },
    { slug: 'casio-g-shock-ga2100', sku: 'GA2100-BLU', qty: 100 },

    // BÀN PHÍM
    { slug: 'keychron-k2-v2', sku: 'K2-RED-RGB', qty: 120 },
    { slug: 'keychron-k2-v2', sku: 'K2-BLU-RGB', qty: 80 },
    { slug: 'keychron-k2-v2', sku: 'K2-BRN-RGB', qty: 150 },
    { slug: 'logitech-mx-keys', sku: 'MXK-BLK-US', qty: 90 },
    { slug: 'logitech-mx-keys', sku: 'MXK-SLV-US', qty: 60 },
    { slug: 'logitech-mx-keys', sku: 'MXK-BLK-UK', qty: 30 },

    // CHUỘT
    { slug: 'logitech-g-pro-x', sku: 'GPX-BLK', qty: 250 },
    { slug: 'logitech-g-pro-x', sku: 'GPX-WHT', qty: 180 },
    { slug: 'logitech-g-pro-x', sku: 'GPX-RED', qty: 50 },
    { slug: 'razer-deathadder-v3', sku: 'DAV3-BLK', qty: 140 },
    { slug: 'razer-deathadder-v3', sku: 'DAV3-WHT', qty: 110 },
    { slug: 'razer-deathadder-v3', sku: 'DAV3-FAKER', qty: 45 },

    // TIVI
    { slug: 'samsung-neo-qled-qn90c', sku: 'QN90C-55', qty: 40 },
    { slug: 'samsung-neo-qled-qn90c', sku: 'QN90C-65', qty: 25 },
    { slug: 'samsung-neo-qled-qn90c', sku: 'QN90C-75', qty: 15 },
    { slug: 'lg-oled-evo-c3', sku: 'OLED-C3-48', qty: 35 },
    { slug: 'lg-oled-evo-c3', sku: 'OLED-C3-55', qty: 50 },
    { slug: 'lg-oled-evo-c3', sku: 'OLED-C3-65', qty: 20 },

    // TÚI XÁCH & BALO
    { slug: 'tui-charles-keith', sku: 'CK-S-BLK', qty: 130 },
    { slug: 'tui-charles-keith', sku: 'CK-S-BEI', qty: 160 },
    { slug: 'tui-charles-keith', sku: 'CK-M-BLK', qty: 110 },
    { slug: 'balo-xiaomi', sku: 'MI-M-BLK', qty: 450 },
    { slug: 'balo-xiaomi', sku: 'MI-M-BLU', qty: 380 },
    { slug: 'balo-xiaomi', sku: 'MI-L-BLK', qty: 290 }
];

async function syncInventory() {
    const mongoClient = new MongoClient(MONGO_URI);
    const pgClient = new Client({ connectionString: PG_URI });

    try {
        console.log("Connecting to Dataabase...");
        await mongoClient.connect();
        await pgClient.connect();

        const db = mongoClient.db('hybrid_db');
        const productsCollection = db.collection('products');

        console.log("Query sku list...");
        const products = await productsCollection.find({}, { projection: { _id: 1, slug: 1 } }).toArray();

        const productMap = {};
        products.forEach(p => {
            productMap[p.slug] = p._id.toString();
        });

        console.log("About to inser data for PostgreSQL...");

        let successCount = 0;

        for (const item of inventoryData) {
            const productID = productMap[item.slug];

            if (!productID) {
                console.warn(`Skip: Cant find productID for slug '${item.slug}' from Mongo.`);
                continue;
            }

            const query = `
                INSERT INTO INVENTORY (productID, sku, stockQuantity) 
                VALUES ($1, $2, $3)
                ON CONFLICT (sku) DO UPDATE 
                SET stockQuantity = EXCLUDED.stockQuantity, 
                    productID = EXCLUDED.productID
            `;
            const values = [productID, item.sku, item.qty];

            await pgClient.query(query, values);
            successCount++;
        }

        console.log(`Finished! Successful syncronize ${successCount}/${inventoryData.length} records from INVENTORY.`);

    } catch (error) {
        console.error("Error when syncronize:", error);
    } finally {
        await mongoClient.close();
        await pgClient.end();
        console.log("Database closed.");
    }
}
syncInventory();