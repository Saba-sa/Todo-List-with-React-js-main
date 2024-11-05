import React, { useEffect, useState } from "react";
import { useAppStore } from "../hooks/Context";
import { Link } from "react-router-dom";
import { BiTrash, BiEditAlt } from "react-icons/bi";
import Loading from './Loading';
import { collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";


const Display = () => {
  const { tasks, settasks, load, userId } = useAppStore();
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

  return (
    <div className=" ">
      <div className="flex flex-col  gap-2">
        <p>General Task</p>
      </div>
      {
        load ?
          <Loading />
          :
          <div className="block w-full overflow-x-auto p-12 ">
            {error && <p className="text-red-600">{errorMsg}</p>}
            <table className="items-center bg-transparent w-full border-collapse ">
              <tbody className="text-2xl">
                {tasks?.length > 0 ? (
                  tasks?.map((i, index) => {
                    console.log('i', i)
                    const { id, task, status } = i;
                    return (
                      <tr key={index}>
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
              </tbody>
            </table>
          </div>

      }
    </div>
  );
};

export default Display;
