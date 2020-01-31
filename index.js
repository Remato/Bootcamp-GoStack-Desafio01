const express = require('express');
const server = express();

server.use(express.json());

let requests = 0;

const projects = [
  {
    id: "0",
    title: "projeto 0",
    tasks: ["task0, task1, task2"]
  }
];

//-----------Middlewares-----------//
function checkProjectExist(req, res, next){
  const project = projects.find((element) => element.id == req.params.id);

  if(!project){
    return res.status(400).json({ error: "Project does not exist." });
  }

  return next();
}



server.use((req, res, next) =>{
  requests++;
  console.log(`Request numbers:[${requests}]`);
  next();
});


//-----------List projects-----------//
server.get('/projects', (req,res) =>{
  return res.json(projects);
});

//-----------Create projects-----------//
//add verification on midleware with (OR), to not duplicate projects 
server.post('/projects', (req,res) =>{
  const { id } = req.body;
  const { title } = req.body; 
  const { tasks } = req.body; 

  const project = projects.find((element) => element.id == id);
  
  if(project){
    return res.status(400).json({ error: "Project already exists." });
  }
  
  const newProject = {id, title, tasks};
  projects.push(newProject);

  return res.json(projects);
});

//-----------Update title project-----------//
server.put('/projects/:id', checkProjectExist, (req, res) =>{
  const { id } = req.params;
  const { title } = req.body;

  //find returns first element of array on satisfated.
  const project = projects.find(element => element.id == id);
  project.title = title;

  return res.json(projects);
  
});

//-----------Delete project-----------//
server.delete('/projects/:id', checkProjectExist, (req, res) =>{
  const { id } = req.params;

  //findIndex returns first index on satisfated..
  const index = projects.findIndex(element => element.id == id);

  projects.splice(index, 1);

  return res.send();
});

//-----------Add task-----------//
server.post('/projects/:id/tasks', checkProjectExist, (req, res) =>{
  const { id } = req.params;
  const { tasks } = req.body;

  const project = projects.find((element) => element.id == id);

  project.tasks.push(tasks);
  
  return res.json(projects);
});

server.listen(3000);