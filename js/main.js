let userTable = document.getElementById("usersTable")
    .appendChild(document.createElement("table"));
const HEAD = userTable.appendChild(document.createElement("thead"))
    .appendChild(document.createElement("tr"));
const BODY = userTable
    .appendChild(document.createElement("tbody"));

function DataTable(config, data) {
    createTableHead(config)
    createTableBody(config, data)
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

function createTableRow() {
    let tableRow = document.createElement("tr")
    BODY.appendChild(tableRow)
    return tableRow;
}

function fillUpTableRow(configTable, users) {
    for (let prop in users) {
        if (users.hasOwnProperty(prop)) {
            let tableRow = createTableRow();
            for (let i of configTable.columns) {
                let td = document.createElement("td");
                td.innerHTML = users[prop][i.value];
                tableRow.appendChild(td);
            }
            addButtonRemove(tableRow, users[prop]["id"], configTable.apiUrl);
        }
    }
}

function addButtonRemove(toElement, id, url) {
    let td = document.createElement("td");
    let button = document.createElement("button");
    button.classList.add("btn-remove")
    button.innerHTML = "X";
    button.addEventListener("click", () => {
        deleteUser(id, url).then()
    })
    td.appendChild(button)
    toElement.appendChild(td)
}

function createTableBody(config, data) {
    if (data) {
        fillUpTableRow(config, data)
    } else if (config.apiUrl) {
        getRemoteUsers(config).then((value) => {
            console.log(value)
            fillUpTableRow(config, value.data)
        });
    } else {
        console.error("users not found")
    }
}

async function deleteUser(id, url) {
    const user = url + "/" + id;
    alert("User ID: " + id + " url: " + user);
    // const response = await fetch(user, {method: "DELETE"})
    // if (response.ok){
    //     createTableBody()
    // }
}

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

async function getRemoteUsers(config) {
    const response = await fetch(config.apiUrl);
    return await response.json();
}

DataTable(config2);
