const loginBtn = document.getElementById("loginBtn");
const todosSection = document.getElementById("todoSection");
const mainDiv = document.getElementById("mainDiv");


let openCount = 0;
let openedIds = [];
let allTodos = [];

loginBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username === "admin" && password === "admin123") {
        mainDiv.classList.add("hidden");
        todosSection.classList.remove("hidden");

        loadTodo();
    } else {
        alert("Username or password incorrect");
    }
});


const loadTodo = () => {
    fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
        .then(res => res.json())
        .then(data => {
            allTodos = data.data;
            displayTodo(allTodos);
            updateClosedCount();
        });
};


const handleSearch = () => {
    const query = document.getElementById("searchInput").value.trim();

    if (!query) {
        displayTodo(allTodos);
        return;
    }

    fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${query}`)
        .then(res => res.json())
        .then(data => {
            allTodos = data.data;


            openedIds = [];
            openCount = 0;
            document.getElementById("openCountBtn").innerText = `Open (0)`;

            displayTodo(allTodos);
            updateClosedCount();
        });
};


document.getElementById("searchBtn").addEventListener("click", handleSearch);
document.getElementById("searchInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleSearch();
});


document.getElementById("allBtn").addEventListener("click", () => {
    displayTodo(allTodos);
});

document.getElementById("openCountBtn").addEventListener("click", () => {
    const openTodos = allTodos.filter(todo => openedIds.includes(todo.id));
    displayTodo(openTodos);
});

document.getElementById("closedCountBtn").addEventListener("click", () => {
    const closedTodos = allTodos.filter(todo => !openedIds.includes(todo.id));
    displayTodo(closedTodos);
});

const loadModalDetails = async (id) => {
    const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`);
    const details = await res.json();

    displayModal(details.data);


    if (!openedIds.includes(id)) {
        openedIds.push(id);
        openCount++;
    }

    document.getElementById("openCountBtn").innerText = `Open (${openCount})`;

    updateClosedCount();

    document.getElementById("my_modal_4").showModal();
};


const updateClosedCount = () => {
    const closedCount = allTodos.length - openedIds.length;
    document.getElementById("closedCountBtn").innerText = `Closed (${closedCount})`;
};


const displayModal = (todo) => {
    const container = document.getElementById("modalContent");

    const labels = todo.labels.map(label =>
        `<button class="btn m-1">${label}</button>`
    ).join("");

    container.innerHTML = `
        <h3 class="text-2xl font-bold">${todo.title}</h3>

        <div class="flex gap-4 mt-3">
            <button class="btn bg-yellow-300">Opened</button>
            <p>${todo.author}</p>
            <p>${todo.updatedAt}</p>
        </div>

        <div class="mt-4">${labels}</div>

        <p class="mt-4">${todo.description}</p>

        <div class="flex justify-between mt-5">
            <div>
                <p>Assignee</p>
                <h4 class="font-bold">${todo.author}</h4>
            </div>
            <div>
                <p>Priority</p>
                <button class="btn bg-green-400">${todo.priority}</button>
            </div>
        </div>
    `;
};

const displayTodo = (todos) => {
    const container = document.getElementById("todosContainer");
    container.innerHTML = "";

    todos.forEach(todo => {
        const div = document.createElement("div");
        div.className = "bg-white p-4 rounded shadow";

        const labels = todo.labels.map(label => {
            let color = "bg-gray-300";

            if (label === "bug") color = "bg-red-300";
            else if (label === "enhancement") color = "bg-blue-300";
            else if (label === "documentation") color = "bg-green-300";
            else if (label === "help wanted") color = "bg-yellow-300";

            return `<button class="btn ${color} m-1">${label}</button>`;
        }).join("");

        div.innerHTML = `
            <div onclick="loadModalDetails(${todo.id})" class="cursor-pointer">
                <div class="flex justify-between">
                    <img class="w-8" src="./assets/Open-Status.png">
                    <button class="btn bg-yellow-300">${todo.priority}</button>
                </div>

                <h2 class="font-bold text-xl mt-2">${todo.title}</h2>
                <p>${todo.description}</p>

                <div class="mt-3">${labels}</div>

                <div class="mt-3 text-sm">
                    <p>${todo.author}</p>
                    <p>${todo.updatedAt}</p>
                </div>
            </div>
        `;

        container.appendChild(div);
    });
};