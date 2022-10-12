const tasksList = document.querySelector(".tasks");
let editing = false;
let userId = null;

// This is like the "state" of the app.
let tasks = [];

const renderData = () => {
  tasksList.innerHTML = "";
  tasks.forEach((task) => {
    const newTask = document.createElement("li");
    newTask.innerHTML = `
    <h2>${task.description}</h2>
    <div class="task-btns">
      <button class="btn-del">Delete</button>
      <button class="btn-update">Update</button>
    </div>`;

    tasksList.appendChild(newTask);

    const delBtn = newTask.querySelector(".btn-del");

    delBtn.addEventListener("click", async () => {
      const res = await fetch(`https://tasks.up.railway.app/deleteTask/${task.id}`, {
      // const res = await fetch(`http://localhost:3000/deleteTask/${task.id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      tasks = tasks.filter((task) => task.id !== parseInt(data.id));
      renderData();
    });

    const updateBtn = newTask.querySelector(".btn-update");
    updateBtn.addEventListener("click", async () => {
      editing = true;
      userId = task.id;
      const input = document.querySelector("#addTask");
      input.value = task.description;
    });
  });
};

const fetchData = async () => {
  try {
    const res = await fetch("https://tasks.up.railway.app/tasks");
    // const res = await fetch("http://localhost:3000/tasks");
    const data = await res.json();
    data.forEach((item) => {
      tasks.push(item);
    });

    renderData();
  } catch (error) {
    console.log(error);
  }
};

window.addEventListener("DOMContentLoaded", fetchData);

const submitForm = async (e, inputValue) => {
  e.preventDefault();

  if (!editing) {
    try {
      const res = await fetch("https://tasks.up.railway.app/addTask", {
        // const res = await fetch("http://localhost:3000/addTask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          description: inputValue,
          date: "2022-10-01",
        }),
      });
      const data = await res.json();
      tasks.push(data);
      renderData();
    } catch (error) {
      console.log(error);
    }
  } else {
    try {
      const res = await fetch(`https://tasks.up.railway.app/editTask/${userId}`, {
      // const res = await fetch(`http://localhost:3000/editTask/${userId}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          description: inputValue,
          completed: false,
          date: "2022-10-12",
        }),
      });
      const updatedTask = await res.json();
      const updatedTasks = tasks.map(task => task.id === updatedTask.id ? updatedTask : task);
      tasks = updatedTasks;
      renderData();
    } catch (error) {
      console.log(error);
    }

    editing = false;
    userId = null;
  }
};

const form = document.querySelector("#addTaskForm");
form.addEventListener("submit", (e) => {
  const inputValue = document.querySelector("#addTask").value;
  submitForm(e, inputValue);
  form.reset();
});
