import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext/AuthContext.js";

// Signup Page
function Signup({ onSubmit }) {
  const { loggedUser } = useContext(AuthContext);
  const navigate = useNavigate();
  // console.log("onSubmit:: ", onSubmit.toString())
    const [user, setUser] = useState({username: "tk", email: "tk@tk.ca", password: "", confirmPassword: ""});
    const [missing, setMissing] = useState({username: false, email: false, password: false, confirmPassword: false});
    const [message, setMessage] = useState("");

    const handleSubmit = async event => {
      event.preventDefault();
      
      const {username, email, password, confirmPassword} = user;

      if (!username || !email || !password || !confirmPassword) {
        setMissing({...missing,
          username: !username,
          email: !email,
          password: !password,
          confirmPassword: !confirmPassword
        });
        return;
      }

      if (password !== confirmPassword)
        return setMessage("Password and Confirm Password MUST match!");

      const signup = await onSubmit({ username, email, password });
      if (signup.message)
        navigate(`/confirm-email/${username}`);
      else {
        setMessage(signup.error);
      }
    };

    useEffect(() => {
      loggedUser && navigate("/");
    }, []);

    return (
      <div className="flex flex-col items-center h-full mt-9 bg-gray-200">
        <h1 className="text-4xl font-semibold text-gray-800 mb-3">Signup Page</h1>
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
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight 
                focus:outline-none focus:shadow-outline ${missing.email ? "border-red-500" : ""}`}
                    id="email" type="email" placeholder="Email" value={user.email}
                    onChange={e => setUser({...user, email: e.target.value})}/>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight 
                focus:outline-none focus:shadow-outline ${missing.password ? "border-red-500" : ""}`}
                    id="password" type="password" placeholder="Password" value={user.password}
                    onChange={e => setUser({...user, password: e.target.value})} />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password-confirm">
                Confirm Password
              </label>
              <input className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight 
               focus:outline-none focus:shadow-outline ${missing.confirmPassword ? "border-red-500" : ""}`}
                    id="password-confirm" type="password" placeholder="Confirm Password" value={user.confirmPassword}
                    onChange={e => setUser({...user, confirmPassword: e.target.value})} />
            </div>

            {message ? <p className="text-red-500 text-xs italic mb-4">{ message }</p> : ""}
            
            <div className="flex items-center justify-center">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                type="button" onClick={handleSubmit}>
                Sign Up
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
  
  export default Signup;