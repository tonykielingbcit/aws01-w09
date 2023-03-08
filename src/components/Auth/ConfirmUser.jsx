import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";


function ConfirmUser({ onConfirm }) {
    const url = `${import.meta.env.VITE_USER_profile_url}`;
    const { usernameToConfirm } = useParams();
    const navigate = useNavigate();
  
    const [user, setUser] = useState({ username: usernameToConfirm || "", code: ""});
    const [missing, setMissing] = useState({username: false, code: false});
    const [message, setMessage] = useState("");

    const handleSubmit = async event => {
      event.preventDefault();
      
      const {username, code } = user;

      if (!username || !code) {
        setMissing({...missing,
          username: !username,
          code: !code
        });
        return;
      }

      const confirm = await onConfirm({ username, code });
      
      if (confirm.message) {
        //   // add new profile on DB
        //   const token = await cognito.getAccessToken();
        //   const cognitoId = helperLS.getUserData(token);
        //   console.log("locastorage::: ", cognitoId.sub);
        //   const newProfile = await fetch(
        //     url, 
        //     {
        //       method: "POST",
        //       headers: {
        //         "content-type": "application/json",
        //         Authorization: token
        //       },
        //       body:JSON.stringify({
        //         city: "",
        //         bio: "",
        //         cognitoId: cognitoId.sub
        //       })
        //     }
        //   ).then(res => res.json());
        // console.log("adding profile::::::::: ", newProfile)
  
        navigate(`/login/success/${confirm.username}/${confirm.message}`);
      } else {
        setMessage(confirm.error);
      }
    };


    return (
      <div className="flex flex-col items-center mt-9 bg-gray-200">
        <h1 className="text-4xl font-semibold text-gray-800 mb-3">Confirm Email</h1>
        <form className="w-full max-w-xs">
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                  Username
              </label>
              <input className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight 
                focus:outline-none focus:shadow-outline ${missing.username ? "border-red-500" : ""}`}
                    id="username" type="text" placeholder="Username" value={user.username}
                    onChange={e => setUser({...user, username: e.target.value})} />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="code">
                Code
              </label>
              <input className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight 
                focus:outline-none focus:shadow-outline ${missing.code ? "border-red-500" : ""}`}
                    id="code" type="text" placeholder="Code" value={user.code} autoFocus
                    onChange={e => setUser({...user, code: e.target.value})}
                    onKeyDown={e => e.key === "Enter" && handleSubmit(e)}
                    />
            </div>

            {message ? <p className="text-red-500 text-xs italic mb-4">{ message }</p> : ""}

            <div className="flex items-center justify-center">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button" onClick={handleSubmit}>
                Confirm Registration
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
  
  export default ConfirmUser;