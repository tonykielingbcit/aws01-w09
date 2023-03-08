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
        'INSERT INTO todos (profileId, task) VALUES ($1, $2) RETURNING *', 
        [profileId, task]);
    return result.rows[0];
};



export async function updateTodo(id, task, initial, inProgress, done) {
    const updatedTodo = await pool.query(
        `UPDATE todos SET task = $1, initial = $2, inProgress = $3, done = $4 WHERE id = $5;`,
        [task, initial, inProgress, done, id]
    );
console.log("UPDATETODOOOOOOOOOOOOOOOOOOOOOOO::;;;;;;;;;;;; ", updatedTodo)
    return updatedTodo;
}


export const deleteTodo = async(taskId) => {
    const result = await pool.query(
        'DELETE FROM todos WHERE id = $1', 
        [taskId]);
    return result;
};