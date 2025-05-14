document.addEventListener('DOMContentLoaded', function() {
  // Initialize Feather icons
  feather.replace();
  
  // Theme toggle
  const themeToggle = document.getElementById('theme-toggle');
  const featherIcon = themeToggle.querySelector('i');
  
  themeToggle.addEventListener('click', function() {
    document.body.classList.toggle('dark-theme');
    
    if (document.body.classList.contains('dark-theme')) {
      featherIcon.setAttribute('data-feather', 'sun');
    } else {
      featherIcon.setAttribute('data-feather', 'moon');
    }
    
    feather.replace();
    
    // Save preference to localStorage
    localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
  });
  
  // Check for saved theme preference or prefer-color-scheme
  const savedTheme = localStorage.getItem('theme');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  
  if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches)) {
    document.body.classList.add('dark-theme');
    featherIcon.setAttribute('data-feather', 'sun');
    feather.replace();
  }
  
  // Tabs
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-pane');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabId = button.getAttribute('data-tab');
      
      // Update active button
      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Update active content
      tabContents.forEach(content => content.classList.remove('active'));
      document.getElementById(tabId).classList.add('active');
    });
  });
  
  // Documentation tabs
  const docLinks = document.querySelectorAll('.doc-link');
  const docSections = document.querySelectorAll('.doc-section');
  
  docLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      const sectionId = link.getAttribute('href').substring(1);
      
      // Update active link
      docLinks.forEach(docLink => docLink.classList.remove('active'));
      link.classList.add('active');
      
      // Update active section
      docSections.forEach(section => section.classList.remove('active'));
      document.getElementById(sectionId).classList.add('active');
    });
  });
  
  // Playground functionality
  const runCodeButton = document.getElementById('run-code');
  const playgroundOutput = document.getElementById('playground-output');
  const clearOutputButton = document.getElementById('clear-output');
  const examplesDropdown = document.getElementById('examples-dropdown');
  const playgroundEditor = document.getElementById('playground-editor');
  
  // Sample code examples
  const codeExamples = {
    hello: `// Un simple programme "Hello World" en NekoScript
neko = ("Bonjour, chat!");

// Déclarer une variable et l'afficher
monNom = "NekoScript";
neko = ("Je m'appelle " + monNom);

// Faire des calculs avec compteneko
compteneko = 5 plus 3;`,
    
    web: `// Exemple de création de site web en NekoScript
neksite.créer, script {
    contenu : ("Bienvenue sur mon site NekoScript!"),
    titre : "Mon Premier Site",
    lang : "fr",
    couleur-de-fond : "#f0f0f0",
    style {
        corps : "font-family: Arial, sans-serif",
        titres : "color: #333"
    }
    script {
        nekAfficher("Site chargé!");
    }
}`,
    
    game: `// Exemple de jeu simple en NekoScript
nekImporter("NekoGame");

joueur = nekCreerSprite("chat.png", 100, 300, 64, 64);
obstacle = nekCreerSprite("arbre.png", 500, 300, 100, 120);
score = 0;

nekJeu.chaqueTrame(function() {
    nekJeu.effacer();
    
    nekSi(nekClavier.toucheAppuyee("droite")) {
        joueur.x = joueur.x plus 5;
    }
    
    nekSi(nekDetecterCollision(joueur, obstacle)) {
        nekJeu.texte("Game Over!", 350, 300, "40px Arial", "#F00");
    }
});`
  };
  
  // Load example code
  examplesDropdown.addEventListener('change', function() {
    const selectedExample = this.value;
    if (selectedExample && codeExamples[selectedExample]) {
      playgroundEditor.querySelector('code').textContent = codeExamples[selectedExample];
    }
  });
  
  // Run code button
  runCodeButton.addEventListener('click', function() {
    // Clear previous output
    playgroundOutput.innerHTML = '';
    
    // Get code from editor
    const code = playgroundEditor.querySelector('code').textContent;
    
    // Simulate execution
    simulateNekoScriptExecution(code);
  });
  
  // Clear output button
  clearOutputButton.addEventListener('click', function() {
    playgroundOutput.innerHTML = '';
  });
  
  // Simulate NekoScript execution
  function simulateNekoScriptExecution(code) {
    // This is a simplified simulator for demo purposes
    const lines = code.split('\n');
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Simple parsing for demonstration
      if (trimmedLine.startsWith('neko = (')) {
        // Extract message between quotes
        const matches = trimmedLine.match(/neko = \("(.+?)"\);/);
        if (matches && matches[1]) {
          addOutputLine(matches[1]);
        }
      } else if (trimmedLine.startsWith('compteneko = ')) {
        // Extract calculation
        const calcMatch = trimmedLine.match(/compteneko = (\d+) (plus|moins|multiplier|diviser) (\d+);?/);
        if (calcMatch) {
          const num1 = parseInt(calcMatch[1]);
          const operator = calcMatch[2];
          const num2 = parseInt(calcMatch[3]);
          let result;
          
          switch (operator) {
            case 'plus':
              result = num1 + num2;
              break;
            case 'moins':
              result = num1 - num2;
              break;
            case 'multiplier':
              result = num1 * num2;
              break;
            case 'diviser':
              result = num1 / num2;
              break;
          }
          
          addOutputLine(result.toString());
        }
      } else if (trimmedLine.startsWith('nekAfficher(')) {
        // Extract message between quotes
        const matches = trimmedLine.match(/nekAfficher\("(.+?)"\);/);
        if (matches && matches[1]) {
          addOutputLine(matches[1]);
        }
      } else if (trimmedLine.startsWith('neksite.créer')) {
        addOutputLine('Site Web créé avec succès!');
      } else if (trimmedLine.startsWith('nekImporter')) {
        const matches = trimmedLine.match(/nekImporter\("(.+?)"\);/);
        if (matches && matches[1]) {
          addOutputLine(`Bibliothèque ${matches[1]} importée avec succès!`);
        }
      }
    }
  }
  
  // Add a line to the output
  function addOutputLine(text) {
    const line = document.createElement('div');
    line.className = 'output-line';
    line.textContent = text;
    playgroundOutput.appendChild(line);
  }
});
