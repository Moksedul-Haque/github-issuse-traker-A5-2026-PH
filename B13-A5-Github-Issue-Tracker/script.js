

const loginBtn = document.getElementById("loginBtn");
const loginDiv = document.getElementById("loginDiv");
const todosSection = document.getElementById("todoSection");
const todoContainer = document.getElementById("todosContainer");
const mainDiv = document.getElementById("mainDiv");
const logiForm = document.getElementById("loginForm");

loginBtn.addEventListener("click", (e) => {

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username === "admin" && password === "admin123") {
        // Success
        mainDiv.classList.add("hidden");

        // show cards section
        todosSection.classList.remove("hidden");

        // load data
        loadTodo();
    } else {
        alert("Username or password incorrect"); // Error message
    }
});


const loadTodo = () => {
    const url = "https://phi-lab-server.vercel.app/api/v1/lab/issues";
    fetch(url)
        .then((res) => res.json())
        .then((data) => displayTodo(data.data))
}

console.log(loadTodo)

const displayTodo = (todos) => {
    const todoContainer = document.getElementById("todosContainer");
    todoContainer.innerHTML = "";

    todos.forEach(todo => {

        const div = document.createElement("div");
        div.classList = "bg-white p-4 rounded shadow mb-3";

        const dynamicButton = todo.labels.map((label) => {

            let colorClass = "";

            if (label === "bug") {
                colorClass = "bg-red-300 text-red-800";
            } else if (label === "enhancement") {
                colorClass = "bg-blue-300 text-blue-800";
            } else if (label === "documentation") {
                colorClass = "bg-green-300 text-green-800";
            } else if (label === "help wanted") {
                colorClass = "bg-yellow-300 text-yellow-800";
            } else {
                colorClass = "bg-gray-300 text-gray-800";
            };

            return `<button  class="${colorClass} btn m-1">${label}</button>`
        }).join(" ")

        div.innerHTML = `
              <div onclick="my_modal_4.showModal()"  class="  pt-3 ] rounded ">
                <div class="flex justify-between pb-5 ">
                    <div class=""><img class="w-10" src="./assets/Open-Status.png" alt=""></div>
                    <button class="btn bg-yellow-300 text-yellow-800">${todo.
                priority}</button>
                </div>
                <h2 class="font-bold text-2xl">${todo.title}</h2>
                <p>${todo.description}</p>
                <div class="btns pt-3 pb-6 block">
                 
                    <div>${dynamicButton}</div>
            
           
                </div>
                <div class="ml-5 pb-4">
                    <p class="">${todo.author
            }</p>
                    <p class="">${todo.
                updatedAt}</p>
                </div>



            </div>
        `;

        todoContainer.appendChild(div);
    });

};
loadTodo();



