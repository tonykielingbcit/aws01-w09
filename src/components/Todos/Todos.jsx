import { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext/AuthContext.js";
import Modal from "./Modal.jsx";
import useToggle from "./useToggleModal.js";

const tempTasks = [
  {id: 1, name: "task1", createdAt: "1677623546729" , initial: true, inProgress: false, done: false},
  {id: 2, name: "task22", createdAt: "1677623556729" , initial: false, inProgress: true, done: false},
  {id: 3, name: "task333", createdAt: "1677623946729" , initial: false, inProgress: false, done: true},
  {id: 4, name: "task4444", createdAt: "1677633546729" , initial: true, inProgress: false, done: false},
  {id: 5, name: "task55555", createdAt: "1677423546729" , initial: false, inProgress: true, done: false},
]

function Todos() {
    const [tasks, setTasks] = useState();
    const [ enableNewTask, setEnableNewTask ] = useState(false);
    const [ newTask, setNewTask ] = useState("");
    const [confirmDeletion, setConfirmDeletion] = useState({
      action: false,
      id: ""
    });
    const { showModal, modalToggler } = useToggle();
    const [ tempTask, setTempTask ] = useState("");

    const loggedUser = useContext(AuthContext);
    const navigate = useNavigate();
    
    useEffect(() => {
      // console.log("USERR:: ", loggedUser)
      !loggedUser && navigate("/");

      // if user is logged, 
      setTasks(tempTasks);
    }, []);


    const openModal = (id, name, initial, inProgress, done) => {
      // ev.preventDfefault();
      console.log("opeining modal: ", id, name, initial, inProgress, done)
      setTempTask({
        id, name, initial, inProgress, done
      });
      modalToggler(true);
    }


    const updateTask = async taskToBeUpdated => {
      console.log("sending data to be update:: ", taskToBeUpdated)
      const { id, name, initial, inProgress, done } = taskToBeUpdated;

      const updatingTask = await new Promise(function(res, rej) {
        setTimeout(() => {
          res({message: "Task updated successfully! \o/"});
          // res({error: "Something wrong happened! :/"});
        }, 2000);
      });
console.log("updatingTask ------- ", updatingTask)
      if (updatingTask.message) {
        const tempTasks = tasks.filter(e => e.id !== taskToBeUpdated.id);
        const tempNewTask = {id, name, initial, inProgress, done};
        const totalTasks = [...tempTasks, tempNewTask];
        totalTasks.sort((a, b) => {
          if (a.id < b.id) return -1;
          if (a.id > b.id) return 1;
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
    }

    const handleNewTask = () => {
      console.log("new task to be submitted:: ", newTask);
    }


    return (
      <div className="border-2 border-red-500 flex flex-col mt-9 bg-gray-200 rounded-lg w-11/12 sm:w-3/4 lg:w-2/5">
        
        { showModal && 
          <Modal 
            modalToggler = { modalToggler }
            task = { tempTask }
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
              <label htmlFor="" className="flex justify-center text-md font-bold mb-2"> Are you sure you want to delete Task id '{confirmDeletion.id}'?</label>
              <div className="text-center">
                <button className="w-20 bg-green-400 rounded-md" onClick={() => console.log("go to delete task") }> Yes </button>
                <button className="w-20 bg-red-400 rounded-md ml-1" onClick={ () => setConfirmDeletion(false) }> No </button>
              </div>
            </div>
          }

          <table className="m-auto border-collapse border border-slate-600">
            <thead>
              <tr>
                <th className="text-md font-bold border border-slate-400"> Id </th>
                <th className="text-md font-bold border border-slate-400"> Task </th>
                <th className="text-md px-2font-bold border border-slate-400"> Create at </th>
                <th colSpan={3} className="text-md font-bold border border-slate-400"> Status </th>
                <th colSpan={2} className="text-md px-2 font-bold border border-slate-400"> Action </th>
              </tr>
            </thead>
            <tbody>
              {tasks && tasks.map(({id, name, createdAt, initial, inProgress, done}) => 
                    <tr key={ id }>
                      <td className="border border-slate-400 px-2"> { id } </td>
                      <td className="border border-slate-400 px-2"> 
                        { name }
                      </td>

                      <td className="text-center px-2 border border-slate-400"> { createdAt  }</td>
                      <td className={`text-center border-y border-slate-400 px-1 ${!!initial ? "text-yellow-500 fas fa-battery-quarter border-none" : ""}`}></td>
                      <td className={`text-center border-y border-slate-400 px-1 ${!!inProgress ? "text-blue-700 fas fa-battery-half border-none" : ""}`}></td>
                      <td className={`text-center border-y border-slate-400 px-1 ${!!done ? "text-green-700 fas fa-battery-full border-none" : ""}`}></td>
                      <td className="border-l border-y border-slate-400 text-center">
                        <button onClick={() => openModal(id, name, initial, inProgress, done)}>
                          <i className="fas fa-edit text-[16px] text-blue-700 hover:outline-double"></i>
                        </button>
                      </td>
                      <td className="border-y border-slate-400 text-center">
                        <button onClick={() => setConfirmDeletion({action: true, id})}>
                          <i className="far fa-trash-alt text-red-600 text-[16px] hover:text-red-600 hover:outline-double" 
                          ></i>
                        </button>
                      </td>
                    </tr>
              )}
            </tbody>
          </table>

        </div>
      </div>
    );
  }
  
  export default Todos;