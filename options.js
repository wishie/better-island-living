const DEFAULTS=[
 {from:"Bridge",to:"Chocolate Milk",enabled:true},
 {from:"Car Park",to:"Fairy Floss",enabled:true},
 {from:"Car Parking",to:"Fairy Floss",enabled:true},
 {from:"Parking",to:"Fairy Floss",enabled:true},
];
function rowHTML(m={from:"",to:""}){
  const d=document.createElement("div"); d.className="row";
  d.innerHTML=`<label class="toggle" title="On / off"><input type="checkbox" class="enabled" checked><span class="slider"></span></label><input class="from" placeholder="Find… e.g. Bridge" value=""><span class="arrow">→</span><input class="to" placeholder="Replace with… e.g. Chocolate Milk" value=""><button class="remove">✕</button>`;
  d.querySelector(".from").value=m.from; d.querySelector(".to").value=m.to;
  d.querySelector(".enabled").checked = m.enabled!==false;
  d.querySelector(".enabled").onchange=(e)=>{ d.classList.toggle("off", !e.target.checked); };
  if (m.enabled===false) d.classList.add("off");
  d.querySelector(".remove").onclick=()=>d.remove();
  return d;
}
async function load(){
  const data=await chrome.storage.sync.get(["mappings"]);
  const list=(Array.isArray(data.mappings)&&data.mappings.length)?data.mappings:DEFAULTS;
  const rows=document.getElementById("rows"); rows.innerHTML="";
  list.forEach(m=>rows.appendChild(rowHTML(m)));
}
function collect(){ return [...document.querySelectorAll(".row")].map(r=>({from:r.querySelector(".from").value.trim(),to:r.querySelector(".to").value.trim(),enabled:r.querySelector(".enabled").checked})).filter(m=>m.from&&m.to); }
document.getElementById("add").onclick=()=>document.getElementById("rows").appendChild(rowHTML());
document.getElementById("save").onclick=async()=>{ const mappings=collect(); await chrome.storage.sync.set({mappings}); const s=document.getElementById("status"); s.textContent="Saved ✓"; setTimeout(()=>s.textContent="",2000); };
document.getElementById("reset").onclick=async()=>{ await chrome.storage.sync.set({mappings:DEFAULTS}); load(); const s=document.getElementById("status"); s.textContent="Reset to defaults"; setTimeout(()=>s.textContent="",2000); };
load();