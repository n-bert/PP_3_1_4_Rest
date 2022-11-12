const userFields          = ["id", "firstName", "lastName", "age", "email", "roles"];

async function getCurrentUser() {
    const result = await fetch('/api/user');
    return await result.json();
}

async function fillHeader(user) {
    let userHeader = `<span class='fw-bold'>${user.email}</span> with roles: `;
    user.roles.forEach((role, index) => {
        userHeader += `<span>${role.name.replace("ROLE_", "")}</span>`;
        if (index !== user.roles.length - 1) {
            userHeader += " ";
        }
    });
    document.getElementById("headerUserInfo").innerHTML = userHeader;
}

async function generateUserTable(table, user) {
    let newTBody = document.createElement("tbody");
    for (let element of user) {
        let row = newTBody.insertRow();
        row.setAttribute("data-user-id", element.id);
        for (let key of userFields) {
            let cell = row.insertCell();
            let text;
            if (key === "roles") {
                let roles = [];
                element[key].forEach(role => {
                    roles.push(role.name.replace(/^ROLE_/, ""));
                });
                text = document.createTextNode(roles.join(" "));
            } else {
                text = document.createTextNode(element[key]);
            }
            cell.appendChild(text);
        }
    }
    table.replaceChild(newTBody, table.tBodies[0]);
    return table;
}

let userTable = document.getElementById("userTable");
getCurrentUser().then(user => fillHeader(user));
getCurrentUser().then(user => generateUserTable(userTable, Array.of(user)));