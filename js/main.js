function DataTable(config, data) {
    let table = document.createElement("table");
    let thead = document.createElement("thead");
    let tbody = document.createElement("tbody");
    let tr = document.createElement("tr");

    let usersTable = document.getElementById("usersTable");
    let readyTable = usersTable.appendChild(table);

    let head = readyTable.appendChild(thead).appendChild(tr);
    config.columns.forEach((attr) => {
        let column = document.createElement("th");
        column.innerHTML = attr.title;
        head.appendChild(column);
    })
    let c = document.createElement("th");
    c.innerHTML = "Action";
    head.appendChild(c);

    let body = readyTable.appendChild(tbody);

    loadDataUsers(config,data,body)

}

function loadDataUsers(config,data,body){
    if (data) {
        data.forEach((attr) => {
            let tr = document.createElement("tr");
            body.appendChild(tr);

            for (let i of config.columns) {
                let td = document.createElement("td");
                td.innerHTML = attr[i.value];
                tr.appendChild(td);
            }
        })
    } else if (config.apiUrl) {
        getUsers(config).then((value) => {
            console.log(value)
            for (let prop in value.data) {
                if(value.data.hasOwnProperty(prop)) {
                    let tr = document.createElement("tr");
                    body.appendChild(tr);

                    for (let i of config.columns) {
                        let td = document.createElement("td");
                        td.innerHTML = value.data[prop][i.value];
                        tr.appendChild(td);
                    }
                    addButtonRemove(tr, value.data[prop]["id"]);
                }
            }
        });
    } else{
        console.log("users not found")
    }
}

function addButtonRemove(toElement,id){
    let td = document.createElement("td");
    let button = document.createElement("button");
    button.classList.add("btn-remove")
    button.innerHTML = "X";
    button.addEventListener("click",function (){
        alert("User ID: " + id);
    })
    td.appendChild(button)
    toElement.appendChild(td)
}

function getIDUserAfterClickRemove(){
    let elements = document.getElementsByClassName("btn-remove");
    for(let i = 0; i<elements.length;i++){
        console.log(elements[i])
    }
}

const config1 = {
    parent: '#usersTable',
    columns: [
        {title: 'Имя', value: 'name'},
        {title: 'Фамилия', value: 'surname'},
        {title: 'Возраст', value: 'age'},
    ],
    apiUrl: "http://mock-api.shpp.me/espiridonov/users",
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
    apiUrl: "http://mock-api.shpp.me/espiridonov/users",
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

async function getUsers(config) {
    const response = await fetch(config.apiUrl);
    return await response.json();
}

DataTable(config2);
