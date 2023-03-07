import * as dbMethods from "../db/profile-db.js";


export const getProfileById = async userId => {
    const user = await dbMethods.getProfileById(userId);
    return user
};


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









// export const getTodoItemById = async todoId => {
//     console.log("XXXXXXXXXXXXXXXXXXXXXXX todoId:::::::::::: ", todoId)
//         const todoItem = await dbMethods.getTodoItemById(todoId);
//     console.log("user:::::::::::: ", todoItem)
//         return todoItem
// };