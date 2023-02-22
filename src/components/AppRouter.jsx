
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Layout.jsx";
import Signup from "./Auth/SignUp.jsx";
import Login from "./Auth/Login.jsx";
import Home from "./Home.jsx";
import PageError from "./PageError.jsx";
import ConfirmEmail from "./Auth/ConfirmEmail.jsx";
import ForgotPassword from "./Auth/ForgotPassword.jsx";
import ResetPassword from "./Auth/ResetPassword.jsx";
import * as cognito from "../helpers/cognito.js";

function AppRouter() {
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
      return ({ message: "ok", username });
    } catch (err) {
      console.error(`###ERROR: ${err.message || err }`);
      return ({ error: "Issues on Confirm Email. Please try again." });
    }
  }

  const handleLogin = async ({ username, password }) => {
    try {
      const doingLogin = await cognito.signIn({ username, password });
      console.log("doingLogin===== ", doingLogin)
      return ({ message: "ok"});
    } catch (err) {
      console.error(`###ERROR: ${err.message || err }`);
      return ({ error: "Login Failed. Please try again." });
    }
  }


  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { path: "/", element: <Home /> },
        { path: "/signup", element: <Signup onSubmit={handleSignup} /> },
        { path: "/login", element: <Login onLogin={handleLogin} />},
        { path: "/login/:userToLogin", element: <Login onLogin={handleLogin}/>},
        { path: "/confirm-email/", element: <ConfirmEmail onConfirm={confirmUser} /> },
        { path: "/confirm-email/:usernameToConfirm", element: <ConfirmEmail onConfirm={confirmUser} /> },
        { path: "/forgot-password", element: <ForgotPassword /> },
        { path: "/reset-password", element: <ResetPassword /> },
        { path: "*", element: <PageError />},
      ],
    },
  ]);

  return (
    <RouterProvider router={router} />
  );
}

export default AppRouter;

