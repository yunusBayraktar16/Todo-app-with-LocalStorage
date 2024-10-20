const form = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo");
const todoList = document.querySelector(".list-group");
const firstCardBody = document.querySelectorAll(".card-body")[0];
const secondCardBody = document.querySelectorAll(".card-body")[1];
const filter = document.querySelector("#filter");
const clearButton = document.querySelector("#clear-todos");
const clearIcon = document.querySelector(".fa-remove");

const alertSuccess = document.createElement("div");
alertSuccess.className = "alert alert-success";

eventListeners();

function eventListeners() {
  form.addEventListener("submit", addTodo);
  document.addEventListener("DOMContentLoaded", loadAllTodosToUI);
  secondCardBody.addEventListener("click", deleteTodo);
  filter.addEventListener("keyup", filterTodos);
  clearButton.addEventListener("click", clearAllTodos);
}
function clearAllTodos() {
  //from UI
  if (confirm("Are you sure you want to delete everything?")) {
    let listItems = document.querySelectorAll(".list-group-item");
    listItems.forEach(function (listItem) {
      listItem.remove();
    });
  }
  //from local storage
  localStorage.removeItem("todos");
}

function filterTodos(e) {
  let filterValue = e.target.value.toLowerCase();
  let listItems = document.querySelectorAll(".list-group-item");
  listItems.forEach(function (listItem) {
    const listItemText = listItem.textContent;
    if (listItemText.indexOf(filterValue) === -1) {
      listItem.setAttribute("style", "display:none !important");
    } else {
      listItem.setAttribute("style", "display:block");
    }
  });
}

function deleteTodo(e) {
  if (e.target.className === "fa fa-remove") {
    e.target.parentElement.parentElement.remove();
    deleteTodoFromStorage(e.target.parentElement.parentElement.textContent);
    showAlert("success", "todo deleted");
  }
}
function deleteTodoFromStorage(deletetodo) {
  let todos = getTodosFromStorage();

  todos.forEach(function (todo, index) {
    if (todo === deletetodo) {
      todos.splice(index, 1);
    }
  });

  localStorage.setItem("todos", JSON.stringify(todos));
}

function addTodo(e) {
  let newTodo = todoInput.value.trim();
  let listText = todoList.textContent.trim();
  if (newTodo.length == "") {
    showAlert("danger", "Please enter a todo!!");
  } else if (listText.indexOf(newTodo) === -1) {
    addTodoToUI(newTodo);
    addToDoToStorage(newTodo);
    showAlert("success", "Successfull");
  } else {
    showAlert("danger", "The todo already exists!");
  }
  e.preventDefault();
}

function getTodosFromStorage() {
  let todos;
  if (localStorage.getItem("todos") == null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  return todos;
}

function addToDoToStorage(newTodo) {
  let todos = getTodosFromStorage();
  todos.push(newTodo);
  localStorage.setItem("todos", JSON.stringify(todos));
}

function loadAllTodosToUI() {
  let todos = getTodosFromStorage();
  todos.forEach(function (todo) {
    addTodoToUI(todo);
  });
}

function showAlert(type, message) {
  const alert = document.createElement("div");
  alert.className = `alert alert-${type}`;
  alert.innerHTML = `${message}`;
  firstCardBody.appendChild(alert);

  setTimeout(() => {
    alert.remove();
  }, 2000);
}

function addTodoToUI(newTodo) {
  const listItem = document.createElement("li");
  const link = document.createElement("a");
  link.href = "#";
  link.className = "delete-item";
  link.innerHTML = '<i class = "fa fa-remove"></i>';
  listItem.className = "list-group-item d-flex justify-content-between";
  listItem.appendChild(document.createTextNode(newTodo));
  listItem.appendChild(link);
  todoList.appendChild(listItem);
  todoInput.value = "";
}
