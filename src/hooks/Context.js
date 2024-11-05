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
  const [email, setEmail] = useState('@gmail.com');

  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks]);
  useEffect(() => {
    if (userId.length > 0) {
      localStorage.setItem("userid", JSON.stringify(userId));
    }
    if (userId) {
      fetchTasks();
    }
  }, [userId]);

  useEffect(() => {
    let temp = JSON.parse(localStorage.getItem("tasks")) || [];
    let user = JSON.parse(localStorage.getItem("userid")) || "";
    if (temp.length > 0 && user) {
      settasks(temp)
      setUserId(user);
    }

  }, []);

  const fetchTasks = async () => {
    if (!userId) {
      alert("Please login again");
      return;
    }
    try {
      const tasksCollection = collection(db, "users", userId, "tasks");
      const taskSnapshot = await getDocs(tasksCollection);
      const taskList = taskSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const temp = [];
      console.log('tasklist', taskList);
      taskList.map(doc => {
        console.log(doc.task)
        temp.push(doc.task);
      })
      console.log('temp', temp);
      settasks(temp);
      console.log("Tasks fetched successfully:", taskList);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };


  return (
    <DataContext.Provider
      value={{ tasks, settasks, status, setstatus, editTask, seteditTask, userId, setUserId, email, setEmail }}
    >
      {children}
    </DataContext.Provider>
  );
};

export { Context }
export const useAppStore = () => {
  return useContext(DataContext);
};
