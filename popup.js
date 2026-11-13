const DEFAULTS=[{from:"Bridge",to:"Chocolate Milk",enabled:true},{from:"Car Park",to:"Fairy Floss",enabled:true},{from:"Car Parking",to:"Fairy Floss",enabled:true},{from:"Parking",to:"Fairy Floss",enabled:true}];
chrome.storage.sync.get(["mappings"],({mappings})=>{
  const list=(mappings&&mappings.length)?mappings:DEFAULTS;
  const el=document.getElementById("list");
  el.innerHTML=list.map((m,i)=>`<div class="item"><label><input type="checkbox" data-i="${i}" ${m.enabled!==false?"checked":""}> <b>${m.from}</b> → ${m.to}</label></div>`).join("");
  el.querySelectorAll("input").forEach(cb=>cb.onchange=async()=>{
    const {mappings}=await chrome.storage.sync.get(["mappings"]);
    const cur=(mappings&&mappings.length)?mappings:list;
    cur[+cb.dataset.i].enabled=cb.checked;
    await chrome.storage.sync.set({mappings:cur});
  });
});
document.getElementById("open").onclick=()=>chrome.runtime.openOptionsPage();