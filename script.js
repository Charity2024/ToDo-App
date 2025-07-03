const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const themeBtn = document.getElementById("toggleTheme");
const filterBtns = document.querySelectorAll(".filterBtn");

let currentFilter = "all";

// Load tasks & theme
window.onload = () => {
  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  savedTasks.forEach((task) => addTaskToDOM(task.text, task.completed));
  
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") document.body.classList.add("dark");

  applyFilter();
};

addBtn.addEventListener("click", () => {
  const taskText = taskInput.value.trim();
  if (taskText !== "") {
    addTaskToDOM(taskText, false);
    saveTasks();
    taskInput.value = "";
    applyFilter();
  }
});

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
});

// Filter logic
filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    applyFilter();
  });
});

function addTaskToDOM(text, completed) {
  const li = document.createElement("li");
  if (completed) li.classList.add("completed");

  li.innerHTML = `
    <label class="task-label">
      <input type="checkbox" ${completed ? "checked" : ""} />
      <span class="task-text">${text}</span>
    </label>
    <button class="deleteBtn">&times;</button>
  `;

  const checkbox = li.querySelector("input[type='checkbox']");
  checkbox.addEventListener("change", () => {
    li.classList.toggle("completed");
    saveTasks();
    applyFilter();
  });

  li.querySelector(".deleteBtn").addEventListener("click", () => {
    li.remove();
    saveTasks();
    applyFilter();
  });

  taskList.appendChild(li);
}


function saveTasks() {
  const tasks = [];
  document.querySelectorAll("li").forEach((li) => {
    tasks.push({
      text: li.querySelector("span").innerText,
      completed: li.classList.contains("completed"),
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function applyFilter() {
  const tasks = taskList.querySelectorAll("li");
  tasks.forEach((task) => {
    task.style.display = "flex"; // default
    if (currentFilter === "active" && task.classList.contains("completed")) {
      task.style.display = "none";
    } else if (currentFilter === "completed" && !task.classList.contains("completed")) {
      task.style.display = "none";
    }
  });
}

