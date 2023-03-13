import { useEffect, useContext, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext/AuthContext.js";
import * as cognito from "../helpers/cognito.js";


function UserDetails() {
    const url = `${import.meta.env.VITE_USER_profile_url}`;
    const loggedUser = useContext(AuthContext);
    const navigate = useNavigate();
    const imgInputRef = useRef(null);
    const [file, setFile] = useState("");
    
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
      
      // console.log("updating::: ", tempUser, currentUser)

      const token = await cognito.getAccessToken();
      
//       const formData = new FormData();
//       formData.append("image", file);
//       formData.append("city", currentUser.city);
//       formData.append("bio", currentUser.bio);
// console.log("file::: ", file)
      const updateProfile = await fetch(
          url,
          {
            method: "PUT",
            headers: {
              "content-type": "application/json",
              // "Content-type": "multipart/form-data",
              Authorization: token
            },
            // body: JSON.stringify(formData)
            body: JSON.stringify({
              city: currentUser.city,
              bio: currentUser.bio,
              // formData
            })
          }
        ).then(res => res.json());
console.log("updateProfile=== ", updateProfile)
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
          city: getProfile.message?.city || "",
          bio: getProfile.message?.bio || ""
        });

      })();

    }, []);


    const fileChange = ev => {
      ev.preventDefault();
      console.log("ev" , ev)  
      setFile(ev.target.files[0]);
    }


    return (
      <div className="flex flex-col mt-9 bg-gray-200 rounded-lg w-11/12 sm:w-3/4 lg:w-2/5">
        <div className="bg-white shadow-md rounded pt-6 pb-8 mb-4">
          <h1 className="text-2xl font-semibold text-gray-800 mb-5 ml-6 text-left">User Details</h1>

          
          <div className=" flex flex-col">
            {/* <div className="flex justify-center flex-col sm:flex-row sm:px-12 "> */}
            <div className="flex justify-center flex-col  sm:flex-row sm:px-12">
              <figure className="flex flex-col max-w-[30%]">
                {/* <img className="w-full object-cover" src="img/profile.jpg" /> */}
                <img className="object-contain m-auto" src="img/profile.jpg" width={150} />
                <figcaption>
                  {/* <input type={"file"} /> */}
                  <input hidden type="file" ref={imgInputRef} onChange={fileChange} />
                  <p className="text-center hover:cursor-pointer" onClick={e => imgInputRef.current.click(e)}>Change your pic</p>
                </figcaption>
              </figure>
              <div className="m-auto">
                <table className="table-fixed">
                  <tbody>
                    <tr className="ml-3 border-b border-gray-300">
                      <td>
                        <label htmlFor="userName" className="text-lg font-bold pr-2">Username </label>
                      </td>
                      <td>
                        <input id="userName" className="p-2 ml-2 rounded" value={ loggedUser.username } disabled />
                      </td>
                    </tr>
                    <tr className="ml-3 border-b border-gray-300">
                      <td>
                        <label htmlFor="email" className="text-lg font-bold pr-2">Email </label>
                      </td>
                      <td>
                        <input id="email" className="p-2 ml-2 rounded" value={ loggedUser.email } disabled />
                      </td>
                    </tr>

                    <tr className="ml-3 border-b border-gray-300">
                    <td>
                      <label htmlFor="" className="text-lg font-bold">City </label>
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
              </div>
            </div>


            {/* <div className="flex justify-center">
              <table className="ml-12 mr-12 table-fixed m-auto">
                <tbody> */}
                  {/* <tr className="ml-3 border-b border-gray-300">
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
                  </tr> */}

                  {/* <tr className="ml-3 border-b border-gray-300">
                    <td>
                      <label htmlFor="" className="text-lg font-bold">City </label>
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
            </div> */}

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
      </div>
    );
  }
  
  export default UserDetails;