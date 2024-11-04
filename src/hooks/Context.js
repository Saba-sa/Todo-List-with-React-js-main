import { collection, getDocs } from "firebase/firestore";
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
} from "react";
import { db } from "../firebaseConfig";
const DataContext = createContext();

const Context = ({ children }) => {
  const [tasks, settasks] = useState([]);
  const [status, setstatus] = useState(true);
  const [editTask, seteditTask] = useState({});
  const [userId, setUserId] = useState('');

  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks]);

  useEffect(() => {


    let temp = JSON.parse(localStorage.getItem("tasks")) || [];
    if (temp && temp.length > 0) {
      settasks(temp)
    }

  }, []);

  const fetchTasks = async () => {
    if (!userId) {
      alert("Please login again");
      return;
    }

    try {
      console.log('inside');
      const tasksCollection = collection(db, "users", userId, "tasks");
      const taskSnapshot = await getDocs(tasksCollection);
      const taskList = taskSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const temp = [];
      console.log('tasklist', taskList);
      taskList.map(doc => {
        temp.push(doc.task.newTask);
      })
      console.log('temp', temp);
      settasks(temp);
      console.log("Tasks fetched successfully:", taskList);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchTasks();
    }
  }, [userId]);

  return (
    <DataContext.Provider
      value={{ tasks, settasks, status, setstatus, editTask, seteditTask, userId, setUserId }}
    >
      {children}
    </DataContext.Provider>
  );
};

export { Context }
export const useAppStore = () => {
  return useContext(DataContext);
};
