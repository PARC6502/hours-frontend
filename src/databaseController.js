// Mock database controller, will provide mock data to the app until real database is implememted
import { db } from "./firebase";

function createDatabase() {
  var projectsDb = [
    { id: "service-0", name: "Herbs", createdBy: "project-2", cost: 4 }
  ];

  var servicesDb = [
    { id: "service-0", name: "Herbs", createdBy: "project-2", cost: 4 },
    { id: "service-1", name: "Disco Rave", createdBy: "project-1", cost: 3 },
    {
      id: "service-2",
      name: "Rehearsal Session",
      createdBy: "project-3",
      cost: 2
    }
  ];

  function getUsers() {
    return db.getUsers();
  }

  function getUser(id) {
    return db.getUser(id);
  }

  function getProjects() {
    return projectsDb;
  }

  function getServices() {
    return servicesDb;
  }

  function sendHoursToUser(id, amount) {
    db.sendHoursToUser(id, amount);
  }

  function logHours(userId, projectId, hours) {
    const projectIndex = projectsDb.findIndex(p => p.id === projectId);
    const oldProject = projectsDb[projectIndex];
    const newProject = {
      ...oldProject,
      generatedHours: oldProject.hours + hours
    };
    projectsDb[projectIndex] = newProject;
    sendHoursToUser(userId, hours);
  }

  return {
    getUsers,
    getUser,
    getProjects,
    getServices,
    sendHoursToUser,
    logHours
  };
}

const databaseController = createDatabase();

export default databaseController;
