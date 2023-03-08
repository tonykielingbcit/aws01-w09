import { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext/AuthContext.js";
import Modal from "./Modal.jsx";
import useToggle from "./useToggleModal.js";
import * as cognito from "../../helpers/cognito.js";

function Todos() {
    const url = `${import.meta.env.VITE_USER_todo_url}`;
    const [tasks, setTasks] = useState();
    const [enableNewTask, setEnableNewTask ] = useState(false);
    const [newTask, setNewTask ] = useState("");
    const [confirmDeletion, setConfirmDeletion] = useState({
      action: false,
      id: "",
      task: ""
    });
    const { showModal, modalToggler } = useToggle();
    const [tempTask, setTempTask ] = useState("");
    const [message, setMessage] = useState("");

    const loggedUser = useContext(AuthContext);
    const navigate = useNavigate();
    
    useEffect(() => {
      // console.log("USERR:: ", loggedUser)
      !loggedUser && navigate("/");

      // if user is logged, 
      // setTasks(tempTasks);

            // if user is logged, get user data from the server
            (async () => {
              const token = await cognito.getAccessToken();
      
              const getTodos = await fetch(
                url, 
                {
                  headers: {
                    "content-type": "application/json",
                    Authorization: token
                  }
                }
              ).then(res => res.json());

              const tasksToBeSet = getTodos.message.map(e => (
                {id: e.id, task: e.task, createdAt: e.createdat , initial: e.initial, inProgress: e.inprogress, done: e.done}
              ));
              console.log("tempTasks", tasksToBeSet);

              setTasks(tasksToBeSet);
            })();
      


      
    }, []);


    const openModal = (id, task, initial, inProgress, done, createdAt) => {
      // ev.preventDfefault();
      console.log("opeining modal: ", id, task, initial, inProgress, done)
      setTempTask({
        id, task, initial, inProgress, done, createdAt
      });
      modalToggler(true);
      setMessage("");
    }


    const updateTask = async taskToBeUpdated => {
      console.log("sending data to be update:: ", taskToBeUpdated)
      const { id, task, initial, inProgress, done } = taskToBeUpdated;

      // const updatingTask = await new Promise(function(res, rej) {
      //   setTimeout(() => {
      //     res({message: "Task updated successfully! \o/"});
      //     // res({error: "Something wrong happened! :/"});
      //   }, 2000);
      // });

      const token = await cognito.getAccessToken();
      
      const updatingTask = await fetch(
        url, 
        {
          method: "PUT",
          headers: {
            "content-type": "application/json",
            Authorization: token
          },
          body: JSON.stringify({taskToBeUpdated})
        }
      ).then(res => res.json());
console.log("updatingTodo---------------- ", updatingTask)


// console.log("updatingTask ------- ", updatingTask)
      if (updatingTask.message) {
        const createdAt = tempTask.createdAt;
        const tempTasks = tasks.filter(e => e.id !== taskToBeUpdated.id);
        const tempNewTask = {id, task, initial, inProgress, done, createdAt};
        const totalTasks = [...tempTasks, tempNewTask];
        totalTasks.sort((a, b) => {
          if (a.createdAt < b.createdAt) return -1;
          if (a.createdAt > b.createdAt) return 1;
          return 0;
        });
        setTasks(totalTasks);
        console.log("tempTasks:: ", tempTasks)
      }

      return updatingTask;

      // when success, update the list of todos with the new data (taskToBeUpdated)
    }

    const enableCreateNewTask = () => {
      setNewTask("");
      setEnableNewTask(true);
      setConfirmDeletion({
        action: false,
        id: "",
        task: ""
      });
      setMessage("");
    }

    const handleNewTask = async () => {
      const token = await cognito.getAccessToken();
      
      const addTodo = await fetch(
        url, 
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            Authorization: token
          },
          body: JSON.stringify({task: newTask})
        }
      ).then(res => res.json());
        const newTodoItem = addTodo.message;
        setTasks([...tasks, newTodoItem]);
        setMessage(newTodoItem && "Todo added successfully! \\o/");
        setNewTask("");
    }


    const enableTaskDeletion = ({action, id, task}) => {
      console.log("---------- ", action, id, task)
      setConfirmDeletion({action, id, task});
      setEnableNewTask(false);
      setMessage("");
    }

    const handleTaskDeletion = async (confirm, idToBeRemoved) => {
      console.log("idToBeRemoved:: ", idToBeRemoved, url)
      const token = await cognito.getAccessToken();

      const deleteUrl = `${url}/${idToBeRemoved}`;
      if (confirm) {
        //go to delete
        const deleteTodo = await fetch(
          deleteUrl, 
          {
            method: "DELETE",
            headers: {
              "content-type": "application/json",
              Authorization: token
            }
          }
        ).then(res => res.json());

        setMessage(deleteTodo.message || deleteTodo.error);
        const tempTasks = tasks.filter(e => e.id !== idToBeRemoved);
        setTasks(tempTasks);
      }
      
      setConfirmDeletion({
        action: false,
        id: "",
        task: ""
      });
      console.log("got delete!!")
      return;
    }


    return (
      <div className="flex flex-col mt-9 bg-gray-200 rounded-lg w-11/12 sm:w-3/4 lg:w-2/5">
        
        { showModal && 
          <Modal 
            modalToggler = { modalToggler }
            incomingTask = { tempTask }
            updateTask = { updateTask }
          />
        }
        
        <div className="bg-white shadow-md rounded pt-6 pb-8 mb-4">
          <h1 className="text-2xl font-semibold text-gray-800 mb-5 ml-6 text-left">Todos</h1>
          <button className="bg-blue-500 hover:bg-blue-700 w-2/5 ml-4 mb-4 text-white font-bold py-2 rounded focus:outline-none focus:shadow-outline"
            type="button" onClick={ enableCreateNewTask }>
            New task
          </button>

          { enableNewTask && 
            <div>
              <label htmlFor="" className="text-md font-bold pl-4"> New Task </label>
              <input 
                className="p-1 pl-2 w-50 mx-1 mb-3 rounded border border-slate-400"
                autoFocus name = "name" value={ newTask } 
                onChange={e => setNewTask(e.target.value) }/>
              <button className="w-20 bg-green-400 rounded-md" onClick={ handleNewTask }>Create</button>
              <button className="w-20 bg-red-400 rounded-md ml-1" onClick={ () => setEnableNewTask(false) }>Cancel</button>
            </div>
          }

          { confirmDeletion.action &&
            <div className="my-6">
              <label htmlFor="" className="flex justify-center text-md font-bold mb-2"> Are you sure you want to delete Task '{confirmDeletion.task}'?</label>
              <div className="text-center">
                <button className="w-20 bg-green-400 rounded-md" onClick={() => handleTaskDeletion(true, confirmDeletion.id) }> Yes </button>
                <button className="w-20 bg-red-400 rounded-md ml-1" onClick={ () => handleTaskDeletion(false) }> No </button>
              </div>
            </div>
          }


          { message &&
            <div className="m-4 mb-6 flex justify-center items-center">
              <span className="border-2 px-6 py-2 rounded-lg border-slate-500">
                { message }
              </span>
            </div>
          }

          <table className="m-auto border-collapse border border-slate-600">
            <thead>
              <tr>
                <th className="text-md font-bold border border-slate-400"> Id </th>
                <th className="text-md font-bold border border-slate-400"> Task </th>
                <th className="text-md px-2 font-bold border border-slate-400"> Create at </th>
                <th colSpan={3} className="text-md font-bold border border-slate-400 w-20"> Status </th>
                <th colSpan={2} className="text-md px-2 font-bold border border-slate-400"> Action </th>
              </tr>
            </thead>
            <tbody>
              {tasks && tasks.map(({id, task, createdAt, initial, inProgress, done}, idNum) => {
                    const dt = new Date(createdAt)
                    const dtOptions = {  
                        year: "numeric", month: "short", day: "numeric"
                      };  
                    const tmOptions = { hour: "2-digit", minute: "2-digit", hour12: false };
                    const dateToDisplay = `${dt.toLocaleDateString('en-US', dtOptions)} - ${dt.toLocaleTimeString("en-US", tmOptions)}`;

                    return (
                    <tr key={ idNum + 1 } className="border border-solid border-slate-400">
                      <td className="border border-slate-400 px-2"> { (`${idNum + 1}`).padStart(3, "0") } </td>
                      <td className="p-1 px-2 max-w-[200px]"> 
                        <div 
                          className="truncate hover:cursor-pointer"
                          onClick={() => openModal(id, task, initial, inProgress, done, createdAt)}
                        >
                          { task }
                        </div>
                      </td>

                      <td className="text-center px-2 border border-slate-400"> { dateToDisplay  }</td>
                      <td 
                        title= {!!initial && "Initial Stage"}
                      >
                        <div 
                          className={`flex justify-center align-middle text-center px-1 w-6 ${!!initial ? "text-green-700 fas fa-battery-full border-none" : ""}`}
                        ></div>
                      </td>
                      <td 
                        title= {!!inProgress && "In Progress"}
                      >
                        <div 
                          className={`flex justify-center align-middle text-center px-1 w-6 ${!!inProgress ? "text-blue-700 fas fa-battery-half border-none" : ""}`}
                        ></div>
                      </td>
                      <td 
                        title= {!!done && "Done!"}
                      >
                        <div 
                          className={`flex justify-center align-middle text-center px-1 w-6 ${!!done ? "text-yellow-500 fas fa-battery-quarter border-none" : ""}`}
                        ></div>
                      </td>
                      <td className="border-l border-y border-slate-400 text-center">
                        <button onClick={() => openModal(id, task, initial, inProgress, done, createdAt)}>
                          <i className="fas fa-edit text-[16px] text-blue-700 hover:outline-double"></i>
                        </button>
                      </td>
                      <td className="border-y border-slate-400 text-center">
                        <button onClick={() => enableTaskDeletion({action: true, id, task})}>
                          <i className="far fa-trash-alt text-red-600 text-[16px] hover:text-red-600 hover:outline-double" 
                          ></i>
                        </button>
                      </td>
                    </tr>
                    );
              })}
            </tbody>
          </table>

        </div>
      </div>
    );
  }
  
  export default Todos;