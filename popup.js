const DEFAULTS=[{from:"Bridge",to:"Chocolate Milk"},{from:"Car Park",to:"Fairy Floss"},{from:"Car Parking",to:"Fairy Floss"},{from:"Parking",to:"Fairy Floss"}];
chrome.storage.sync.get(["mappings"],({mappings})=>{
  const list=(mappings&&mappings.length)?mappings:DEFAULTS;
  document.getElementById("list").innerHTML=list.map(m=>`<div class="item"><b>${m.from}</b> → ${m.to}</div>`).join("");
});
document.getElementById("open").onclick=()=>chrome.runtime.openOptionsPage();