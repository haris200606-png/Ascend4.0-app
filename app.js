const XP_PER_LEVEL = 10;

let state = JSON.parse(localStorage.getItem("ascend")) || {
  name:"You",
  level:1,
  xp:0,
  streak:0,
  lastDay:"",
  aiMode:"motivational",
  tasks:[],
  notes:[],
  nutrition:[],
  daily:{goal:3,progress:0},
  weekly:{goal:50,progress:0}
};

/* NAV */
function go(id){
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

/* TASKS INIT (100) */
if(state.tasks.length===0){
  const categories=[
    "Make bed","Drink water","Walk 5k","Walk 10k","Gym",
    "Stretch","Meditate","Read 10 pages","Read 30 pages",
    "Study 1h","Study 2h","Journal","Cold shower","Sleep early",
    "No junk food","No social media","Clean room","Plan tomorrow",
    "Gratitude","Skill practice"
  ];
  for(let i=0;i<100;i++){
    state.tasks.push({
      name:categories[i%categories.length]+" #"+(i+1),
      xp:1+(i%5),
      enabled:i<5
    });
  }
}

/* TASK RENDER */
function renderTasks(){
  taskList.innerHTML="";
  state.tasks.filter(t=>t.enabled).forEach(t=>{
    const b=document.createElement("button");
    b.textContent=`${t.name} (+${t.xp})`;
    b.onclick=()=>completeTask(t);
    taskList.appendChild(b);
  });
}

function renderLibrary(){
  taskLibrary.innerHTML="";
  state.tasks.forEach(t=>{
    const b=document.createElement("button");
    b.textContent=`${t.enabled?"✓ ":""}${t.name}`;
    b.onclick=()=>{t.enabled=!t.enabled; save();};
    taskLibrary.appendChild(b);
  });
}

/* XP + STREAK */
function completeTask(task){
  updateStreak();
  const mult=getMultiplier(state.streak);
  state.xp+=Math.floor(task.xp*mult);
  state.daily.progress++;
  state.weekly.progress+=task.xp;
  if(state.xp>=XP_PER_LEVEL){
    state.xp-=XP_PER_LEVEL;
    state.level++;
  }
  save();
}

function updateStreak(){
  const today=new Date().toDateString();
  if(state.lastDay!==today){
    state.streak++;
    state.lastDay=today;
  }
}

function getMultiplier(s){
  if(s>=14) return 2;
  if(s>=7) return 1.5;
  if(s>=3) return 1.2;
  return 1;
}

/* AI */
function sendChat(){
  const text=chatInput.value;
  if(!text) return;
  chatBox.innerHTML+=`<p><b>You:</b> ${text}</p>`;
  chatBox.innerHTML+=`<p><b>AI:</b> You're level ${state.level}, streak ${state.streak}. Stay consistent.</p>`;
  chatInput.value="";
}

/* FOOD AI (SAFE CLIENT MODE) */
function analyzeFood(){
  alert("AI detected food. Please confirm calories & macros.");
}

/* NUTRITION */
function saveNutrition(){
  state.nutrition.push({
    calories:+calories.value||0,
    protein:+protein.value||0
  });
  nutritionSummary.textContent="Saved!";
  save();
}

/* NOTES */
function addNote(){
  if(!noteInput.value) return;
  state.notes.unshift({text:noteInput.value,date:new Date().toLocaleString()});
  noteInput.value="";
  save();
}

function renderNotes(){
  notesList.innerHTML="";
  state.notes.forEach(n=>{
    const d=document.createElement("div");
    d.className="note-card";
    d.innerHTML=`<p>${n.text}</p><small>${n.date}</small>`;
    notesList.appendChild(d);
  });
}

/* SETTINGS */
function saveName(){
  state.name=nameInput.value||state.name;
  save();
}
function setAI(m){ state.aiMode=m; save(); }

/* STATS */
function drawCharts(){
  const c1=document.getElementById("xpChart").getContext("2d");
  c1.clearRect(0,0,300,200);
  c1.fillStyle="#facc15";
  c1.fillRect(20,180-state.level*5,40,state.level*5);
}

/* UI */
function updateUI(){
  username.textContent=state.name;
  level.textContent=state.level;
  xpFill.style.width=`${(state.xp/XP_PER_LEVEL)*100}%`;
  streak.textContent=`🔥 ${state.streak} day streak`;
  dailyText.textContent=`${state.daily.progress}/${state.daily.goal}`;
  weeklyText.textContent=`${state.weekly.progress}/${state.weekly.goal}`;
  renderTasks();
  renderLibrary();
  renderNotes();
  drawCharts();
}

function save(){
  localStorage.setItem("ascend",JSON.stringify(state));
  updateUI();
}

updateUI();
