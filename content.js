function replaceInTextNode(node) {
  const original = node.nodeValue;
  if (!original || !/bridge/i.test(original)) return;
  // Preserve case: Bridge -> Chocolate Milk, BRIDGE -> CHOCOLATE MILK, bridge -> chocolate milk
  const replaced = original.replace(/\bbridge\b/gi, (match) => {
    if (match === match.toUpperCase()) return "CHOCOLATE MILK";
    if (match[0] === match[0].toUpperCase()) return "Chocolate Milk";
    return "chocolate milk";
  });
  // Also handle plural: bridges -> chocolate milks
  const final = replaced.replace(/\bbridges\b/gi, (match) => {
    if (match === match.toUpperCase()) return "CHOCOLATE MILKS";
    if (match[0] === match[0].toUpperCase()) return "Chocolate Milks";
    return "chocolate milks";
  });
  // Note: order matters - do bridges first ideally, redo correctly:
  // Re-run from original to avoid double-replace issues
  let correct = original.replace(/\bbridges\b/gi, (match) => {
    if (match === match.toUpperCase()) return "CHOCOLATE MILKS";
    if (match[0] === match[0].toUpperCase()) return "Chocolate Milks";
    return "chocolate milks";
  }).replace(/\bbridge\b/gi, (match) => {
    if (match === match.toUpperCase()) return "CHOCOLATE MILK";
    if (match[0] === match[0].toUpperCase()) return "Chocolate Milk";
    return "chocolate milk";
  });
  if (correct !== original) node.nodeValue = correct;
}

function walk(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    replaceInTextNode(node);
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    const tag = node.tagName;
    if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'TEXTAREA' || tag === 'INPUT') return;
    for (const child of node.childNodes) walk(child);
  }
}

function replaceAll() {
  walk(document.body);
  // Also fix titles / attributes people actually see
  if (document.title && /bridge/i.test(document.title)) {
    document.title = document.title.replace(/\bbridges\b/gi, "chocolate milks").replace(/\bbridge\b/gi, "chocolate milk");
  }
}

// Run on load
replaceAll();

// Watch for dynamic content (infinite scroll, SPAs, etc.)
const observer = new MutationObserver((mutations) => {
  for (const m of mutations) {
    for (const node of m.addedNodes) {
      if (node.nodeType === Node.TEXT_NODE) replaceInTextNode(node);
      else if (node.nodeType === Node.ELEMENT_NODE) walk(node);
    }
    if (m.type === 'characterData') replaceInTextNode(m.target);
  }
});

observer.observe(document.documentElement, {
  childList: true,
  subtree: true,
  characterData: true
});