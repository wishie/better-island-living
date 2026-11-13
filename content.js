// Better Island Living v2 - configurable mappings from chrome.storage.sync
const DEFAULTS = [
  // enabled defaults to true - see normalize()
  { from: "Car Parking", to: "Fairy Floss", enabled: true },
  { from: "Car Park", to: "Fairy Floss", enabled: true },
  { from: "Parking", to: "Fairy Floss", enabled: true },
  { from: "Bridge", to: "Chocolate Milk", enabled: true }
];

let mappings = [...DEFAULTS];

function escapeRegExp(s){ return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

// Longest phrase first, so "Car Parking" wins over "Parking" / "Car Park"
function normalize(list){
  return (list||[]).map(m=>({from:(m.from||"").trim(), to:(m.to||"").trim(), enabled: m.enabled!==false}));
}
function sortedMappings(){
  return normalize(mappings).filter(m => m.from && m.to && m.enabled).sort((a,b)=> b.from.length - a.from.length);
}

function preserveCase(match, replacement){
  if (match === match.toUpperCase()) return replacement.toUpperCase();
  // Title Case: first letter of each word capitalised?
  const words = match.split(/\s+/);
  const allTitle = words.every(w => w[0] && w[0] === w[0].toUpperCase());
  if (allTitle) return replacement.replace(/\b\w/g, c => c.toUpperCase());
  if (match[0] === match[0].toUpperCase()) return replacement[0].toUpperCase() + replacement.slice(1);
  return replacement.toLowerCase ? replacement.charAt(0).toLowerCase() + replacement.slice(1) : replacement;
  // Note: replacement is stored as user typed it for Title/sentence case.
  // For lowercase match, use replacement as typed but lower first char is handled above.
}

function replaceText(str){
  let out = str;
  for (const m of sortedMappings()){
    // Match whole phrase, allow plural 's' on last word: e.g. Bridges, Car Parks
    const pattern = new RegExp("\\b" + escapeRegExp(m.from) + "s?\\b", "gi");
    out = out.replace(pattern, (match) => {
      let repl = m.to;
      const plural = match.toLowerCase().endsWith("s") && !m.from.toLowerCase().endsWith("s");
      if (plural) repl = repl + "s";
      // Case handling
      if (match === match.toUpperCase()) return repl.toUpperCase();
      if (match.split(/\s+/).every(w=>w[0]===w[0].toUpperCase())) return repl.replace(/\b\w/g, c=>c.toUpperCase());
      if (match[0]===match[0].toUpperCase()) return repl[0].toUpperCase()+repl.slice(1);
      return repl[0].toLowerCase()+repl.slice(1);
    });
  }
  return out;
}

function replaceInTextNode(node){
  if (!node.nodeValue || !/[A-Za-z]/.test(node.nodeValue)) return;
  const next = replaceText(node.nodeValue);
  if (next !== node.nodeValue) node.nodeValue = next;
}
function walk(node){
  if (node.nodeType===Node.TEXT_NODE) replaceInTextNode(node);
  else if (node.nodeType===Node.ELEMENT_NODE){
    const t=node.tagName;
    if (["SCRIPT","STYLE","TEXTAREA","INPUT","NOSCRIPT"].includes(t)) return;
    for (const c of node.childNodes) walk(c);
  }
}
function replaceAll(){
  if (!document.body) return;
  walk(document.body);
  if (document.title) document.title = replaceText(document.title);
}

async function load(){
  try{
    const data = await chrome.storage.sync.get(["mappings"]);
    if (Array.isArray(data.mappings) && data.mappings.length) mappings = normalize(data.mappings);
    else { mappings = [...DEFAULTS]; chrome.storage.sync.set({mappings}); }
  }catch(e){ mappings = [...DEFAULTS]; }
  replaceAll();
}
load();
chrome.storage.onChanged.addListener((changes, area)=>{
  if (area==="sync" && changes.mappings) { mappings = changes.mappings.newValue || DEFAULTS; replaceAll(); }
});
const observer = new MutationObserver((mutations)=>{
  for (const m of mutations){
    for (const n of m.addedNodes){ if (n.nodeType===Node.TEXT_NODE) replaceInTextNode(n); else if (n.nodeType===Node.ELEMENT_NODE) walk(n); }
    if (m.type==="characterData") replaceInTextNode(m.target);
  }
});
observer.observe(document.documentElement, {childList:true, subtree:true, characterData:true});