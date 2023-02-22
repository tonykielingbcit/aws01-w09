/*
    the token default name for this application is tokenUserSys
*/

// const recordToken = token => window.localStorage.setItem("tokenUserSys", token);

// const removeToken = () => window.localStorage.removeItem("tokenUserSys");

const getToken = () => window.localStorage.getItem("CognitoIdentityServiceProvider.7dpks4mp0kpquke6anb9269vkp.tk.accessToken");


export {
    recordToken,
    removeToken,
    getToken
};