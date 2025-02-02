/**
 *  ChatGPT Context Window
 *  Satori AI - All Rights Reserved. 2025
 *  Author: Anthony DeStefano
 *  Date: 2/1/2025
 *
 *  A simple browser plugin that adds a missing component to ChatGPT, a progress bar of the current
 *  chat session's context window size.
 *  - Use this progress bar to manage the running conversation's memory footprint.
 *  - Supports advanced prompt engineering, context window size includes response size and can
 *    greatly impact quality of response when limited.
 *  - Use this plugin to see the actual memory being used for a given session.
 *  
 *  LIMITATIONS: 
 *  - works with session history, run after your first resopnse
 *  - breaks on home page before session starts
 */
(function() {

  // 1. DOM Safe Wrapper Using XPath
  
  const xPath = '/html/body/div[1]/div/div[1]/div[2]/main/div[1]/div[1]/div/div/div/div/div/div[1]';
  const result = document.evaluate(xPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
  const targetElement = result.singleNodeValue;
  

  if (!targetElement) {
    console.log('No element found for the given XPath.');
    return;
  } else {
      console.log('Element found for progress bar insertion:', targetElement);
    
      const xBadPath = '/html/body/div[1]/div/div[1]/div[2]/main/div[1]/div[1]/div/div[2]/div/div/div/div[5]/div/ul/li[1]/button';
      const result2 = document.evaluate(xBadPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
      const badElement = result2.singleNodeValue;
      console.log("BAD ELEMENT:" + badElement);
      if (badElement === null) {
         console.log("Bad element not found")
      }else {
          console.log("Bad Element Found, exiting!");
          console.log("Satori Context Window Viewer can only run with a session history. Generate a response and try again.")
          alert("Satori Context Window Viewer: Warning, please load on a ChatGPT page with at least one response.");
          return;
      }   
  }

  // 2. Token Counter (TC) with Model Detection, Debounce, and Progress Bar
  const TC = {
    ver: "3.5",
    
    // Selectors and default settings
    promptSelector: '#prompt-textarea',
    responseSelector: '.markdown',
    modelSelector: 'span.text-token-text-secondary',
    progressBarId: 'token-progress-container',

    words: [],
    tokens: [],
    tokenLimit: 8192,
    updateInterval: 5000,



    init: function(containerElement) {

      // evaluate again when DOM is ready!
      const result = document.evaluate(xPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
      const targetElement = result.singleNodeValue;

      this.containerElement = containerElement;

      this.promptElement = document.querySelector(this.promptSelector);
      this.responseElements = document.querySelectorAll(this.responseSelector);

      if (this.promptElement) {
        this.promptElement.addEventListener('input', this.debounce(this.run.bind(this), 300));
      }

      this.createProgressBar();
      this.run();
      this.startAutoUpdate();
      this.setupModelObserver();
    },

    run: function() {
      this.words = [];
      this.tokens = [];

      let promptWords = 0, promptTokens = 0, responseTokens = 0;

      if (this.promptElement) {
        const promptText = this.promptElement.value || this.promptElement.innerText;
        promptWords = this.countWords(promptText);
        promptTokens = this.estimateTokens(promptWords);
      }

      this.responseElements = document.querySelectorAll(this.responseSelector);
      this.responseElements.forEach(response => {
        const wordsInResponse = this.countWords(response.innerText);
        responseTokens += this.estimateTokens(wordsInResponse);
      });

      const usedTokens = promptTokens + responseTokens;
      this.updateProgressBar(usedTokens, this.tokenLimit);
    },

    estimateTokens: function(wordCount) {
      return Math.round(wordCount * 1.33);
    },

    countWords: function(str) {
      str = str.trim();
      if (str === "") return 0;
      const words = str.match(/\b[A-Za-z0-9]+(?:['-][A-Za-z0-9]+)*\b/g);
      return words ? words.length : 0;
    },

    createProgressBar: function() {
      // Prevent multiple bars if it already exists
      if (document.getElementById(this.progressBarId)) return;

      // Outer container (positioning, size, etc.)
      this.progressContainer = document.createElement('div');
      this.progressContainer.id = this.progressBarId;

      // Apply Tailwind-like classes + inline style
      this.progressContainer.classList.add(
        'absolute',
        'start-1/2',
        'ltr:-translate-x-1/2',
        'rtl:translate-x-1/2'
      );
      Object.assign(this.progressContainer.style, {
        height: '100%',
        width: '100%'
      });

      // Inner container that holds the bar
      this.innerContainer = document.createElement('div');
      Object.assign(this.innerContainer.style, {
        width: '100%',
        height: '100%',
        backgroundColor: '#212121',
        color: '#ffffff',
        padding: '10px',
        borderBottom: '2px solid #333',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        fontFamily: 'Arial, sans-serif',
        fontSize: '14px'
      });

      // Progress bar background container
      this.progressBarBackground = document.createElement('div');
      Object.assign(this.progressBarBackground.style, {
        flexGrow: '1',
        height: '100%',
        backgroundColor: '#444',
        borderRadius: '5px',
        overflow: 'hidden',
        marginRight: '10px',
        display: 'flex',
        alignItems: 'center',
        position: 'relative'
      });

       // ** Added onclick event: When clicked, open http://cnn.com in a new tab **
       this.progressBarBackground.addEventListener('click', () => {
        window.open("https://adestefa.github.io/GitServer/", "_blank");
      });

      // Progress fill
      this.progressBarFill = document.createElement('div');
      Object.assign(this.progressBarFill.style, {
        width: '0%', // updated dynamically later
        height: '100%',
        backgroundColor: '#4caf50',
        transition: 'width 0.5s, background-color 0.5s'
      });
      this.progressBarBackground.appendChild(this.progressBarFill);

      // Token count text (now placed INSIDE the bar, replacing “Context Window”)
      this.progressText = document.createElement('span');
      Object.assign(this.progressText.style, {
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '14px',
        color: 'rgba(255, 255, 255, 0.8)', // a bit more visible than 0.3
        pointerEvents: 'none'
      });
      this.progressText.textContent = `0 / ${this.tokenLimit} tokens used`;
      this.progressBarBackground.appendChild(this.progressText);

      // Assemble the elements
      this.innerContainer.appendChild(this.progressBarBackground);
      this.progressContainer.appendChild(this.innerContainer);

      // Prepend the entire container to the target
      this.containerElement.prepend(this.progressContainer);

      // Optional styling adjustments to the target container:
      Object.assign(this.containerElement.style, {
        width: '50%',
        height: '80%'
      });
    },

    updateProgressBar: function(used, max) {
      let percentage = (used / max) * 100;
      if (percentage > 100) percentage = 100;
      this.progressBarFill.style.width = percentage + '%';

      // Updated color scaling based on usage
      if (percentage < 60) {
        this.progressBarFill.style.backgroundColor = '#4caf50';  // Green (Safe)
      } else if (percentage < 85) {
        this.progressBarFill.style.backgroundColor = '#ffcc00';  // Yellow (Caution)
      } else if (percentage < 95) {
        this.progressBarFill.style.backgroundColor = '#ff9800';  // Orange (Warning)
      } else {
        this.progressBarFill.style.backgroundColor = '#f44336';  // Red (Danger)
      }

      // Update the usage text (now inside the bar)
      this.progressText.textContent = `${used} / ${max} Tokens Used - Satori AI`;
      //console.log(`${used} / ${max} Tokens Used`);
    },

    startAutoUpdate: function() {
      setInterval(() => {
        this.run();
      }, this.updateInterval);
    },

    setupModelObserver: function() {
      const observer = new MutationObserver(() => {
        this.detectModelAndSetLimit();
      });
      observer.observe(document.body, { childList: true, subtree: true, characterData: true });
      this.detectModelAndSetLimit();
    },

    detectModelAndSetLimit: function() {
      const modelElements = document.querySelectorAll(this.modelSelector);

      if (modelElements.length > 1) {
        const modelName = modelElements[1].innerText.toLowerCase();
        console.log("Model found: " + modelName);

        const modelTokenMap = {
          '4o': 8192,
          '4o mini': 10000,
          'o3-mini-high': 74000,
          'o3-mini': 64000,
          'o1': 32000
        };

        let newTokenLimit = this.tokenLimit;
        for (const [model, limit] of Object.entries(modelTokenMap)) {
          if (modelName.includes(model.toLowerCase())) {
            console.log(modelName + " Found!");
            newTokenLimit = limit;
            break;
          }
        }

        if (newTokenLimit !== this.tokenLimit) {
          this.tokenLimit = newTokenLimit;
          this.updateProgressBarDisplay();
          this.run();
        }
      }
    },

    updateProgressBarDisplay: function() {
      // Reset the text display to show the updated token limit
      this.progressText.textContent = `0 / ${this.tokenLimit} tokens used`;
    },

    debounce: function(func, delay) {
      let debounceTimer;
      return (...args) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(this, args), delay);
      };
    }
  };
  
  TC.init(targetElement);

  

})();
