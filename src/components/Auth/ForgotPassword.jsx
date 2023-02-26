import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext/AuthContext.js";

function Login({ onForgotPassword }) {
    const loggedUser = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [user, setUser] = useState({ username: "tk" });
    const [missing, setMissing] = useState({username: false, password: false});
    const [message, setMessage] = useState("");

    const handleSubmit = async event => {
      event.preventDefault();
      
      const { username } = user;

      if (!username) {
        setMissing({...missing,
          username: !username
        });
        return;
      }

      const proceedForgot = await onForgotPassword({ username });
      if (proceedForgot.message)
        navigate(`/reset-password/${username}`);
      else {
        setMessage(proceedLogin.error);
      }
    };

    useEffect(() => {
      // console.log("loggedUser------", loggedUser)
      loggedUser && navigate("/");
    }, []);

    return (
      <div className="flex flex-col items-center mt-9 bg-gray-200">
        <h1 className="text-4xl font-semibold text-gray-800 mb-3">Forgot Password</h1>
        <form className="w-full max-w-xs">
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-3 mb-2">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                  Username
              </label>
              <input className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight 
                focus:outline-none focus:shadow-outline ${missing.username ? "border-red-500" : ""}`}
                    id="username" type="text" placeholder="Username" value={user.username} autoFocus
                    onChange={e => setUser({...user, username: e.target.value})} />
            </div>
            {message ? <p className="text-red-500 text-xs italic mb-4">{ message }</p> : ""}

            <div className="flex items-center justify-center">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mb-3 rounded focus:outline-none focus:shadow-outline"
                type="button" onClick={handleSubmit}>
                Submit
              </button>
            </div>
            {/* <div className="mt-5">
              <span className="p-1 text-xs hover:text-blue-900 hover:bg-green-300 hover:rounded hover:font-bold">
                <button onClick={() => navigate("/login")}>Login</button>
              </span>
            </div> */}
          </div>
        </form>
      </div>
    );
  }
  
  export default Login;