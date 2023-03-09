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
        let newTodo = await todoDbMethods.insertTodo(profileId, task);
        const createdAt = newTodo.createdat;
        newTodo = {...newTodo, createdAt};
        return ({ message: newTodo });
    } catch(err) {
        console.log("###ERROR on addTodo: ", err.messsage || err);
        return ({ error: "Error on add Todo"});
    }
};


export const updateTodo = async (id, task, initial, inProgress, done) => {
        try {            
            const uptTodo = await todoDbMethods.updateTodo(id, task, initial, inProgress, done);

            const success = uptTodo?.rowCount > 0 ? true : false;
            
            return ({ 
                message: success && "Todo updated successfully! \\o/ " ,
                error: !success && "Problem updating Todo.. :/"
            });
        } catch(err) {
            console.log("###ERROR on updateTodo: ", err.messsage || err);
            return ({ error: "Error on updating Todo. :/"});
        }
};


export const removeTodo = async (taskId) => {
    try {
        const rmTodo = await todoDbMethods.deleteTodo(taskId);
        
        return ({ message: rmTodo });
    } catch(err) {
        console.log("###ERROR on addTodo: ", err.messsage || err);
        return ({ error: "Error on add Todo"});
    }
};