const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./src/page-template.js");

// TODO: Write Code to gather information about
// the development team members
// and render the HTML file

const employees = [];
function initApp() {
  startHtml();
  addTeamMember();
}
function addTeamMember() {
  inquirer
    .prompt([
      {
        message: "Enter team member's name",
        name: "name",
      },
      {
        type: "list",
        message: "Choose team member's role",
        choices: ["Engineer", "Intern", "Manager"],
        name: "role",
      },
      {
        message: "Enter team member's id",
        name: "id",
      },
      {
        message: "Enter team member's email address",
        name: "email",
      },
    ])
    .then(function ({ name, role, id, email }) {
      let roleDetail = "";
      if (role === "Engineer") {
        roleDetail = "GitHub username";
      } else if (role === "Intern") {
        roleDetail = "school name";
      } else {
        roleDetail = "office phone number";
      }
      inquirer
        .prompt([
          {
            message: `Enter team member's ${roleDetail}`,
            name: "roleDetail",
          },
          {
            type: "list",
            message: "Do you want to add more team members?",
            choices: ["yes", "no"],
            name: "moreMembers",
          },
        ])
        .then(function ({ roleDetail, moreMembers }) {
          let newMember;
          if (role === "Engineer") {
            newMember = new Engineer(name, id, email, roleDetail);
          } else if (role === "Intern") {
            newMember = new Intern(name, id, email, roleDetail);
          } else {
            newMember = new Manager(name, id, email, roleDetail);
          }
          employees.push(newMember);
          addHtml(newMember).then(function () {
            if (moreMembers === "yes") {
              addMember();
            } else {
              finishHtml();
            }
          });
        });
    });
}
function renderHtml(memberArray) {
  startHtml();
  for (const member of memberArray) {
    addHtml(member);
  }
  finishHtml();
}
function startHtml() {
  const html = `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
      <title>Team Organizer</title>
  </head>
  <body>
      <nav class="navbar navbar-dark bg-dark mb-5">
          <span class="navbar-brand mb-0 h1 w-100 text-center">Team Organizer</span>
      </nav>
      <div class="container">
          <div class="row">`;
  fs.writeFile("./output/team.html", html, function (err) {
    if (err) {
      console.log(err);
    }
  });
  console.log("start");
}
function addHtml(member) {
  return new Promise(function (resolve, reject) {
    const name = member.getName();
    const role = member.getRole();
    const id = member.getId();
    const email = member.getEmail();
    let data = "";
    if (role === "Engineer") {
      const gitHub = member.getGithub();
      data = `<div class="col-6">
          <div class="card mx-auto mb-3" style="width: 18rem">
          <h5 class="card-header bg-secondary">${name}<br /><br />Engineer</h5>
          <ul class="list-group list-group-flush">
              <li class="list-group-item bg-light">ID: ${id}</li>
              <li class="list-group-item">Email Address: ${email}</li>
              <li class="list-group-item">GitHub: ${gitHub}</li>
          </ul>
          </div>
      </div>`;
    } else if (role === "Intern") {
      const school = member.getSchool();
      data = `<div class="col-6">
          <div class="card mx-auto mb-3" style="width: 18rem">
          <h5 class="card-header bg-secondary">${name}<br /><br />Intern</h5>
          <ul class="list-group list-group-flush">
              <li class="list-group-item bg-light">ID: ${id}</li>
              <li class="list-group-item">Email Address: ${email}</li>
              <li class="list-group-item">School: ${school}</li>
          </ul>
          </div>
      </div>`;
    } else {
      const officePhone = member.getOfficeNumber();
      data = `<div class="col-6">
          <div class="card mx-auto mb-3" style="width: 18rem">
          <h5 class="card-header bg-secondary">${name}<br /><br />Manager</h5>
          <ul class="list-group list-group-flush">
              <li class="list-group-item bg-light">ID: ${id}</li>
              <li class="list-group-item">Email Address: ${email}</li>
              <li class="list-group-item">Office Phone: ${officePhone}</li>
          </ul>
          </div>
      </div>`;
    }
    console.log("adding team member");
    fs.appendFile("./output/team.html", data, function (err) {
      if (err) {
        return reject(err);
      }
      return resolve();
    });
  });
}

function finishHtml() {
  const html = ` </div>
  </div>
  
</body>
</html>`;

  fs.appendFile("./output/team.html", html, function (err) {
    if (err) {
      console.log(err);
    }
  });
  console.log("end");
}

// addMember();
// startHtml();
// addHtml("hi")
// .then(function() {
// finishHtml();
// });
initApp();
