// Mock database controller, will provide mock data to the app until real database is implememted

function createDatabase() {
	var usersDb = [
		{id:"louis.koseda", name:"Louis Koseda", hours: 21}, 
		{id:"james.rogers", name:"James Rogers", hours: 5}, 
		{id:"luke.cornwell", name:"Luke Cornwell", hours: 7}, 
		{id:"ibby.serafy", name:"Ibby Serafy", hours: 2}, 
		{id:"louise.delmege", name:"Louise Delmege", hours: 9},
		{id:"isaac.tendler", name:"Isaac Tendler", hours: 15},
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

	function getUser(id) {
		return usersDb.find(user => user.id === id);
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
		sendHoursToUser(userId, hours);
	}

	return {
		getUsers,
		getUser,
		getProjects,
		getServices,
		sendHoursToUser,
		logHours,
	}
}

const databaseController = createDatabase();

export default databaseController;