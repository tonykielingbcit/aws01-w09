import { useEffect } from "react";

export default function Home() {

    useEffect(() => {

    }, []);

    return(
        <div className="flex flex-col items-center mt-9 bg-gray-200">
            <div className="bg-white shadow-md rounded px-24 pt-6 pb-8 mb-4">
                <h3 className="mt-4 text-center mb-10 font-bold">Hi There :(</h3>
                <h3 className="mb-12 text-center">Welcome to our system!</h3>
                <h3 className="mb-12 text-center">Welcome back to our system!</h3>
            </div>
        </div>
    );
}