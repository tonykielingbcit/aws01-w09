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
    const profile = await pool.query("SELECT * FROM profiles WHERE cognitoid = $1", [id]);
    return profile.rows[0];
};


// export const addItem = async(item) => {
//     const result = await pool.query('INSERT INTO items (item) VALUES (?)', [item]);
//     const [rows] = await pool.query('SELECT * FROM items WHERE id = ?', [result[0].insertId]);
//     const itemAdded = rows[0];
//     return itemAdded;
// };


export async function updateProfile(id, city, bio) {
    const updatedProfile = await pool.query(
        `UPDATE profiles SET city = $1, bio = $2 WHERE cognitoid = $3;`,
        [city, bio, id]
    );
console.log("updateProfile=====================XXXXXXXXXXX=================== ", updatedProfile);
    return updatedProfile;
}
