// Mock database controller, will provide mock data to the app until real database is implememted

function databaseController() {
	var usersDb = [
		{id:0, name:"Louis Koseda", hours: 10}, 
		{id:1, name:"James Rogers", hours: 5}, 
		{id:2, name:"Luke Cornwell", hours: 7}, 
		{id:3, name:"Ibby Serafy", hours: 2}, 
		{id:4, name:"Louise Delmege", hours: 9},
	];

	var projectsDb = [
		{id: 'project-0', name: "Foodhall: Cafe", recievedHours: 20, generatedHours: 218},
		{id: 'project-1', name: "Foodhall: Lates", recievedHours: 50, generatedHours: 87},
		{id: 'project-2', name: "Foodhall: Garden", recievedHours: 0, generatedHours: 39},
		{id: 'project-3', name: "Cellar @ Dina", recievedHours: 4, generatedHours: 43},
	];

	var servicesDb = [
		{id: 'service-0', name: "Herbs", createdBy: "project-2", cost: 1},
		{id: 'service-1', name: "Disco Rave", createdBy: "project-1", cost: 3},
		{id: 'service-2', name: "Rehearsal Session", createdBy: "project-3", cost: 2},
	];

	function getUsers() {
		return usersDb;
	}

	function getProjects() {
		return projectsDb;
	}

	function getServices() {
		return servicesDb;
	}

	function sendHoursToUser(id, hours) {
		const userIndex = usersDb.findIndex(u => u.id === id);
		const oldUser = usersDb[userIndex];
		const newUser = {
			...oldUser,
			hours: oldUser.hours + hours,
		};
		usersDb[userIndex] = newUser;
	}

	function logHours(userId, projectId, hours) {
		const projectIndex = projectsDb.findIndex(p => p.id === projectId);
		const oldProject = projectsDb[projectIndex];
		const newProject = {
			...oldProject,
			generatedHours: oldProject.hours + hours,
		};
		projectsDb[projectIndex] = newProject;
		sendHourToUser(userId, hours);
	}

	return {
		getUsers,
		getProjects,
		getServices,
		sendHoursToUser,
		logHours,
	}
}

export default databaseController;