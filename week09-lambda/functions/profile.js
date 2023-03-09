import * as dbMethods from "../db/profile-db.js";


export const getProfileById = async userId => {
    const user = await dbMethods.getProfileById(userId);
    return user
};


export const addProfile = async (userId, city, bio) => {
    try {
        // checking whether the profile is already on DB
        // it should be done on the confirm stage, but for now it is being done on login
        // kz need to know how to get sub before login
        const checkProfile = await dbMethods.getProfileById(userId);
        if (checkProfile?.id) return ({ message: "user already on DB"});
        
        const newProfile = await dbMethods.insertProfile(userId, city, bio);
        return ({ message: newProfile });
    } catch(err) {
        console.log("###ERROR on addProfile: ", err.messsage || err);
        return ({ error: "Error on add Profile"});
    }
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

