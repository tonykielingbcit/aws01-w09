import pg from 'pg';
const { Pool } = pg;

let pool;

if (!pool) {
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


export const insertProfile = async(cognitoId, city, bio) => {
    const result = await pool.query(
        'INSERT INTO profiles (cognitoid, city, bio) VALUES ($1, $2, $3)', 
        [cognitoId, city, bio]);

    return result;
};


export async function updateProfile(id, city, bio) {
    const updatedProfile = await pool.query(
        `UPDATE profiles SET city = $1, bio = $2 WHERE cognitoid = $3;`,
        [city, bio, id]
    );

    return updatedProfile;
}
