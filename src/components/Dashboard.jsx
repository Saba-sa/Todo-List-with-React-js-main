import { useNavigate } from "react-router-dom";
import Display from "./Display";
import { logOut } from "../firebaseConfig"
import { Link } from "react-router-dom";
import { BiTrash, BiEditAlt } from "react-icons/bi";
import React, { useEffect, useState } from "react";
import { useAppStore } from "../hooks/Context";
import Loading from './Loading';
import { collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { DragDropContext } from "react-beautiful-dnd";


const Dashboard = () => {
  const navigate = useNavigate();
  const { email, tasks, settasks, load, userId } = useAppStore();

  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const changeStatus = async (id) => {
    setError(false)
    let newStatus;
    settasks((prevTasks) => {
      const updatedTasks = prevTasks.map((task) => {
        if (task.id === id) {
          newStatus = !task.status;
          return { ...task, status: newStatus };
        } else {
          return task;
        }
      });
      return updatedTasks;
    });

    const tasksCollection = collection(db, "users", userId, "tasks");
    const taskSnapshot = await getDocs(tasksCollection);
    const tasksArray = taskSnapshot?.docs?.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    const updatedArray = tasksArray.filter(task => {
      return task.task.id === id;
    })
    const taskRef = doc(db, "users", userId, "tasks", updatedArray[0].id);

    try {
      await updateDoc(taskRef,
        { "task.status": newStatus });
      console.log("Status updated in Firestore!");
    } catch (error) {
      setError(true);
      setErrorMsg("Error updating status in Firestore:", error);
    }
  };

  const handleDel = async (id) => {
    setError(false)

    const temp = tasks.filter((i) => i.id !== id);
    settasks(temp);

    const tasksCollection = collection(db, "users", userId, "tasks");
    const taskSnapshot = await getDocs(tasksCollection);
    const tasksArray = taskSnapshot?.docs?.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    const updatedArray = tasksArray?.filter(task => {
      return task.task.id === id;
    })
    const taskRef = doc(db, "users", userId, "tasks", updatedArray[0].id);

    try {
      await deleteDoc(taskRef);
      console.log('Document deleted successfully');
    } catch (error) {
      setError(true);
      setErrorMsg("Error while deleting document ");
    }
  };
  const onDragEnd = (result) => {
    // Handle drag and drop result
    if (!result.destination) return;

    // Move tasks between components if needed
    // Update tasks state based on the result
  };

  return <div>
    <div className="fixed left-0 top-0 w-64 h-full bg-[#f8f4f3] p-4 z-50 sidebar-menu transition-transform">
      <a href="#" className="flex items-center pb-4 border-b border-b-gray-800">
        <h2 className="font-bold text-2xl">Todo  <span className="bg-[#f84525] text-white px-2 rounded-md">List</span></h2>
      </a>
      <ul className="mt-4">
        <span className="text-gray-400 font-bold">userId</span>
        <li className="mb-1 group">
          <a href className="flex font-semibold items-center py-2 px-4 text-gray-900 hover:bg-gray-950 hover:text-gray-100 rounded-md group-[.active]:bg-gray-800 group-[.active]:text-white group-[.selected]:bg-gray-950 group-[.selected]:text-gray-100">
            <i className="ri-home-2-line mr-3 text-lg" />
            <span className="text-sm">{email}</span>
          </a>
        </li>

        <span className="text-gray-400 font-bold">General</span>
        <li className="mb-1 group">
          <a href className="flex font-semibold items-center py-2 px-4 text-gray-900 hover:bg-gray-950 hover:text-gray-100 rounded-md group-[.active]:bg-gray-800 group-[.active]:text-white group-[.selected]:bg-gray-950 group-[.selected]:text-gray-100 sidebar-dropdown-toggle">
            <i className="bx bxl-blogger mr-3 text-lg" />
            <span className="text-sm cursor-pointer" onClick={() => navigate('/action')}>Add Task</span>
            <i className="ri-arrow-right-s-line ml-auto group-[.selected]:rotate-90" />
          </a>

        </li>


      </ul>
    </div>
    <div className="fixed top-0 left-0 w-full h-full bg-black/50 z-40 md:hidden sidebar-overlay" />
    {/* end sidenav */}
    <main className="w-full md:w-[calc(100%-256px)] md:ml-64 bg-gray-200 min-h-screen transition-all main">
      {/* navbar */}
      <div className="py-2 px-6 bg-[#f8f4f3] flex items-center shadow-md shadow-black/5 sticky top-0 left-0 z-30">
        <button type="button" className="text-lg text-gray-900 font-semibold sidebar-toggle">
          <i className="ri-menu-line" />
        </button>
        <ul className="ml-auto flex items-center">

          <li className="dropdown" onClick={() => { logOut(); navigate('/') }}>
            <button type="button" className="dropdown-toggle mr-4 text-red-700 cursor-pointer h-8 rounded flex items-center justify-center  hover:text-gray-600">
              Log Out
            </button>
          </li>
        </ul>
      </div>

      <div className="p-6">

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="bg-white border border-gray-100 shadow-md p-6 rounded-md lg:col-span-2">
                <Display />
              </div>
              <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md">
                <div className="flex justify-between mb-4 items-start">
                  <div className="font-medium">Important tasks</div>

                </div>
                <div className="overflow-hidden">
                  <table className="w-full min-w-[460px]">

                    <tbody>

                      <tr>
                        <td className="py-2 px-4 border-b border-b-gray-50 bg-gray-100">
                          {tasks?.length > 0 ? (
                            tasks?.map((i, index) => {
                              const { id, task, status } = i;
                              return (
                                <tr key={index} className="w-full">
                                  <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left text-blueGray-700">
                                    <input
                                      type="checkbox"
                                      name="status"
                                      value={status}
                                      checked={status}
                                      onChange={() => changeStatus(id)}
                                    />
                                  </th>
                                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4 text-lg">
                                    <p className={status ? "text-gray-400 line-through" : "text-black "}
                                      onClick={() => changeStatus(id)}>
                                      {task}
                                    </p>
                                  </td>
                                  <td>
                                    <div className="btns">
                                      <Link to={`/action/?id=${id}`}>
                                        <button disabled={status} className={status ? "text-gray-400" : "text-black"}>
                                          <BiEditAlt />
                                        </button>
                                      </Link>
                                      <button
                                        onClick={() => handleDel(id)}
                                        disabled={status}
                                        className={status ? "text-gray-400" : "text-black"}>
                                        <BiTrash />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr><td>No Data ....</td></tr>
                          )}
                        </td>

                      </tr>

                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </DragDropContext>
      </div>
    </main>

  </div>
}

export default Dashboard;
