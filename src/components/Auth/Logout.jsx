import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext/AuthContext.js";

// Logout Page
function Logout({ onLogout }) {
    const loggedUser = useContext(AuthContext);
    const navigate = useNavigate();
    
    const handleSubmit = async event => {
      event.preventDefault();
      
      if (event.target.id === "yes")
        onLogout();

      navigate(`/`);
    };

    useEffect(() => {
      // onLogout(); ///////////////////////////////////////////////////////////// delete this line
      // navigate("/");
      !loggedUser && navigate("/");
    }, []);


    return (
      <div className="flex flex-col items-center mt-9 bg-gray-200">
        <h1 className="text-4xl font-semibold text-gray-800 mb-3">Login</h1>
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h2>Are you sure you want to leave?</h2>
            <div className="flex justify-center mt-8">
              <button onClick={handleSubmit} 
              className="py-3 w-4/12 rounded-lg border-2 bg-blue-400 text-blue-900 font-bold hover:border-blue-900 hover:border-2"
               id="yes">Yes</button>
              <button onClick={handleSubmit} id="no"
                  className="py-3 w-4/12 rounded-lg norder-2 ml-2 bg-red-400 text-red-900 font-bold hover:border-red-900 hover:border-2"
              >
                No
              </button>
            </div>
          </div>
      </div>
    );
  }
  
  export default Logout;