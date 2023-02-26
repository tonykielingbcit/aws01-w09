import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext/AuthContext.js";

function UserDetails() {
    const loggedUser = useContext(AuthContext);
    const navigate = useNavigate();
    
    useEffect(() => {
      // console.log("USERR:: ", loggedUser)
      !loggedUser && navigate("/");
    }, []);


    return (
      <div className="flex flex-col mt-9 bg-gray-200 rounded-lg w-11/12 sm:w-3/4 lg:w-2/5">
        <div className="bg-white shadow-md rounded pt-6 pb-8 mb-4">
          <h1 className="text-2xl font-semibold text-gray-800 mb-5 ml-6 text-left">User Details</h1>

          <table className="ml-12">
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
            </tbody>
          </table>

          <div className="flex items-center justify-center">
              <button className="bg-blue-500 hover:bg-blue-700 w-2/5 mt-8 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button" onClick={ () => console.log("It should enable for editing")}>
                Edit
              </button>
            </div>
        </div>
      </div>
    );
  }
  
  export default UserDetails;