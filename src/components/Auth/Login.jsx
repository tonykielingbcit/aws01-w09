import { useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext/AuthContext.js";

import * as cognito from "../../helpers/cognito.js";
import * as helperLS from "../../helpers/handleLocalStorage.js";

function Login({ onLogin }) {
    const url = `${import.meta.env.VITE_USER_profile_url}`;
    const loggedUser = useContext(AuthContext);
    const navigate = useNavigate();

    if (loggedUser) navigate("/");

    const { userToLogin, userToReset, messageReset, messageSuccess } = useParams();
    
    const messageResetSuccess = (
      messageReset && messageReset === "tkOKReset") 
        ? "Password has been changed successfully! \\o/" 
        : messageSuccess && messageSuccess === "userCreatedOK"
          ? `User ${userToLogin} created successfully!! \\o/`
          : false;

    // const [user, setUser] = useState({ username: "", password: ""});
    // const [user, setUser] = useState({ username: userToLogin || "tk", password: "P@ssw0rd1"});
    const [user, setUser] = useState({ username: userToLogin || userToReset || "", password: ""});
    const [missing, setMissing] = useState({username: false, password: false});
    const [message, setMessage] = useState("");

    const handleSubmit = async event => {
      event.preventDefault();
      
      const {username, password } = user;

      if (!username || !password) {
        setMissing({...missing,
          username: !username,
          password: !password
        });
        setMessage("Missing data.")
        return;
      }

      setMessage("Processing...");

      const proceedLogin = await onLogin({ username, password });
      if (proceedLogin.message) {

          // check and add new profile on DB if it does not exist
          // it should be done on the confirm stage, but for now it is being done on login
          // kz need to know how to get sub before login
          const token = await cognito.getAccessToken();
          const cognitoId = helperLS.getUserData(token);
          const tempp = await fetch(
            url, 
            {
              method: "POST",
              headers: {
                "content-type": "application/json",
                Authorization: token
              },
              body:JSON.stringify({
                city: "",
                bio: "",
                cognitoId: cognitoId.sub
              })
            }
          ).then(res => res.json());
console.log("tempp== ", tempp)
        navigate(`/`);
      } else {
        setMessage(proceedLogin.error);
      }
    };


    return (
      <div className="flex flex-col items-center mt-9 bg-gray-200">
        <h1 className="text-4xl font-semibold text-gray-800 mb-3">Login</h1>
        {messageResetSuccess &&
          <div className=" m-2 mb-4 border border-green-700 bg-green-300 text-blue-700 text-xl font-bold p-3 rounded">
            {messageResetSuccess}
          </div>
        }
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-3 mb-2">
          <form className="w-full max-w-xs">
            <div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                    Username
                </label>
                <input className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight 
                  focus:outline-none focus:shadow-outline ${missing.username ? "border-red-500" : ""}`}
                      id="username" type="text" placeholder="Username" value={user.username} name="username" autoFocus
                      onChange={e => setUser({...user, username: e.target.value})} />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="code">
                  Password
                </label>
                <input className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight 
                  focus:outline-none focus:shadow-outline ${missing.password ? "border-red-500" : ""}`}
                      id="code" type="password" placeholder="Password" value={user.password} name="password"
                      onChange={e => setUser({...user, password: e.target.value})}
                      onKeyDown={e => e.key === "Enter" && handleSubmit(e)}
                      />
              </div>

              {message ? <p className="text-red-500 text-xs italic mb-4">{ message }</p> : ""}

              <div className="flex items-center justify-center">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="button" onClick={handleSubmit}>
                  Login
                </button>
              </div>
            </div>
          </form>
          <div className="mt-5">
            <span className="p-1 text-xs hover:text-blue-900 hover:bg-green-300 hover:rounded hover:font-bold">
              <button onClick={() => navigate("/forgot-password")}>Forgot Password?</button>
            </span>
          </div>
        </div>
      </div>
    );
  }
  
  export default Login;