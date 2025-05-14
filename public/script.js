document.addEventListener('DOMContentLoaded', function() {
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 70, // Offset for the fixed header
          behavior: 'smooth'
        });
      }
    });
  });

  // Code example highlighting
  const codeExamples = document.querySelectorAll('.code-example pre code');
  highlightNekoScriptCode(codeExamples);

  // Interactive demo in the hero section if present
  const demoContainer = document.getElementById('neko-live-demo');
  if (demoContainer) {
    initNekoScriptDemo(demoContainer);
  }

  // Add animation for feature cards
  const featureCards = document.querySelectorAll('.feature-card');
  animateOnScroll(featureCards, 'animate-fade-in');
});

function highlightNekoScriptCode(codeElements) {
  // Simple syntax highlighting for NekoScript
  codeElements.forEach(codeElement => {
    let content = codeElement.textContent;
    
    // Highlight keywords
    const keywords = ['neko', 'nekImporter', 'nek', 'plus', 'moins', 'multiplier', 'diviser', 'nekSi', 'nekSinon', 'nekSinonSi', 'nekBoucle', 'de', 'à', 'compteneko', 'est', 'estEgal', 'plusGrandQue', 'plusPetitQue', 'vrai', 'faux'];
    
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g');
      content = content.replace(regex, `<span class="keyword">${keyword}</span>`);
    });
    
    // Highlight strings
    content = content.replace(/"([^"]*)"/g, '<span class="string">"$1"</span>');
    
    // Highlight comments
    content = content.replace(/\/\/(.*)/g, '<span class="comment">// $1</span>');
    
    // Apply the highlighted HTML
    codeElement.innerHTML = content;
  });
}

function initNekoScriptDemo(container) {
  // Create elements for the demo
  const editorArea = document.createElement('div');
  editorArea.className = 'neko-editor';
  
  const codeTextarea = document.createElement('textarea');
  codeTextarea.placeholder = 'Écrivez votre code NekoScript ici...';
  codeTextarea.value = 'neko = ("Bonjour depuis NekoScript!");\nnom = "Chat";\nneko = ("Bonjour " + nom + "!");';
  
  const runButton = document.createElement('button');
  runButton.textContent = 'Exécuter';
  runButton.className = 'neko-run-button';
  
  const outputArea = document.createElement('div');
  outputArea.className = 'neko-output';
  
  // Append elements to container
  editorArea.appendChild(codeTextarea);
  container.appendChild(editorArea);
  container.appendChild(runButton);
  container.appendChild(outputArea);
  
  // Add event listener to the run button
  runButton.addEventListener('click', function() {
    simulateNekoScriptExecution(codeTextarea.value);
  });
  
  // Function to simulate NekoScript execution
  function simulateNekoScriptExecution(code) {
    outputArea.innerHTML = '';
    
    // Simple simulation of NekoScript execution
    const lines = code.split('\n');
    
    lines.forEach(line => {
      if (line.trim() === '') return;
      
      // Simulate print statements
      if (line.includes('neko = (')) {
        const match = line.match(/neko = \("(.*)"\);/);
        if (match && match[1]) {
          addOutputLine(match[1]);
        } else {
          // Handle string concatenation
          const concatMatch = line.match(/neko = \((.*)\);/);
          if (concatMatch && concatMatch[1]) {
            try {
              // This is a simplified evaluation and would be much more complex in a real interpreter
              const result = eval(concatMatch[1].replace(/\+/g, '+'));
              addOutputLine(result);
            } catch (e) {
              addOutputLine('Erreur: Expression non valide');
            }
          }
        }
      }
      
      // Add more simulations here for other NekoScript features
    });
    
    if (outputArea.innerHTML === '') {
      addOutputLine('Aucune sortie générée');
    }
  }
  
  function addOutputLine(text) {
    const line = document.createElement('div');
    line.textContent = text;
    line.className = 'output-line';
    outputArea.appendChild(line);
  }
}

function animateOnScroll(elements, animationClass) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add(animationClass);
      }
    });
  }, { threshold: 0.1 });
  
  elements.forEach(element => {
    observer.observe(element);
  });
}