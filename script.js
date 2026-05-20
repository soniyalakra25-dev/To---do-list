const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

/** @type {{id: string, text: string, done: boolean}[]} */
let tasks = [];

function makeId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function addTask() {
  const text = taskInput.value.trim();
  if (!text) {
    alert("Please enter a task first!");
    taskInput.focus();
    return;
  }

  const newTask = { id: makeId(), text, done: false };
  tasks = [newTask, ...tasks];
  taskInput.value = "";
  renderTasks();
}

function toggleTask(id) {
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, done: !task.done } : task
  );
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  renderTasks();
}

function startEditTask(id) {
  const li = taskList.querySelector(`li[data-id="${CSS.escape(id)}"]`);
  if (!li) return;

  const task = tasks.find((t) => t.id === id);
  if (!task) return;

  li.classList.add("editing");

  const existingText = li.querySelector(".task-text");
  const existingActions = li.querySelector(".task-actions");
  if (!existingText || !existingActions) return;

  existingText.style.display = "none";
  existingActions.style.display = "none";

  const editWrap = document.createElement("div");
  editWrap.className = "edit-wrap";
  editWrap.dataset.role = "edit";

  const editInput = document.createElement("input");
  editInput.className = "edit-input";
  editInput.type = "text";
  editInput.value = task.text;
  editInput.maxLength = 200;

  const saveBtn = document.createElement("button");
  saveBtn.className = "save-btn";
  saveBtn.type = "button";
  saveBtn.textContent = "Save";
  saveBtn.dataset.action = "save";

  const cancelBtn = document.createElement("button");
  cancelBtn.className = "cancel-btn";
  cancelBtn.type = "button";
  cancelBtn.textContent = "Cancel";
  cancelBtn.dataset.action = "cancel";

  editWrap.append(editInput, saveBtn, cancelBtn);
  li.appendChild(editWrap);

  editInput.focus();
  editInput.select();
}

function commitEditTask(id, nextText) {
  const text = nextText.trim();
  if (!text) {
    alert("Task text can't be empty.");
    return;
  }

  tasks = tasks.map((task) => (task.id === id ? { ...task, text } : task));
  renderTasks();
}

function cancelEditTask(id) {
  const li = taskList.querySelector(`li[data-id="${CSS.escape(id)}"]`);
  if (!li) return;
  const editWrap = li.querySelector('[data-role="edit"]');
  if (editWrap) editWrap.remove();
  li.classList.remove("editing");

  const existingText = li.querySelector(".task-text");
  const existingActions = li.querySelector(".task-actions");
  if (existingText) existingText.style.display = "";
  if (existingActions) existingActions.style.display = "";
}

function renderTasks() {
  taskList.innerHTML = "";

  for (const task of tasks) {
    const li = document.createElement("li");
    li.className = task.done ? "completed" : "";
    li.dataset.id = task.id;

    const textEl = document.createElement("span");
    textEl.className = "task-text";
    textEl.textContent = task.text;

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const editBtn = document.createElement("button");
    editBtn.className = "edit-btn";
    editBtn.type = "button";
    editBtn.textContent = "Edit";
    editBtn.dataset.action = "edit";

    const deleteBtn = document.createElement("button");
     deleteBtn.className = "delete-btn";
     deleteBtn.type = "button";
    deleteBtn.textContent = "Remove";
     deleteBtn.dataset.action = "delete";

    actions.append(editBtn, deleteBtn);
    li.append(textEl, actions);
    taskList.appendChild(li);
  }
}

addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTask();
});

taskList.addEventListener("click", (e) => {
  const li = e.target.closest("li");
  if (!li) return;

  const id = li.dataset.id;
  if (!id) return;

  const actionEl = e.target.closest("[data-action]");
  const action = actionEl?.dataset?.action;

  if (action === "delete") {
    deleteTask(id);
    return;
  }

  if (action === "edit") {
    startEditTask(id);
    return;
  }

  if (action === "save") {
    const input = li.querySelector(".edit-input");
    if (input) commitEditTask(id, input.value);
    return;
  }

  if (action === "cancel") {
    cancelEditTask(id);
    return;
  }

  if (li.classList.contains("editing")) return;

  const deleteClicked = e.target.closest('[data-action="delete"]');
  if (deleteClicked) {
    deleteTask(id);
    return;
  }

  toggleTask(id);
});

taskList.addEventListener("keydown", (e) => {
  const li = e.target.closest("li");
  if (!li) return;
  const id = li.dataset.id;
  if (!id) return;

  if (e.target.classList.contains("edit-input") && e.key === "Enter") {
    commitEditTask(id, e.target.value);
  }

  if (e.target.classList.contains("edit-input") && e.key === "Escape") {
    cancelEditTask(id);
  }
});

taskList.addEventListener("dblclick", (e) => {
  const li = e.target.closest("li");
  if (!li) return;
  if (li.classList.contains("editing")) return;
  const id = li.dataset.id;
  if (!id) return;
  startEditTask(id);
});

taskInput.focus();
