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


export const getAllTodos = async (profileId) => {
  const res = await pool.query(
      "SELECT * FROM todos WHERE profileid = $1", [profileId]
  );
// console.log("todos1111111111111111111:::::::::::::::::::::::::::::::::::::::", res)
  return res.rows
}

/*

export const getTodoById = async(todoId) => {
    const profile = await pool.query("SELECT * FROM todos WHERE id = $1", [todoId]);
console.log("todos2222222222222222222222:::::::::::::::::::::::::::::::::::::::", res)
    return profile.rows[0];
};
*/

export const insertTodo = async(profileId, task) => {
    const result = await pool.query(
        'INSERT INTO todos (profileId, task) VALUES ($1, $2)', 
        [profileId, task]);
    return result;
};

/*
export async function updateProfile(id, city, bio) {
    const updatedProfile = await pool.query(
        `UPDATE profiles SET city = $1, bio = $2 WHERE cognitoid = $3;`,
        [city, bio, id]
    );
    return updatedProfile;
}

*/