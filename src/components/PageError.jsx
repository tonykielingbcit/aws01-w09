export default function PageError() {

    return(
        <div className="flex flex-col items-center mt-9 bg-gray-200">
            <div className="bg-white shadow-md rounded px-24 pt-6 pb-8 mb-4">
                <h3 className="mt-4 text-center mb-10 font-bold">Sorry :(</h3>
                <h3 className="mb-12 text-center">Page does not exist!</h3>
            </div>
        </div>
    );
}