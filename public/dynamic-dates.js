(function() {
  const updateButtons = () => {
    const now = new Date();
    const currentMonth = now.toLocaleString('default', { month: 'long' });
    const nextDate = new Date();
    nextDate.setMonth(nextDate.getMonth() + 1);
    const nextMonth = nextDate.toLocaleString('default', { month: 'long' });

    // Use TreeWalker to find text nodes containing "book your" (case-insensitive)
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    let node;
    const candidates = [];
    
    while(node = walker.nextNode()) {
      if (node.nodeValue.toLowerCase().includes('book your')) {
        candidates.push(node);
      }
    }

    candidates.forEach(textNode => {
      const element = textNode.parentElement;
      if (!element) return;

      // Check if we already updated it to avoid loops
      // The new text will start with "→" so we can check that
      if (element.textContent.trim().startsWith("→")) {
          // Already updated or matches pattern, check if month needs update
          // But we must ensure it matches the specific pattern we want
          if ((element.textContent.includes(currentMonth) || element.textContent.includes(nextMonth)) && element.textContent.includes("⚡")) {
              return; 
          }
      }

      // Traverse up to find context
      let parent = element.parentElement;
      let foundContext = false;
      let steps = 0;
      
      while (parent && steps < 10) {
           const parentText = (parent.textContent || "").toLowerCase();
           if (parentText.includes("sprint")) {
               const newText = `→ Book your ${currentMonth} slot \u26A1`; // Lightning bolt emoji
               if (element.textContent !== newText) {
                   element.textContent = newText;
               }
               foundContext = true;
               break;
           } else if (parentText.includes("retainer")) {
               const newText = `→ Book your ${nextMonth} slot \u26A1`; // Lightning bolt emoji
               if (element.textContent !== newText) {
                   element.textContent = newText;
               }
               foundContext = true;
               break;
           }
           parent = parent.parentElement;
           steps++;
      }
    });
  };

  window.addEventListener('load', updateButtons);
  setInterval(updateButtons, 500);
})();
