import React, { useState, useEffect } from "react";
import { useAppStore } from "../hooks/Context";
import { useNavigate, useSearchParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { db } from "../firebaseConfig";
import { addDoc, collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import Loader from "../loader/Loader";

const Action = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const idFromUrl = searchParams.get("id");
  const { tasks, settasks, userId } = useAppStore();

  const [item, setItem] = useState("");
  const [loader, setLoader] = useState(false);
  const [deadline, setDeadline] = useState("");
  const [error, setErr] = useState(false);

  useEffect(() => {
    if (idFromUrl) {
      const tempData = tasks.find(task => task.id.toString() === idFromUrl);
      setItem(tempData ? tempData.task : "");
      setDeadline(tempData.deadline || "");
    }
  }, [tasks, idFromUrl]);
  const isValidDeadline = (date) => {
    const today = new Date();
    const deadlineDate = new Date(date);
    const maxDate = new Date("2050-12-31");

    return deadlineDate > today && deadlineDate <= maxDate;
  };
  const updatedItem = async () => {
    setLoader(true);
    if (item.length > 0 && isValidDeadline(deadline)) {
      let tempItem = {
        id: idFromUrl,
        task: item,
        status: false,
        deadline: deadline
      };
      let temp = tasks.map(i => (i.id).toString() === idFromUrl ? tempItem : i);

      settasks(temp);

      const tasksCollection = collection(db, "users", userId, "tasks");
      const taskSnapshot = await getDocs(tasksCollection);

      const tasksArray = taskSnapshot?.docs?.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      const updatedArray = tasksArray.filter(task => {
        console.log(task)
        return task.task.id === idFromUrl;
      })
      const taskRef = doc(db, "users", userId, "tasks", updatedArray[0].id);

      await updateDoc(taskRef, {
        task: tempItem
      });


      setItem('');
      setDeadline('');
      navigate('/home');
    } else {
      setLoader(false);
      setErr(true);
    }
  };

  const addItem = async () => {
    setLoader(true);
    if (item.length !== 0 && isValidDeadline(deadline)) {
      if (!userId) {
        console.error("User ID is missing. Cannot add document.");
        setLoader(false);
        return;

      }

      try {
        const newTask = { id: uuidv4().slice(0, 4), task: item, status: false, deadline: deadline };
        settasks(prevTasks => [...prevTasks, newTask]);
        await addDoc(collection(db, "users", userId, "tasks"), { task: newTask });
        setItem("");
        setDeadline("");
        setErr(false);
        navigate('/home');
      } catch (error) {
        setLoader(false);

        console.error("Error adding document: ", error);
      }
    } else {
      setLoader(false)
      setErr(true);
    }
  };

  const handleClick = () => {
    if (idFromUrl) {
      updatedItem();
    } else {
      addItem();
    }
  };

  return (
    <div className="bg-gray-200 flex items-center justify-center">
      {loader ? <Loader /> : <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-xl font-semibold mb-4">
            {idFromUrl ? "Edit Task" : "Add Any Task"}
          </h1>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Task..."
              className={`text-input w-full px-4 py-2 border rounded-lg text-gray-700 focus:border-blue-500 ${error ? "bg-red" : "nothing"}`}
              value={item}
              onChange={(e) => setItem(e.target.value)}
            />

          </div>
          <div className="mb-4">
            <input
              type="date"
              className={`text-input w-full px-4 py-2 border rounded-lg text-gray-700 focus:border-blue-500 ${error ? "bg-red" : "nothing"}`}
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>
          <button
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none"
            onClick={handleClick}
          >
            {idFromUrl ? "Update" : "Add Now"}
          </button>
        </div>
      </div>}
    </div>
  );
};

export default Action;
