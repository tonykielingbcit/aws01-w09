// import * as dbMethods from "./db/profile-db.js";
import * as profileFunctions from "./functions/profile.js";
import * as todoFunctions from "./functions/todo.js";

export const handler = async event => {
    console.log("EVENT::::::::::::::::::::::::::::::::::::", event)
    const userId = event.requestContext.authorizer.jwt.claims.sub;
    const rawPath = event.rawPath;
    const incomingBody = event.body && JSON.parse(event.body);
    
    try {
        const method = event.requestContext.http.method;
        switch (method) {
            case "GET":
                // receive: nothing OR getId param
                // return: all items in DB or the particular item caught from getId
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
                } else if (rawPath.includes("todo")) {
                    const getAllTodos = await todoFunctions.getAllTodosByProfileId(userId);
// console.log("allllllllllllllllllllllllllllllllltodos: userid: ", userId, getAllTodos);
                    return {
                        statusCode: 200,
                        body: JSON.stringify({
                            message: getAllTodos
                        })
                    };
                    // it suppose to be for query all todo items pertencent to the current user
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
                // it forwards to the respective function, either profile or todo
// console.log("POSTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT: ", incomingBody)
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
                
            }
                case "PUT": {
                    // receive: body.id & body.updateItem
                    // return: only the new object inserted in DB
                    //const body = JSON.parse(event.body);

                    // it forwards to the corresponding function
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
                    } else if (rawPath.includes("todoId")) {

                    } else {
                        // just in case scenario
                        return {
                            statusCode: 404,
                            body: JSON.stringify({
                                error: "Request not okay!"
                            })
                        };
                    }
    
        const response = {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Hello from Lambda PUTTTT!',
                receivedData: event.body,
                // profiles,
                paramReceived: event.pathParameters.profileIdToUpdate
            }),
        };
        return response;
                }
    /*            case "DELETE": {
                    // receive: body.itemIdToBeDelete
                    // return: new list of items in DB
                    const body = JSON.parse(event.body);
                    const { itemIdToBeDelete } = body;
                    await db.removeItem(itemIdToBeDelete);
                    const newItemsList = await db.getAllItems();
                    msg = newItemsList;
                    break;
                }*/
                default:
                // Gateway API suppose to handle this before this point
                    // msg = "something wrong :(";
                    // break
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
    