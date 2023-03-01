
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Layout.jsx";
import Signup from "./Auth/SignUp.jsx";
import Login from "./Auth/Login.jsx";
import Home from "./Home.jsx";
import PageError from "./PageError.jsx";
import ConfirmUser from "./Auth/ConfirmUser.jsx";
import ForgotPassword from "./Auth/ForgotPassword.jsx";
import ResetPassword from "./Auth/ResetPassword.jsx";
import Logout from "./Auth/Logout.jsx";
import UserDetails from "./UserDetails.jsx";
import Todos from "./Todos/Todos.jsx";

import { AuthContext } from "../AuthContext/AuthContext.js";
import { useEffect, useState } from "react";
import * as cognito from "../helpers/cognito.js";
// import * as jwt from "../helpers/handleLocalStorage.js";

function AppRouter() {
  const [loggedUser, setLoggedUser] = useState("");
  
  const handleSignup = async ({ username, email, password }) => {
    try {
      await cognito.signUp({ username, email, password });
      return ({ message: "ok" });
    } catch (err) {
      console.error(`###ERROR: ${err.message || err }`);
      return ({ error: "Issues on SignUp. Please try again." });
    }
  }

  const confirmUser = async ({ username, code }) => {
    try {
      await cognito.confirmUser({ username, code });
      return ({ message: "userCreatedOK", username });
    } catch (err) {
      console.error(`###ERROR: ${err.message || err }`);
      return ({ error: "Issues on Confirm Email. Please try again." });
    }
  }

  const handleLogin = async ({ username, password }) => {
    try {
      const { idToken: { payload } } = await cognito.signIn({ username, password });
      const { email } = payload;
      const tempUser = payload["cognito:username"];

      setLoggedUser({
        username: tempUser,
        email
      });
      return ({ message: "ok"});
    } catch (err) {
      console.error(`###ERROR: ${err.message || err }`);
      return ({ error: "Login Failed. Please try again." });
    }
  }

  const forgotPassword = async ({ username }) => {
    try {
      // console.log("forgotPasswd======== username:::: ", username)
      const forgotPasswd = await cognito.forgotPassword({ username });
      // console.log("forgotPasswd======== ", forgotPasswd)

      return ({ message: "OK" });
    } catch(err) {
      console.error(`###ERROR: ${err.message || err }`);
      return ({ error: "Forgot Password Failed. Please try again." });
    }
  };

  const resetPassword = async ({ username, code, newPassword }) => {
    try {
      const forgotPasswd = await cognito.resetPassword({ username, code, newPassword });
      // console.log("forgotPasswd======== ", forgotPasswd)
      // this message is like a code for the successfull reset password message be displayed
      return ({ message: "tkOKReset" });
    } catch(err) {
      console.error(`###ERROR: ${err.message || err }`);
      return ({ error: "Forgot Password Failed. Please try again." });
    }
  };

  const logout = async () => {
    setLoggedUser("");
    cognito.signOut();
  };


  useEffect(() => {
    // is checks whether the user is logged when they refresh the browser
    (async() => {
      const isUserLogged = await cognito.getUserSession();
      
      if (isUserLogged.error)
        return;

      const { idToken: { payload } } = isUserLogged;
      const { email } = payload;
      const tempUser = payload["cognito:username"];

      setLoggedUser({
        username: tempUser,
        email
      });
    })();

  }, []);


  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { path: "/", element: <Home /> },
        { path: "/signup", element: <Signup onSubmit={handleSignup} /> },
        { path: "/login", element: <Login onLogin={handleLogin} />},
        { path: "/login/success/:userToLogin/:messageSuccess", element: <Login onLogin={handleLogin}/>},
        { path: "/login/:userToReset/:messageReset", element: <Login onLogin={handleLogin}/>},
        { path: "/confirm-email", element: <ConfirmUser onConfirm={confirmUser} /> },
        { path: "/confirm-email/:usernameToConfirm", element: <ConfirmUser onConfirm={confirmUser} /> },
        { path: "/user-detail", element: <UserDetails /> },
        { path: "/forgot-password", element: <ForgotPassword onForgotPassword={forgotPassword} /> },
        { path: "/reset-password", element: <ResetPassword /> },
        { path: "/reset-password/:userToReset", element: <ResetPassword onResetPassword={resetPassword} /> },
        { path: "/logout", element: <Logout onLogout={logout} /> },
        { path: "/todos", element: <Todos /> },
        { path: "*", element: <PageError />},
      ],
    },
  ]);

  return (
    <AuthContext.Provider value={ loggedUser }>
      <RouterProvider router={router} />
    </AuthContext.Provider>
  );
}

export default AppRouter;

