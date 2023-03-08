import * as profileFunctions from "./functions/profile.js";
import * as todoFunctions from "./functions/todo.js";

export const handler = async event => {
    const userId = event.requestContext.authorizer.jwt.claims.sub;
    const rawPath = event.rawPath;
    const incomingBody = event.body && JSON.parse(event.body);
    
    try {
        const method = event.requestContext.http.method;
        switch (method) {
            case "GET":
                if (rawPath.includes("profile")) {
                    // it forwards to profile functions
                    const user = await profileFunctions.getProfileById(userId);

                    return {
                        statusCode: 200,
                        body: JSON.stringify({
                            message: user
                        })
                    };
                } else if (rawPath.includes("todoId")) {
                    // it queries for a particular todo item pertencent to the current user
                    // dont need that
                } else if (rawPath.includes("todo")) {
                    // it queries all todo items relative to the current user
                    const getAllTodos = await todoFunctions.getAllTodosByProfileId(userId);
                    return {
                        statusCode: 200,
                        body: JSON.stringify({
                            message: getAllTodos
                        })
                    };
                } else {
                    // just in case scenario
                    return {
                        statusCode: 404,
                        body: JSON.stringify({
                            error: "Route not okay!"
                        })
                    };
                }

                break;
            
            case "POST": {
                if (rawPath.includes("profile")) {
                    const {city, bio, cognitoId} = incomingBody;
                    const newProfile = await profileFunctions.addProfile(cognitoId, city, bio);

                    return {
                        statusCode: 201,
                        body: JSON.stringify({
                            message: newProfile?.message,
                            error: newProfile?.error
                        })
                    };
                } else if (rawPath.includes("todo")) {
                    const {task} = incomingBody;
                    const newTask = await todoFunctions.addTodo(userId, task);

                    return {
                        statusCode: 201,
                        body: JSON.stringify({
                            message: newTask?.message,
                            error: newTask?.error
                        })
                    };
                } else {
                    // just in case scenario
                    return {
                        statusCode: 404,
                        body: JSON.stringify({
                            error: "Request not okay!"
                        })
                    };
                }

                break;
                
            }
            case "PUT": {
                if (rawPath.includes("profile")) {
                    const {city, bio} = incomingBody;
                    const profile = await profileFunctions.updateProfile(userId, city, bio);

                    return {
                        statusCode: 200,
                        body: JSON.stringify({
                            message: profile?.message,
                            error: profile?.error
                        })
                    };
                } else if (rawPath.includes("todo")) {
                    const {id, task, initial, inProgress, done} = incomingBody.taskToBeUpdated;
                    const todo = await todoFunctions.updateTodo(id, task, initial, inProgress, done);
                    
                    return {
                        statusCode: todo?.message ? 200 : 500,
                        body: JSON.stringify({
                            message: todo?.message,
                            error: todo?.error
                        })
                    };
                } else {
                    // just in case scenario
                    return {
                        statusCode: 404,
                        body: JSON.stringify({
                            error: "Request not okay!"
                        })
                    };
                }
    
            }
            case "DELETE": {
                // receive: body.itemIdToBeDelete
                // return: new list of items in DB
                // const body = JSON.parse(event.body);
                const { todoIdToBeRemoved } = event.pathParameters;
                const removeTodo = await todoFunctions.removeTodo(todoIdToBeRemoved);
                const success = removeTodo?.message ? true : false;
                const response = {
                    statusCode: success ? 200 : 400,
                    body: JSON.stringify({
                        message: success && "Todo item removed! \\o/",
                        error: !success && "Problem to removed Todo item. :/"
                    })
                };
                return response;
                // break;
            }
            default:
            // Gateway API suppose to handle this before this point
        }
    
        // this code is suppose to be not reachable
        const response = {
            statusCode: 200,
            body: JSON.stringify({message: "something happened..;"})
        };
        return response;
        
    } catch(err) {
        console.log("###ERROR - general error: ", err.message || err);
        return ({
            statusCode: 500,
            body: JSON.stringify({error: err.message || err})
        });
    }
};
    