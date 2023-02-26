/*
    the token default name for this application is tokenUserSys
*/

// const recordToken = token => window.localStorage.setItem("tokenUserSys", token);

// const removeToken = () => window.localStorage.removeItem("tokenUserSys");
import jwt_decode from "jwt-decode";

const getUserData = token => {
    // const token = window.localStorage.getItem("CognitoUserSession2.idToken.jwtToken");
    console.log("tokennnnnn--- ", token);
    const decodedToken = jwt_decode(token);
    console.log("decodeddddd --- ", decodedToken);
};


export {
    // recordToken,
    // removeToken,
    // getToken
    getUserData
};