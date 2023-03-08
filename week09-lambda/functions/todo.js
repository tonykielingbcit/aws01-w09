import * as todoDbMethods from "../db/todo-db.js";


export const getAllTodosByProfileId = async profileId => {
    const todo = await todoDbMethods.getAllTodos(profileId);
    return todo;
};

/*
export const getTodoById = async todoId => {
    const todo = await todoDbMethods.getTodoById(todoId);
    return todo;
};
*/

export const addTodo = async (profileId, task) => {
    try {        
        const newTodo = await todoDbMethods.insertTodo(profileId, task);
console.log('NEW TODOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO: ', newTodo)
        return ({ message: newTodo });
    } catch(err) {
        console.log("###ERROR on addTodo: ", err.messsage || err);
        return ({ error: "Error on add Todo"});
    }
};

/*
export const updateProfile = async (userId, city, bio) => {
        try {
            // for test purpose
            if (city === "error" || bio === "error") throw({message: "all good"});
            
            const user = await dbMethods.updateProfile(userId, city, bio);
            return ({ message: user });
        } catch(err) {
            console.log("###ERROR on updateProfile: ", err.messsage || err);
            return ({ error: "Error on updating Profile"});
        }
};

*/