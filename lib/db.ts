// // src/lib/db.ts
// import mysql from 'mysql2/promise';

// export const dbPool = mysql.createPool({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0,
// });

// src/lib/db.ts
import mysql from 'mysql2/promise';

export const dbPool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306, // 👈 ক্লাউড পোর্ট হ্যান্ডেল করার জন্য
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: {
        rejectUnauthorized: false // 👈 Aiven ক্লাউড কানেকশনের SSL এরর বাইপাস করার জন্য
    }
});