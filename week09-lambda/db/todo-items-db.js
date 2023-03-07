import pg from 'pg';
const { Pool } = pg;

let pool;

if (!pool) {
    console.log("CREATING A BRAND NEW POOL CONNECTION!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
    const connectionString = process.env.DATABASE_URL;
    pool = new Pool({
        connectionString,
        application_name: "",
        max: 1,
    });
}


export const getAllProfiles = async () => {
  const res = await pool.query(`
      SELECT * FROM profiles
  `);
  return res.rows
}


export const getProfileById = async(id) => {
// console.log("GOT ig:::::::::: ", id);
    const profile = await pool.query("SELECT * FROM profiles WHERE cognitoid = $1", [id]);
// console.log("---------profile::::: ", profile);
    return profile.rows[0];
};


// export const addItem = async(item) => {
//     const result = await pool.query('INSERT INTO items (item) VALUES (?)', [item]);
//     const [rows] = await pool.query('SELECT * FROM items WHERE id = ?', [result[0].insertId]);
//     const itemAdded = rows[0];
//     return itemAdded;
// };


// export async function updateItem(id, newItemName) {
//     const [result] = await pool.query(
//         `UPDATE items SET item = ? WHERE id = ?`,
//         [newItemName, id]
//     );
//     const [rows] = await pool.query('SELECT * FROM items WHERE id = ?', id);
//     return rows[0];
// }


// export async function removeItem(id) {
//     let query = `
//         DELETE FROM items WHERE id = ?
//     `;

//     await pool.query("SET SQL_SAFE_UPDATES = 0");
//     const [result] = await pool.query(query, [id]);

//     return result.affectedRows;
// }