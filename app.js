let state = JSON.parse(localStorage.getItem("ascend")) || {
  name:"You",
  level:1,
  xp:0,
  streak:0,
  lastDay:"",
  aiMode:"motivational",
  tasks:[],
  notes:[],
  nutritionLog:[],
  daily:{goal:3,progress:0},
  weekly:{goal:50,progress:0}
};

const XP_PER_LEVEL = 10;

/* NAV */
function go(p){
  document.querySelectorAll(".page").forEach(x=>x.classList.remove("active"));
  document.getElementById(p).classList.add("active");
}

/* TASKS */
if(state.tasks.length===0){
  const base=[
    "Make bed","Drink water","Walk 5k","Stretch","Read 10 pages",
    "Meditate","Journal","Gym","No junk food","Sleep early"
  ];
  for(let i=0;i<100;i++){
    state.tasks.push({
      name: base[i%base.length]+" "+(i+1),
      xp:1+(i%5),
      enabled:i<5
    });
  }
}

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
    b.onclick=()=>{t.enabled=!t.enabled;save();};
    taskLibrary.appendChild(b);
  });
}

function completeTask(task){
  updateStreak();
  const mult=getMultiplier(state.streak);
  state.xp+=Math.floor(task.xp*mult);
  state.daily.progress++;
  state.weekly.progress+=task.xp;
  checkLevel();
  save();
}

/* XP */
function checkLevel(){
  if(state.xp>=XP_PER_LEVEL){
    state.xp-=XP_PER_LEVEL;
    state.level++;
  }
}

/* STREAK */
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
function aiCoach(){
  alert(`Level ${state.level}, ${state.streak}-day streak. Keep momentum.`);
}

function sendChat(){
  const t=chatInput.value;
  if(!t) return;
  chatBox.innerHTML+=`<p><b>You:</b> ${t}</p>`;
  chatBox.innerHTML+=`<p><b>AI:</b> Consistency beats intensity.</p>`;
  chatInput.value="";
}

/* NUTRITION */
function analyzeFood(){
  alert("AI estimate: please confirm calories/macros manually.");
}
function saveNutrition(){
  state.nutritionLog.push({
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
}

function save(){
  localStorage.setItem("ascend",JSON.stringify(state));
  updateUI();
}

updateUI();
