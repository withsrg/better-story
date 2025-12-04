(function() {
  function updateButtons() {
    const now = new Date();
    const currentMonth = now.toLocaleString('default', { month: 'long' });
    
    const nextDate = new Date();
    nextDate.setMonth(nextDate.getMonth() + 1);
    const nextMonth = nextDate.toLocaleString('default', { month: 'long' });

    // Helper to find elements containing text
    // We look for specific text "Book your" to capture the buttons
    const findElements = (text) => {
      const xpath = `//*[contains(text(), '${text}')]`;
      const result = [];
      try {
        const nodes = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null);
        let node = nodes.iterateNext();
        while (node) {
          // Ensure we are targeting the leaf element containing the text
          if (node.children.length === 0) {
            result.push(node);
          }
          node = nodes.iterateNext();
        }
      } catch (e) {
        console.error("XPath error", e);
      }
      return result;
    };

    let buttons = findElements("Book your");

    buttons.forEach(btn => {
        let parent = btn.parentElement;
        let found = false;
        let steps = 0;
        // Traverse up to find context (Sprint or Retainer)
        while (parent && parent !== document.body && steps < 10 && !found) {
             const parentText = parent.textContent || "";
             
             if (parentText.includes("Sprint")) {
                 const newText = `Book your ${currentMonth} Slot`;
                 if (btn.textContent !== newText) {
                     btn.textContent = newText;
                 }
                 found = true;
             } else if (parentText.includes("Retainer")) {
                 const newText = `Book your ${nextMonth} Slot`;
                 if (btn.textContent !== newText) {
                     btn.textContent = newText;
                 }
                 found = true;
             }
             parent = parent.parentElement;
             steps++;
        }
        
        // Fallback based on order if context not found
        // Assuming first is Sprint, second is Retainer if we have exactly 2 match
        if (!found && buttons.length === 2) {
             if (btn === buttons[0]) {
                 const newText = `Book your ${currentMonth} Slot`;
                 if (btn.textContent !== newText) btn.textContent = newText;
             } else if (btn === buttons[1]) {
                 const newText = `Book your ${nextMonth} Slot`;
                 if (btn.textContent !== newText) btn.textContent = newText;
             }
        }
    });
  }

  // Run on load
  window.addEventListener('load', updateButtons);
  
  // Run periodically to handle hydration updates or client-side routing
  setInterval(updateButtons, 500);
})();
