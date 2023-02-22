import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext/AuthContext.js";

function Login({onLogin}) {
    const { loggedUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const { usernameToLogin } = useParams();
    
    const [user, setUser] = useState({ username: usernameToLogin || "", password: ""});
    const [missing, setMissing] = useState({username: false, password: false});
    const [message, setMessage] = useState("");

    const handleSubmit = async event => {
      event.preventDefault();
      
      const {username, password } = user;
      // console.log("asd: ", username, password)

      if (!username || !password) {
        setMissing({...missing,
          username: !username,
          password: !password
        });
        return;
      }

      const proceedLogin = await onLogin({ username, password });
      if (proceedLogin.message)
        navigate(`/`);
      else {
        setMessage(proceedLogin.error);
      }
    };

    useEffect(() => {
      loggedUser && navigate("/");
    }, []);

    return (
      <div className="flex flex-col items-center mt-9 bg-gray-200">
        <h1 className="text-4xl font-semibold text-gray-800 mb-3">Login</h1>
        <form className="w-full max-w-xs">
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                  Username
              </label>
              <input className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight 
                focus:outline-none focus:shadow-outline ${missing.username ? "border-red-500" : ""}`}
                    id="username" type="text" placeholder="Username" value={user.username} autoFocus
                    onChange={e => setUser({...user, username: e.target.value})} />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="code">
                Password
              </label>
              <input className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight 
                focus:outline-none focus:shadow-outline ${missing.password ? "border-red-500" : ""}`}
                    id="code" type="password" placeholder="Password" value={user.password}
                    onChange={e => setUser({...user, password: e.target.value})}/>
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
      </div>
    );
  }
  
  export default Login;