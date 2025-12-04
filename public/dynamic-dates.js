(function() {
  const updateContent = () => {
    const now = new Date();
    const currentMonth = now.toLocaleString('default', { month: 'long' });
    const nextDate = new Date();
    nextDate.setMonth(nextDate.getMonth() + 1);
    const nextMonth = nextDate.toLocaleString('default', { month: 'long' });
    const calendlyUrl = "https://calendly.com/betterstory-design/30min";

    // 1. FIX LINKS & BUTTON TEXT
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

      // Force Link Update
      const anchor = element.closest('a');
      if (anchor) {
          if (anchor.getAttribute('href') !== calendlyUrl) {
              anchor.setAttribute('href', calendlyUrl);
              anchor.setAttribute('target', '_blank');
          }
          // Remove conflicting event listeners (clone node trick) - optional but risky for SPA
          // Instead, let's just ensure the href is there.
      }

      // Determine desired text
      let targetMonth = null;
      let parent = element.parentElement;
      let steps = 0;
      while (parent && steps < 15) { // Increased steps
           const parentText = (parent.textContent || "").toLowerCase();
           if (parentText.includes("sprint") || parentText.includes("one-time")) {
               targetMonth = currentMonth;
               break;
           } else if (parentText.includes("retainer") || parentText.includes("monthly")) {
               targetMonth = nextMonth;
               break;
           }
           parent = parent.parentElement;
           steps++;
      }

      if (targetMonth) {
          const newText = `→ Book your ${targetMonth} slot \u26A1`; 
          if (textNode.nodeValue !== newText) {
              textNode.nodeValue = newText;
          }
      }
    });

    // 2. FIX TYPO IN FOOTER
    const typoWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    while(node = typoWalker.nextNode()) {
        // Check for specific typo "Stoiry"
        if (node.nodeValue.includes("Stoiry")) {
            node.nodeValue = node.nodeValue.replace("Stoiry", "Story");
        }
    }
  };

  // Run immediately
  updateContent();

  // Run on load
  window.addEventListener('load', updateContent);

  // Run periodically (legacy fallback)
  setInterval(updateContent, 500);

  // Run via MutationObserver (Robustness against React)
  const observer = new MutationObserver((mutations) => {
      // Simple debounce or just run it. Since it's lightweight, running it is fine.
      // But to avoid infinite loops if we change text, we must be careful.
      // The check `if (textNode.nodeValue !== newText)` prevents loops.
      updateContent();
  });

  observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
  });

})();
