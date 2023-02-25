import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../AuthContext/AuthContext.js";

// Signup Page
function ResetPassword({ onResetPassword }) {
    const { loggedUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const { usernameToResetPassword } = useParams();
    // console.log("onSubmit:: ", onSubmit.toString())
    const [user, setUser] = useState({username: usernameToResetPassword || "tk", code: "", newPassword: "", confirmPassword: ""});
    const [missing, setMissing] = useState({username: false, code: false, newPassword: false, confirmPassword: false});
    const [message, setMessage] = useState("");

    const handleSubmit = async event => {
      event.preventDefault();
      
      const {username, code, newPassword, confirmPassword} = user;

      if (!username || !code || !newPassword || !confirmPassword) {
        setMissing({...missing,
          username: !username,
          code: !code,
          newPassword: !newPassword,
          confirmPassword: !confirmPassword
        });
        return;
      }

      if (newPassword !== confirmPassword)
        return setMessage("Password and Confirm Password MUST match!");

      const proceedReset = await onResetPassword({ username, code, newPassword });
      if (proceedReset.message)
        navigate(`/login/${username}/${proceedReset.message}`);
      else {
        setMessage(signup.error);
      }
    };

    useEffect(() => {
      loggedUser && navigate("/");
    }, []);

    return (
      <div className="flex flex-col items-center h-full mt-9 bg-gray-200">
        <h1 className="text-4xl font-semibold text-gray-800 mb-3">Reset Password</h1>
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
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="code">
                Code
              </label>
              <input className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight 
                focus:outline-none focus:shadow-outline ${missing.code ? "border-red-500" : ""}`}
                    id="code" type="text" placeholder="Code" value={user.code}
                    onChange={e => setUser({...user, code: e.target.value})}/>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                New Password
              </label>
              <input className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight 
                focus:outline-none focus:shadow-outline ${missing.newPassword ? "border-red-500" : ""}`}
                    id="password" type="password" placeholder="New Password" value={user.newPassword}
                    onChange={e => setUser({...user, newPassword: e.target.value})} />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password-confirm">
                Confirm Password
              </label>
              <input className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight 
               focus:outline-none focus:shadow-outline ${missing.confirmPassword ? "border-red-500" : ""}`}
                    id="password-confirm" type="password" placeholder="Confirm Password" value={user.confirmPassword}
                    onChange={e => setUser({...user, confirmPassword: e.target.value})} 
                    onKeyDown={e => e.key === "Enter" && handleSubmit(e)}
                    />
            </div>

            {message ? <p className="text-red-500 text-xs italic mb-4">{ message }</p> : ""}
            
            <div className="flex items-center justify-center">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mb-4 rounded focus:outline-none focus:shadow-outline" 
                type="button" onClick={handleSubmit}>
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
  
  export default ResetPassword;