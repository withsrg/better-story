(function() {
  const calendlyUrl = "https://calendly.com/betterstory-design/30min";
  let timeoutId = null;

  const updateContent = () => {
    const now = new Date();
    const currentMonth = now.toLocaleString('default', { month: 'long' });
    const nextDate = new Date();
    nextDate.setMonth(nextDate.getMonth() + 1);
    const nextMonth = nextDate.toLocaleString('default', { month: 'long' });

    // 1. FIX LINKS & BUTTON TEXT
    // Use TreeWalker to traverse text nodes efficiently.
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    let node;
    
    while(node = walker.nextNode()) {
      const val = node.nodeValue;
      // Fast check before more expensive operations
      // We look for "Book" (case insensitive) or "Stoiry" (typo)
      if (!val) continue;
      
      // Fix Typo: "Stoiry" -> "Story"
      if (val.includes("Stoiry")) {
          node.nodeValue = val.replace("Stoiry", "Story");
          continue; 
      }

      // Check for "Book your" pattern
      // Convert to lower case only if potential match to save CPU
      if (val.toLowerCase().includes('book your')) {
          const element = node.parentElement;
          if (!element) continue;

          // Force Link Update
          const anchor = element.closest('a');
          if (anchor) {
              if (anchor.getAttribute('href') !== calendlyUrl) {
                  anchor.setAttribute('href', calendlyUrl);
                  anchor.setAttribute('target', '_blank');
              }
              
              // Mobile Font Size Adjustment
              if (window.innerWidth < 768) {
                  anchor.style.fontSize = "18px";
              } else {
                  anchor.style.fontSize = "24px";
              }
          }

          // Determine desired text
          // Logic: "sprint"/"one-time" -> current month
          //        "retainer"/"monthly" -> next month
          
          let targetMonth = null;
          let parent = element.parentElement;
          let steps = 0;
          // Look up up to 15 levels to find context clues
          while (parent && steps < 15) { 
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
              // Only update if different to avoid infinite mutation loops
              if (node.nodeValue !== newText) {
                  node.nodeValue = newText;
              }
          }
      }
    }
  };

  const debouncedUpdate = () => {
      if (timeoutId) {
          clearTimeout(timeoutId);
      }
      // Debounce for 200ms to batch multiple mutations (e.g. React rendering)
      timeoutId = setTimeout(() => {
          updateContent();
          timeoutId = null;
      }, 200); 
  
  // Run on resize (for responsive font adjustment)
  window.addEventListener('resize', debouncedUpdate);
  };

  // Run immediately
  updateContent();

  // Run on load
  window.addEventListener('load', updateContent);

  // MutationObserver
  // Use a debounced observer instead of setInterval
  const observer = new MutationObserver((mutations) => {
      debouncedUpdate();
  });

  // Target #main if available, otherwise fallback to body
  // This helps ignore injections outside the main app container
  const targetNode = document.getElementById('main') || document.body;
  
  observer.observe(targetNode, {
      childList: true,
      subtree: true,
      characterData: true
  });

})();
