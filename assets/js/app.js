const cl = console.log;
const form = document.getElementById("form");
const todoControl = document.getElementById("todo");
const spinner = document.getElementById("spinner");
const list = document.getElementById("list");
const submitBtn = document.getElementById("submitBtn");
const updateBtn = document.getElementById("updateBtn");

//URL
let BASE_URL = "https://fetch-api-crud-e52ad-default-rtdb.asia-southeast1.firebasedatabase.app";
let TODO_URL = `${BASE_URL}/todos.json`;

//functions
function hideShowSpinner() {
  spinner.classList.toggle("d-none");
}

function snakBar(msg, icon) {
  Swal.fire({
    title: msg,
    icon: icon,
    timer: 3000,
  });
}

let state = {
  todoArr: [],
  editId: null,
};
//read 
function showUi(arr) {
  hideShowSpinner();
  fetch(TODO_URL, {
    method: "GET",
    body: null,
    headers: {
      "content-type": "application/json",
      authorization: "token JWT"
    }
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      cl(data);
      for (const key in data) {
        data[key].id = key;
        state.todoArr.push(data[key]);
        // cl(state.todoArr);
        templeting(state.todoArr);
      }

    })
    .catch(() => {
      snakBar("something went wrong.");
    })
    .finally(() => {
      hideShowSpinner();
    })
}
//templeting
function templeting(arr) {
  let result = ``;
  arr.forEach(ele => {
    result += `<li class="list-group-item d-flex justify-content-between" id="${ele.id}">
                      <strong>${ele.todoItem}</strong>
                       <div >
                        <button class="btn btn-sm"><i onclick="onEdit(this)" class="fa-solid fa-pen-to-square fa-2x text-primary editBtn" role="button"></i></button>
                        <button class="btn btn-sm deleteBtn" onclick="onRemove(this)"><i class="fa-solid fa-trash fa-2x text-danger"></i></button>
                       </div>
                    </li> `
    list.innerHTML = result;
  });
}
showUi()
//create
function onAddTodo(eve) {
  eve.preventDefault();
  let newObj = {
    todoItem: todoControl.value
  }
  hideShowSpinner()
  fetch(TODO_URL, {
    method: "POST",
    body: JSON.stringify(newObj),
    headers: {
      "content-type": "application/json",
      authorization: "token JWT"
    }
  })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      cl(res);
      newObj.id = res.name;
      state.todoArr.push(newObj);
      let li = document.createElement("li");
      li.id = res.name;
      li.className = "list-group-item d-flex justify-content-between";
      li.innerHTML = ` 
                      <strong>${newObj.todoItem}</strong>
                       <div >
                        <button class="btn btn-sm"><i onclick="onEdit(this)" class="fa-solid fa-pen-to-square fa-2x text-primary editBtn" role="button"></i></button>
                        <button class="btn btn-sm deleteBtn" onclick="onRemove(this)"><i class="fa-solid fa-trash fa-2x text-danger"></i></button>
                       </div>
                    `
      list.append(li);
      snakBar("add todo successfully");
      form.reset();
    })
    .catch(() => {
      snakBar("something went wrong")
    })
    .finally((res) => {
      hideShowSpinner()
    })
}

//edit 
function onEdit(ele) {
  const allDeleteBtns = document.querySelectorAll(".deleteBtn");

  allDeleteBtns.forEach(btn => {
    btn.disabled = false;
    btn.classList.remove("disabled");
  });

  let edit_id = ele.closest("li").id;
  state.editId = edit_id;
  let edit_url = `${BASE_URL}/todos/${edit_id}.json`
  hideShowSpinner()
  fetch(edit_url, {
    method: "GET",
    body: null,
    headers: {
      "content-type": "application/json",
      "security": "JWT TOKEN",
    }
  })
    .then((res) => {
      return res.json()
    })
    .then((data) => {
      cl(data);
      todoControl.value = data.todoItem;
      submitBtn.classList.add("d-none");
      updateBtn.classList.remove("d-none");


      const li = ele.closest("li");
      const deleteBtn = li.querySelector(".deleteBtn");
      deleteBtn.disabled = true;
      deleteBtn.classList.add("disabled");

    })
    .catch((err) => {
      cl("Something went wrong")
    })
    .finally(() => {
      hideShowSpinner();
    })

}
//update 
function onUpdate(eve) {
  let UPDATE_ID = state.editId;
  UPDATE_URL = `${BASE_URL}/todos/${UPDATE_ID}.json`
  let updateObj = {
    todoItem: todoControl.value,
  };
  hideShowSpinner()
  fetch(UPDATE_URL, {
    method: "PATCH",
    body: JSON.stringify(updateObj),
    headers: {
      "content-type": "application/json",
    }
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      cl(data);
      updateObj.id = UPDATE_ID;
      let index = state.todoArr.findIndex((todo) => todo.id === UPDATE_ID);
      state.todoArr[index] = updateObj;
      let li = document.getElementById(UPDATE_ID);
      li.querySelector("strong").innerText = updateObj.todoItem;
      form.reset();
      updateBtn.classList.add("d-none");
      submitBtn.classList.remove("d-none");
      snakBar("update todo successfully", "success");
      const liElement = document.getElementById(UPDATE_ID);
      const deleteBtn = liElement.querySelector(".deleteBtn");
      deleteBtn.disabled = false;
      deleteBtn.classList.remove("disabled");
    })
    .catch((err) => {
      cl("something went wrong")
    })
    .finally(() => {
      hideShowSpinner()
    })
}

//delete 
function onRemove(ele) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
  }).then((result) => {
    if (result.isConfirmed) {

      let Remove_id = ele.closest("li").id;
      let remove_url = `${BASE_URL}/todos/${Remove_id}.json`
      hideShowSpinner();
      fetch(remove_url, {
        method: "DELETE",
        body: null,
        "content-type": "application/json",
        "security": "JWT TOKEN",
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          cl(data);
          let index = state.todoArr.findIndex((todo) => todo.id === Remove_id);
          state.todoArr.splice(index, 1);
          let li = document.getElementById(Remove_id);
          li.remove();
          snakBar("delete todo successfully", "success");

        })
        .catch((err) => {
          snakBar("something went wrong")
        })
        .finally(() => {
          hideShowSpinner();
        })
      Swal.fire({
        title: "Deleted!",
        text: "Your file has been deleted.",
        icon: "success"
      });
    }
  })
}

updateBtn.addEventListener("click", onUpdate);
form.addEventListener("submit", onAddTodo);


