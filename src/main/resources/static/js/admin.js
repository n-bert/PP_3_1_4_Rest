const adminTableActionsMap = new Map([["Edit", "btn-info"], ["Delete", "btn-danger"]]);
let formData = [
    {id: "id", type: "text", label: "ID"},
    {id: "firstName", type: "text", label: "First name"},
    {id: "lastName", type: "text", label: "Last name"},
    {id: "age", type: "number", label: "Age"},
    {id: "email", type: "email", label: "Email"},
    {id: "password", type: "password", label: "Password"}
]
const defaultForm = document.getElementById("defaultForm");
const defaultModal = document.getElementById("defaultModal");
const bsDefaultModal = new bootstrap.Modal(defaultModal);

const userFetchService = {
    head: {'Content-Type': 'application/json'},
    getAllRoles: async () => (await fetch("/api/roles")).json(),
    getAllUsers: async () => (await fetch("/api/users", {cache: "reload"})).json(),
    getUserById: async (id) => (await fetch(`/api/${id}`)).json(),
    addUser: async (user) => await fetch('/api/user', {method: "POST", headers: userFetchService.head, body: JSON.stringify(user)}),
    deleteUser: async (id) => await fetch(`/api/${id}/delete`, {method: "DELETE", headers: userFetchService.head}),
    editUser: async (id, user) => await fetch(`/api/${id}/edit`, {method: "PUT", headers: userFetchService.head, body: JSON.stringify(user)}),

}

async function generateAdminUserTable(table, users) {
     generateUserTable(table, users).then( usersTable => {
        let tblBody = usersTable.tBodies[0];
        for (let row of tblBody.rows) {
            for (let action of adminTableActionsMap.keys()) {
                let cell = row.insertCell();
                let btn = document.createElement("button");
                btn.setAttribute("class", "btn text-white " + adminTableActionsMap.get(action));
                if (action === "Edit") {
                    btn.setAttribute("data-action", "editUser");
                } else if (action === "Delete") {
                    btn.setAttribute("data-action", "deleteUser");
                }
                btn.setAttribute("data-user-id", row.getAttribute("data-user-id"));
                btn.addEventListener("click", showModal);

                let text = document.createTextNode(action);
                btn.appendChild(text);
                cell.appendChild(btn);
            }
        }
    })
}

function populateUserForm(type, action) {
    let clone = defaultForm.cloneNode(true);
    clone.setAttribute("id", type+"Form");

    if (action === "addUser") {
        clone.querySelector("label[for='id']").className += " " + "d-none";
        clone.querySelector("input[id='id']").className += " " + "d-none";
    } else if (action === "deleteUser") {
        clone.querySelector("label[for='password']").className += " " + "d-none";
        clone.querySelector("input[id='password']").className += " " + "d-none";
        clone.querySelectorAll("input").forEach(input => input.disabled = true);
        clone.querySelector("select").disabled = true;
    } else if (action === "editUser") {
        clone.querySelector("input[id='id']").disabled = true;
        clone.querySelector("input[id='password']").required = true;
    }

    for (let field in formData) {
        let labelElement = clone.querySelector("label[for=" + formData[field].id + "]");
        labelElement.setAttribute("for", type + formData[field].id);
        let inputElement = clone.querySelector("input[id=" + formData[field].id + "]");
        inputElement.setAttribute("id", type + formData[field].id);
    }

    userFetchService.getAllRoles().then(roles => {
        let roleSelector = clone.querySelector("select[name=roles]");
        roleSelector.setAttribute("size", "" + Object.keys(roles).length);
        roles.forEach(role => {
            let roleOption = document.createElement("option");
            roleOption.setAttribute("value", role.id);
            roleOption.setAttribute("name", role.name);
            let roleName = document.createTextNode(role.name.replace(/^ROLE_/, ""));
            roleOption.appendChild(roleName);
            roleSelector.appendChild(roleOption);
        });

        if (type === "newUser") {
            let addUserButton = clone.querySelector("input[type=submit]");
            addUserButton.addEventListener("click", handleNewUserSubmit);
            addUserButton.hidden = false;
        }
    });

    let formParent = document.querySelector("." + type + "Form");
    let form = formParent.querySelector("form");
    formParent.replaceChild(clone, form);
    clone.hidden = false;
}


async function getSubmitData(form) {
    const data = new FormData(form);
    const value = Object.fromEntries(data.entries());
    await userFetchService.getAllRoles().then(async roles => {
        let selectedRoles = [];
        for (let optionValue of data.getAll("roles")) {
            for (let i = 0; i < roles.length; i++) {
                if (Number(optionValue) === roles[i].id) {
                    selectedRoles.push({id: roles[i].id, name: roles[i].name});
                }
            }
        }
        value["roles"] = selectedRoles;
    })
    return value;
}

async function handleNewUserSubmit(event) {
    event.preventDefault();
    const submitData = await getSubmitData(event.target.form);
    const response = await userFetchService.addUser(submitData);
    if (response.ok) {
        userFetchService.getAllUsers().then(users => {
            generateAdminUserTable(usersTable, users);
            document.getElementById("nav-home-tab").click();
        })
        event.target.form.reset();
    }
}

async function handleEditUserSubmit(event) {
    event.preventDefault();
    let userId = event.target.getAttribute("data-user-id");
    const submitData = await getSubmitData(event.target.form);
    const response = await userFetchService.editUser(userId, submitData);
    if (response.ok){
        userFetchService.getAllUsers().then(users => {
            generateAdminUserTable(usersTable, users);
        })
        event.target.removeEventListener("click", handleEditUserSubmit);
        bsDefaultModal.hide();
        document.getElementById("defaultModalForm").reset();
    }
}

async function handleDeleteUserSubmit(event) {
    let userId = event.target.getAttribute("data-user-id");
    const response = await userFetchService.deleteUser(userId);
    if (response.ok) {
        userFetchService.getAllUsers().then(users => {
            generateAdminUserTable(usersTable, users);
        })
        event.target.removeEventListener("click", handleDeleteUserSubmit);
        bsDefaultModal.hide();
        document.getElementById("defaultModalForm").reset();
    }
}

async function showModal(event) {
    let action = event.target.getAttribute("data-action");
    let userId = event.target.getAttribute("data-user-id");
    let modalActionText;
    if (action === "editUser") {
        modalActionText = "Edit";
    } else if (action === "deleteUser") {
        modalActionText = "Delete";
    }
    defaultModal.querySelector(".modal-header").innerHTML = `<h4>${modalActionText} user</h4>`;

    populateUserForm("defaultModal", action, userId)

    let modalForm = defaultModal.querySelector("form");
    await userFetchService.getUserById(userId).then( user => {
        for (let field in formData) {
            if (formData[field].id !== "password") {
                let inputId = "defaultModal" + formData[field].id;
                let inputElement = modalForm.querySelector("input[id=" + inputId + "]");
                inputElement.setAttribute("value", user[formData[field].id]);
            }
        }
    })

    let footerActionButton = defaultModal.querySelector(".modal-footer input[type=submit]");
    if (action === "editUser") {
        footerActionButton.setAttribute("class", "btn btn-primary edit-btn");
    } else  if (action === "deleteUser") {
        footerActionButton.setAttribute("class", "btn btn-danger delete-btn");
    }
    footerActionButton.setAttribute("data-action", action);
    footerActionButton.setAttribute("data-user-id", userId);
    footerActionButton.setAttribute("value", modalActionText);
    if (action === "editUser") {
        footerActionButton.setAttribute("form", "defaultModalForm");
        footerActionButton.addEventListener("click", handleEditUserSubmit);
    }
    if (action === "deleteUser") {
        footerActionButton.setAttribute("form", "");
        footerActionButton.addEventListener("click", handleDeleteUserSubmit);
    }
    bsDefaultModal.show();
}

let usersTable = document.getElementById("usersTable");
userFetchService.getAllUsers().then(users => generateAdminUserTable(usersTable, users));
