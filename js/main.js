const config1 = {
    parent: '#usersTable',
    columns: [
        {title: 'Имя', value: 'name'},
        {title: 'Фамилия', value: 'surname'},
        {title: 'Возраст', value: 'age'},
    ],
    // apiUrl: "https://mock-api.shpp.me/espiridonov/users",
};

const config2 = {
    parent: '#usersTable',
    columns: [
        {title: 'ID', value: 'id'},
        {title: 'Name', value: 'name'},
        {title: 'Surname', value: 'surname'},
        {title: 'Avatar', value: 'avatar'},
        {title: 'Birthday', value: 'birthday'},
    ],
    apiUrl: "https://mock-api.shpp.me/espiridonov/users",
}

const users = [
    {id: 30050, name: 'Вася', surname: 'Пупкин', age: 12},
    {id: 30051, name: 'Геннадий', surname: 'Василенко', age: 15},
    {id: 30052, name: 'Елисей', surname: 'Евдокимов', age: 19},
    {id: 30053, name: 'Зинаида', surname: 'Федотова', age: 48},
    {id: 30054, name: 'Таисия', surname: 'Алексеева', age: 25},
    {id: 30055, name: 'Ярослав', surname: 'Миклашевский', age: 30},
    {id: 30055, name: 'Цветелина', surname: 'Щербак', age: 17},
    {id: 30055, name: 'Шушана', surname: 'Трясило', age: 35},
    {id: 30055, name: 'Захар', surname: 'Игнатьев', age: 29},
];

let DATA_USERS = [];

let USER_TABLE = document.getElementById("usersTable")
    .appendChild(document.createElement("table"));
const HEAD = USER_TABLE.appendChild(document.createElement("thead"))
    .appendChild(document.createElement("tr"));
const BODY = USER_TABLE.appendChild(document.createElement("tbody"));;

function DataTable(config, data) {
    createTableHead(config)
    createTableBody(config, data)
    addButtonNewUser(config, data)
}

function getNextId(config) {
    return getRemoteUsers(config).then(users => {
        let IDs = []
        for (let user in users.data) {
            if (users.data.hasOwnProperty(user)) {
                IDs.push(users.data[user].id)
            }
        }
        return Math.max.apply(null, IDs) + 1;
    })
}

function createTableHead(config) {
    config.columns.forEach((attr) => {
        let column = document.createElement("th");
        column.innerHTML = attr.title;
        HEAD.appendChild(column);
    })
    let c = document.createElement("th");
    c.innerHTML = "Action";
    HEAD.appendChild(c);
}

function createTableBody(config, data) {
    if (data) {
        fillUpTableRow(config, data)
        // console.log("local users")
    } else if (config.apiUrl) {
        getRemoteUsers(config).then((value) => {
            console.log(value)
            for (let v in value.data) {
                let user = value.data[v]
                createTableRow(user, config)
            }
            // fillUpTableRow(config, value.data)
        });
    } else {
        console.error("users not found")
    }
}

function createTableRow(user, config) {
    let tr = document.createElement("tr")
    BODY.appendChild(tr)
    for (let i of config.columns) {
        // console.log(user[i.value])
        let td = document.createElement("td");
        td.innerHTML = user[i.value];
        tr.appendChild(td);
    }
    addButtonAction(tr, user["id"], config)
    BODY.appendChild(tr);
}

function fillUpTableRow(config, users) {
    for (let prop in users) {
        if (users.hasOwnProperty(prop)) {
            let tableRow = document.createElement("tr")
            BODY.appendChild(tableRow)
            for (let i of config.columns) {
                let td = document.createElement("td");
                td.innerHTML = users[prop][i.value];
                tableRow.appendChild(td);
            }
            addButtonAction(tableRow, users[prop]["id"], config);
        }
    }
}

function addButtonNewUser(config, data) {
    let inputButton = document.createElement("button");
    inputButton.classList.add("btn-add");
    inputButton.innerHTML = "New User";
    document.getElementsByClassName("container")[0].prepend(inputButton);


    inputButton.addEventListener("click", () => {

        let tr = document.createElement("tr");
        let isFilled = false
        for (let element of config.columns) {
            let td = document.createElement("td");
            if (element.value === "id") {
                tr.appendChild(td);
                continue;
            }

            let input = document.createElement("input")
            input.classList.add("input-field")
            input.name = element.value;
            if (element.value !== "birthday") {
                input.type = "text";
            } else {
                input.type = "date";
            }

            input.oninput = () => {
                input.value ? input.classList.add("filled") : input.classList.remove("filled");

                let currentFilledInputs = tr.getElementsByClassName("filled").length
                let totalInputs = tr.getElementsByTagName("input").length
                isFilled = totalInputs === currentFilledInputs;
                let button = tr.getElementsByTagName("button")[0];
                if (isFilled) {
                    button.parentElement.remove();
                    createButtonNewUserAdd(tr, config)
                } else {
                    button.parentElement.remove();
                    createButtonNewUserRemove(tr)
                }
            }
            td.appendChild(input)
            tr.appendChild(td);
        }
        createButtonNewUserRemove(tr);

        BODY.prepend(tr)
    })
}

function createButtonNewUserRemove(toElement) {
    let td = document.createElement("td");
    let button = document.createElement("button")
    button.classList.add("button-remove");
    button.innerHTML = "X";
    button.addEventListener("click", () => {
        toElement.remove()
    })
    td.appendChild(button)
    toElement.appendChild(td);
    return button;
}

function createButtonNewUserAdd(toElement, config) {
    let td = document.createElement("td");
    let button = document.createElement("button")
    button.classList.add("button-add")
    button.innerHTML = "V"
    button.addEventListener("click", () => {
        getNextId(config).then(id => {
            let newUser = {}
            let inputs = toElement.getElementsByTagName("input")
            for (let i = 0; i < inputs.length; i++) {
                newUser[inputs[i].name] = inputs[i].value;
            }
            newUser["id"] = id;
            // console.log(newUser)
            addNewUser(config.apiUrl, newUser).then(() => {
                toElement.remove();
                createTableRow(newUser, config)
            })
        })
    })
    td.appendChild(button)
    toElement.appendChild(td);
    return button;
}

function addButtonAction(toElement, id, config) {
    let td = document.createElement("td");
    let button = document.createElement("button");
    button.classList.add("btn-remove")
    button.innerHTML = "X";
    button.addEventListener("click", async () => {
        // alert("User ID: " + id + " url: " + user);
        const user = config.apiUrl + "/" + id;
        const response = await fetch(user, {method: "DELETE"})
        if (response.ok) {
            toElement.remove()
        }
    })
    td.appendChild(button)
    toElement.appendChild(td)
}

async function addNewUser(url, user) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {"Content-type": "application/json"},
        body: JSON.stringify(user)
    })
    if (response.ok) {
        return false;
    }
}

async function getRemoteUsers(config) {
    const response = await fetch(config.apiUrl);
    return await response.json();
}

DataTable(config2);
