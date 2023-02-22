import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext/AuthContext.js";

// Login Page
function Logout({onLogout}) {
    const { loggedUser } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const handleSubmit = async event => {
      event.preventDefault();
      
      if (event.target.id === "yes")
        onLogout();

      navigate(`/`);
    };

    useEffect(() => {
      !loggedUser && navigate("/");
    }, []);


    return (
      <div className="flex flex-col items-center mt-9 bg-gray-200">
        <h1 className="text-4xl font-semibold text-gray-800 mb-3">Login</h1>
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h2>Are you sure you want to leave?</h2>
            <div className="flex justify-between">
              <button onClick={handleSubmit} id="yes">Yes</button>
              <button onClick={handleSubmit}>No</button>
            </div>
          </div>
      </div>
    );
  }
  
  export default Logout;