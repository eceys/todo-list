//All elements
const form = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo");
const todoList = document.querySelector(".list-group");
const firstCardBody = document.querySelectorAll(".card-body")[0];
const secondCardBody = document.querySelectorAll(".card-body")[1];
const filter = document.querySelector("#filter");
const clearButton = document.querySelector("#clear-todos");

eventListeners();

function eventListeners(){ //all event listener
    form.addEventListener("submit",addTodo);
    document.addEventListener("DOMContentLoaded",loadAllTodosUI); //reload page event
    secondCardBody.addEventListener("click",deleteTodo);
    filter.addEventListener("keyup",filterTodos);
    clearButton.addEventListener("click",clearAllTodos);
}

function clearAllTodos(e){
    let todos = getTodosFromStorage();
    if(todos.length == 0){
        showAlert("primary","Todo list is empty.");
    }else{
        if(confirm("Do you want to delete all todos?")){
            while(todoList.firstElementChild != null){
                todoList.removeChild(todoList.firstElementChild);
            }
            localStorage.removeItem("todos");
        }
    }
    
}

function filterTodos(e){
    const filterValue = e.target.value.toLowerCase();
    const listItems = document.querySelectorAll(".list-group-item");
    listItems.forEach(function(listItem){
        const text = listItem.textContent.toLowerCase();
        if (text.indexOf(filterValue) === -1){
            listItem.setAttribute("style","display : none !important");
        }else{
            listItem.setAttribute("style","display : block");
        }

    });

}

function deleteTodo(e){

    if(e.target.className === "fa fa-remove"){
        if(confirm("Do you want to delete this todo?")){
            e.target.parentElement.parentElement.remove();
            deleteTodoFromStorage(e.target.parentElement.parentElement.textContent);
            showAlert("success","Todo deleted.");
        }
        

    }

}

function deleteTodoFromStorage(deleteTodo){

    let todos = getTodosFromStorage();
    todos.forEach(function(todo,index){
        if(todo === deleteTodo){
            todos.splice(index,1);
        }
    })

    localStorage.setItem("todos",JSON.stringify(todos));

}

function loadAllTodosUI(){
    let todos = getTodosFromStorage();
    
    todos.forEach(function(todo){
        addTodoToUI(todo);
    })
}


function addTodo(e){

    let newTodo = todoInput.value.trim(); //Girilen ToDo
    let todos = getTodosFromStorage();
    let check = 0;
    if (newTodo == ""){
        showAlert("danger","Todo field cannot be blank.");
    }else{
        todos.forEach(function(todo){
            
            if(todo.toString().toLowerCase() === newTodo.toString().toLowerCase()){
                check=1;
            }
        })
        if(check != 1){
            addTodoToStorage(newTodo);
            addTodoToUI(newTodo);
        }else if(check===1){
            showAlert("danger","This todo has been added before.");
        }
    }
    
    e.preventDefault();
}

function showAlert(type,message){

    const alert =  document.createElement("div");
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    firstCardBody.appendChild(alert);

    setTimeout(function(){
        alert.remove();
    },1500);

}

function getTodosFromStorage(){  //Load all todos from local storage 
    let todos;
    if(localStorage.getItem("todos") === null){
        todos=[];
    }else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    return todos;
}

function addTodoToStorage(newTodo){
    let todos;
    todos = getTodosFromStorage();

    todos.push(newTodo);

    localStorage.setItem("todos",JSON.stringify(todos));
}

function addTodoToUI(newTodo){

    const listItem = document.createElement("li");

    const link = document.createElement("a");
    link.href = "#";
    link.className="delete-item";
    link.innerHTML="<i class = 'fa fa-remove'></i>";

    listItem.className="list-group-item d-flex justify-content-between";


    listItem.appendChild(document.createTextNode(newTodo));
    listItem.appendChild(link);
    todoList.appendChild(listItem);

    todoInput.value = "";
}