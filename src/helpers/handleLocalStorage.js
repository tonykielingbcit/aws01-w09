/*
    the token default name for this application is tokenUserSys
*/

// const recordToken = token => window.localStorage.setItem("tokenUserSys", token);

// const removeToken = () => window.localStorage.removeItem("tokenUserSys");
import jwt_decode from "jwt-decode";

const getUserData = token => {
    const decodedToken = jwt_decode(token);
    return decodedToken;
};


export {
    // recordToken,
    // removeToken,
    // getToken
    getUserData
};