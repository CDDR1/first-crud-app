const tasksList = document.querySelector(".tasks");
let editing = false;
let taskId = null;

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
    </div>
    <input class="completed-checkbox" type="checkbox" id="completed" name="completed"> 
    `;

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
      taskId = task.id;
      const input = document.querySelector("#addTask");
      input.value = task.description;
    });

    const completedCheckbox = newTask.querySelector(".completed-checkbox");
    if (task.completed) {
      completedCheckbox.checked = true;
      // TODO: Add CSS class to cross out the task.
    }
    completedCheckbox.addEventListener("click", async () => {
      console.log("listening"); /////
      const res = await fetch(`https://tasks.up.railway.app/editTask/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          description: task.description,
          completed: !task.completed,
        }),
      });
      const completedTask = await res.json();
      const updatedTasks = tasks.map((task) => (task.id === completedTask.id ? completedTask : task));
      tasks = updatedTasks;
      renderData();
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
      let currTask = null;
      tasks.forEach(task => {
        if (task.id === taskId) {
          currTask = task;
        }
      });
      const res = await fetch(`https://tasks.up.railway.app/editTask/${taskId}`, {
        // const res = await fetch(`http://localhost:3000/editTask/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          description: inputValue,
          completed: currTask.completed,
          date: "2022-10-12",
        }),
      });
      const updatedTask = await res.json();
      const updatedTasks = tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task));
      tasks = updatedTasks;
      renderData();
    } catch (error) {
      console.log(error);
    }

    editing = false;
    taskId = null;
  }
};

const form = document.querySelector("#addTaskForm");
form.addEventListener("submit", (e) => {
  const inputValue = document.querySelector("#addTask").value;
  submitForm(e, inputValue);
  form.reset();
});
