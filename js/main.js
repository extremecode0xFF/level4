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

let USER_TABLE = document.getElementById("usersTable")
    .appendChild(document.createElement("table"));
const HEAD = USER_TABLE.appendChild(document.createElement("thead"))
    .appendChild(document.createElement("tr"));
let BODY;
    // .appendChild(document.createElement("tbody"));

function DataTable(config, data) {
    createTableHead(config)
    createTableBody(config, data)
    addButtonNewUser(config,data)
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
    BODY = USER_TABLE.appendChild(document.createElement("tbody"));
    if (data) {
        // getRemoteUsers(config).then((value) => {
        //     console.log(value)
        //     console.log("remote users")
        //     fillUpTableRow(config, value.data)
        // });
        fillUpTableRow(config, data)
        console.log("local users")
    } else if (config.apiUrl) {
        getRemoteUsers(config).then((value) => {
            console.log(value)
            console.log("remote users")
            fillUpTableRow(config, value.data)
        });
    } else {
        console.error("users not found")
    }

}

function createTableRow() {
    let tableRow = document.createElement("tr")
    BODY.appendChild(tableRow)
    return tableRow;
}

function fillUpTableRow(config, users) {
    for (let prop in users) {
        if (users.hasOwnProperty(prop)) {
            let tableRow = createTableRow();
            for (let i of config.columns) {
                let td = document.createElement("td");
                td.innerHTML = users[prop][i.value];
                tableRow.appendChild(td);
            }
            addButtonRemove(tableRow, users[prop]["id"], config, users);
        }
    }
}

function addButtonNewUser(config, data){
    let inputButton = document.createElement("button");
    inputButton.classList.add("btn-add");
    inputButton.innerHTML = "+";
    document.body.prepend(inputButton);


    inputButton.addEventListener("click",()=>{
        let tr = document.createElement("tr");
        let isFilled = false
        for(let a of config.columns){
            let td = document.createElement("td");
            if(a.value === "id"){
                tr.appendChild(td);
                continue;
            }

            let input = document.createElement("input")
            input.classList.add("input-field")
            input.name = a.value;
            if(a.value !== "birthday") {
                input.type = "text";
            }else{
                input.type = "date";
            }
            input.addEventListener("focus",()=>{
                tr.classList.add("select-input")
            })
            input.addEventListener("focusout",()=>{
                tr.classList.remove("select-input")
            })
            input.oninput = ()=>{
                if(input.value){
                    input.style.borderColor = "limegreen"
                }else{
                    input.style.borderColor = "red"
                }

                let elements = tr.getElementsByTagName("input")
                for(let i = 0; i< elements.length;i++){
                    isFilled = elements[i].value
                    if(!isFilled) break;
                }

                let button = tr.lastChild.lastChild;
                if(isFilled){
                    console.log("filled")
                    button.innerHTML = "V"
                    button.style.backgroundColor = "limegreen"
                }else {
                    console.log("not filled")
                    button.innerHTML = "X"
                    button.style.backgroundColor = "orangered"
                }
            }
            td.appendChild(input)
            tr.appendChild(td);
        }
        let td = document.createElement("td");
        let buttonRemove = document.createElement("button")
        buttonRemove.classList.add("btn-remove");
        buttonRemove.innerHTML = "X";
        buttonRemove.addEventListener("click", ()=>{
            tr.remove()
        })
        td.appendChild(buttonRemove)
        tr.appendChild(td);
        BODY.prepend(tr)
    })

    if(data){

    }else if(config.apiUrl){

    }else{

    }
}

function addButtonRemove(toElement, id, config, users) {
    let td = document.createElement("td");
    let button = document.createElement("button");
    button.classList.add("btn-remove")
    button.innerHTML = "X";
    button.addEventListener("click",  async () => {
        // alert("User ID: " + id + " url: " + user);
        const user = config.apiUrl + "/" + id;
        // USER_TABLE.removeChild(USER_TABLE.lastChild); //solution 2

        const response = await fetch(user, {method: "DELETE"})
        if (response.ok){
            toElement.remove()//solution 1
            // createTableBody(config) //solution 2
        }
    })
    td.appendChild(button)
    toElement.appendChild(td)
}


async function getRemoteUsers(config) {
    const response = await fetch(config.apiUrl);
    return await response.json();
}

DataTable(config2);
