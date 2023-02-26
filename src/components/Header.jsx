import { useContext } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { AuthContext } from "../AuthContext/AuthContext.js";

export default function Header() {
    const loggedUser = useContext(AuthContext);
    // console.log("loggedUser_---- ", loggedUser)
    const currentLocation = useLocation().pathname;

    return (
        <header className="h-14 bg-slate-500 flex justify-between text-slate-200">
            <div className="pl-6 flex justify-start items-center">
                <NavLink
                    to="/"
                    className={`menu-item ${
                    currentLocation === "/" ? "is-active" : ""
                    } p-2 font-bold rounded-md hover:bg-green-400 hover:text-amber-600`}
                >
                    Home
                </NavLink>
                {/* <NavLink
                    to="/login"
                    className={`menu-item ${
                    currentLocation === "/" ? "is-active" : ""
                    } p-2 font-bold rounded-md hover:bg-green-400 hover:text-amber-600`}
                >
                    Login
                </NavLink> */}

                { loggedUser &&
                    <NavLink
                        to="/user-detail"
                        className={`menu-item ${
                        currentLocation === "/" ? "is-active" : ""
                        } p-2 font-bold rounded-md hover:bg-green-400 hover:text-amber-600`}
                    >
                        User
                    </NavLink>
                }
            </div>

        {/* temporary */}
        <div className="bg-red-300 flex justify-center items-center">
            {/* <NavLink
                to="/confirm-email"
                className="p-2 font-bold rounded-md hover:bg-green-400 hover:text-amber-600"
            >
                ConfirmEmail
            </NavLink> */}
            {/* <NavLink
                to="/forgot-password"
                className="p-2 font-bold rounded-md hover:bg-green-400 hover:text-amber-600"
            >
                ForgotPasswd
            </NavLink>
            <NavLink
                to="/reset-password"
                className="p-2 font-bold rounded-md hover:bg-green-400 hover:text-amber-600"
            >
                ResetPass
            </NavLink> */}
            {/* <NavLink
                to="/logout"
                className="p-2 font-bold rounded-md hover:bg-green-400 hover:text-amber-600"
            >
                Log Out
            </NavLink> */}
        </div>

        <div className="flex justify-end pr-6 items-center">
            { !loggedUser
                ?
                    <>
                        <NavLink
                            to="/login"
                            className={`menu-item ${
                            currentLocation === "/" ? "is-active" : ""
                            } p-2 font-bold rounded-md hover:bg-green-400 hover:text-amber-600`}
                        >
                            Login
                        </NavLink>

                        <NavLink
                            to="/signup"
                            className={`menu-item ${
                                currentLocation === "/about" ? "is-active" : ""
                            } p-2 font-bold rounded-md hover:bg-green-400 hover:text-amber-600`}
                            >
                            SignUp
                        </NavLink>
                    </>
                :
                    <NavLink
                        to="/logout"
                        className="p-2 font-bold rounded-md hover:bg-green-400 hover:text-amber-600"
                    >
                        Log Out
                    </NavLink>
            }
        </div>

    </header>
  );
};
