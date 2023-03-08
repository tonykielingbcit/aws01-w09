import { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext/AuthContext.js";
import * as cognito from "../helpers/cognito.js";


function UserDetails() {
    const url = `${import.meta.env.VITE_USER_profile_url}`;
    const loggedUser = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [ editDisabled, setEditDisabled] = useState(true);
    const [ currentUser, setCurrentUser ] = useState({
      city: "",
      bio: ""
    });
    const [ tempUser, setTempUser ] = useState({
      city: "",
      bio: ""
    });
    const [ message, setMessage ] = useState("");

    const handleEdit = () => {
      setEditDisabled(false);
      setMessage("");
      setTempUser({...currentUser});

    };

    const cancelEditing = () => {
      setEditDisabled(true);
      setMessage("");
      setCurrentUser({...tempUser});
    }

    const submitData = async () => {
      // send data to be updated on user table on cockroach db
      if (tempUser.city === currentUser.city && tempUser.bio === currentUser.bio) 
        return setMessage("No changes to be applied.");

      setMessage("Processing...");
      setEditDisabled(true);
      
      console.log("updating::: ", tempUser, currentUser)

      const token = await cognito.getAccessToken();
      
      const updateProfile = await fetch(
          url, 
          {
            method: "PUT",
            headers: {
              "content-type": "application/json",
              Authorization: token
            },
            body: JSON.stringify({
              city: currentUser.city,
              bio: currentUser.bio
            })
          }
        ).then(res => res.json());
        
      // set new message and currentuser
      // if fail, currentuser has be ba back to the same as tempuser
      setMessage(updateProfile.message 
                                  ? "Profile has been updated!  \\o/" 
                                  : updateProfile.error);
    };


    // first load
    useEffect(() => {
      !loggedUser && navigate("/");
      
      // if user is logged, get user data from the server
      (async () => {
        const token = await cognito.getAccessToken();

        const getProfile = await fetch(
          url, 
          {
            headers: {
              "content-type": "application/json",
              Authorization: token
            }
          }
        ).then(res => res.json());
        
        setCurrentUser({
          city: getProfile.message.city,
          bio: getProfile.message.bio
        });

      })();

    }, []);


    return (
      <div className="flex flex-col mt-9 bg-gray-200 rounded-lg w-11/12 sm:w-3/4 lg:w-2/5">
        <div className="bg-white shadow-md rounded pt-6 pb-8 mb-4">
          <h1 className="text-2xl font-semibold text-gray-800 mb-5 ml-6 text-left">User Details</h1>

          <table className="ml-12 mr-12 table-fixed">
            <tbody>
              <tr className="ml-3 border-b border-gray-300">
                <td>
                  <label htmlFor="" className="text-lg font-bold pr-2">Username </label>
                </td>
                <td>
                  <input className="p-2 ml-2 rounded" value={ loggedUser.username } disabled />
                </td>
              </tr>

              <tr className="ml-3 border-b border-gray-300">
                <td>
                  <label htmlFor="" className="text-lg font-bold pr-2">Email </label>
                </td>
                <td>
                  <input className="p-2 ml-2 rounded" value={ loggedUser.email } disabled />
                </td>
              </tr>

              <tr className="ml-3 border-b border-gray-300">
                <td>
                  <label htmlFor="" className="text-lg font-bold pr-2">City </label>
                </td>
                <td>
                  <input 
                    value={ currentUser.city } disabled={editDisabled}
                    onChange={e => setCurrentUser({...currentUser, city: e.target.value})}
                    className={`p-2 ml-2 rounded ${!editDisabled ? "border-2 border-blue-700": ""}`} />
                </td>
              </tr>

              <tr className="ml-3 border-b border-gray-300">
                <td>
                  <label htmlFor="" className="text-lg font-bold pr-2">Bio </label>
                </td>
                <td>
                  <textarea 
                    rows={4}
                    cols={23}
                    value={ currentUser.bio } disabled={editDisabled}
                    onChange={e => setCurrentUser({...currentUser, bio: e.target.value})}
                    className={`p-2 ml-2 rounded ${!editDisabled ? "border-2 border-blue-700": ""}`}>
                  </textarea>
                </td>
              </tr>
            </tbody>
          </table>

          { message &&
            <div className="m-6 mb-0 flex justify-center items-center">
              <span className="border-2 px-6 py-2 rounded-lg border-slate-500">
                { message }
              </span>
            </div>
          }

          {editDisabled
            ?
              <div className="flex items-center justify-center">
                <button className="bg-blue-500 hover:bg-blue-700 w-2/5 mt-8 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="button" onClick={ handleEdit }>
                  Edit
                </button>
              </div>
            :
              <div className="flex items-center justify-center">
                  <button className="bg-green-500 hover:bg-green-700 w-1/3 mt-8 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button" onClick={ submitData }>
                    Save
                  </button>
                  <button className="bg-red-500 hover:bg-red-700 w-1/3 mt-8 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button" onClick={ cancelEditing }>
                    Cancel
                  </button>                
              </div>
          }
        </div>
      </div>
    );
  }
  
  export default UserDetails;