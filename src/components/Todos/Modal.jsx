import React, { useState } from "react";

export default function Modal({ incomingTask, modalToggler, updateTask }) {
    console.log("modal:::", incomingTask)
    const { id, task, initial, inProgress, done } = incomingTask;
    const [ taskData, setTaskData ] = useState({
        // id: task.id,
        // task: task.task,
        // initial: task.initial,
        // inProgress: task.inProgress,
        // done: task.done
        id, task, initial, inProgress, done
    });
    const [ tempTask, setTempTask ] = useState({
        id, task, initial, inProgress, done
    });
    const [ message, setMessage ] = useState("");
    const [ enableClose, setEnableClose] = useState(false);

    const handleUpdating = async ev => {
        ev.preventDefault();
        const { id, task, initial, inProgress, done } = taskData;
        
        if (tempTask.task === name && tempTask.initial === initial && 
            tempTask.inProgress === inProgress && tempTask.done === done)
            return setMessage("No changes to be applied.");

        // setTempTask({id, name, initial, inProgress, done});
        setMessage("Processing...");
        const result = await updateTask({id, task, initial, inProgress, done});

        console.log("result", result)
        const resultMessage = result.message || result.error;
        if (result.error)
            setTaskData({
                id: tempTask.id,
                task: tempTask.task,
                initial: tempTask.initial,
                inProgress: tempTask.inProgress,
                done: tempTask.done
            });
        else {
            setTempTask({id, task, initial, inProgress, done});
            setEnableClose(true);
        }

        setMessage(resultMessage);
    }


  return (
    <div className="static">
      <div
        className="fixed h-screen w-screen bg-black z-10 top-0 left-0 opacity-75"
      ></div>
      { /** Just added */}
      <div className="fixed h-2/3 top-0 right-0 left-0 z-20 flex justify-center">
        <div className="mx-4 my-4 bg-white m-8">
            <div className="flex justify-end">
                <button 
                    className="border-2 text-red-900 px-2 m-2"
                    onClick={() => modalToggler()}
                >
                    Close
                </button>
            </div>

            <div className="flex flex-col justify-center items-center m-8 mt-20">
                    <div className="ml-3 w-full">
                        <label htmlFor="" className="text-lg font-bold pr-2">Task </label>
                        <input 
                            value={ taskData.task }
                            onChange = {e => setTaskData({...taskData, task: e.target.value})}
                            className="p-2 ml-2 rounded border-2 border-blue-700" />
                    </div>

                    <div className="w-full ml-3 mt-6 flex flex-col">
                        <label htmlFor="" className="text-lg font-bold pr-2 mb-4">Status </label>
                        <div>
                            <button 
                                onClick={() => setTaskData({...taskData, initial: true, inProgress: false, done: false})}
                                className={`w-1/3 rounded-lg border-2 font-semibold ${taskData.initial ? "bg-green-700 text-yellow-500" : "border-green-700"}`}
                            >
                                Initial
                            </button>
                            <button 
                                onClick={() => setTaskData({...taskData, initial: false, inProgress: true, done: false})}
                                className={`w-1/3 rounded-lg border-2 font-semibold ${taskData.inProgress ? "bg-blue-700 text-slate-100" : "border-blue-700"}`}
                            >
                                In Progress
                            </button>
                            <button 
                                onClick={() => setTaskData({...taskData, initial: false, inProgress: false, done: true})}
                                className={`w-1/3 rounded-lg border-2 font-semibold ${taskData.done ? "bg-yellow-500 text-red-600" : "border-yellow-500"}`}
                            >
                                Done
                            </button>
                        </div>                        
                    </div>


                { message &&
                    <div className="m-6 mb-0 flex justify-center items-center">
                    <span className="border-2 px-6 py-2 rounded-lg border-slate-500">
                        { message }
                    </span>
                    </div>
                }

                <div className="text-center w-full mt-8 mb-6">
                    <button className="w-1/3 py-1 bg-green-400 rounded-md hover:bg-green-600" onClick={ handleUpdating }> Save </button>
                    <button className="w-1/3 py-1 bg-red-400 rounded-md ml-1 hover:bg-red-600" onClick={ () => modalToggler() }>
                         { enableClose ? "Close" : "Cancel"} 
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}