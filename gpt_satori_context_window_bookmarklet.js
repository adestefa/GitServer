javascript:!function(){const e="/html/body/div[1]/div/div[1]/div[2]/main/div[1]/div[1]/div/div/div/div/div/div[1]",t=document.evaluate(e,document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;if(!t)return void console.log("No element found for the given XPath.");{console.log("Element found for progress bar insertion:",t);const e="/html/body/div[1]/div/div[1]/div[2]/main/div[1]/div[1]/div/div[2]/div/div/div/div[5]/div/ul/li[1]/button",n=document.evaluate(e,document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;if(console.log("BAD ELEMENT:"+n),null!==n)return console.log("Bad Element Found, exiting!"),console.log("Satori Context Window Viewer can only run with a session history. Generate a response and try again."),void alert("Satori Context Window Viewer: Warning, please load on a ChatGPT page with at least one response.");console.log("Bad element not found")}({ver:"3.0",promptSelector:"#prompt-textarea",responseSelector:".markdown",modelSelector:"span.text-token-text-secondary",progressBarId:"token-progress-container",words:[],tokens:[],tokenLimit:8192,updateInterval:5e3,init:function(t){document.evaluate(e,document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;this.containerElement=t,this.promptElement=document.querySelector(this.promptSelector),this.responseElements=document.querySelectorAll(this.responseSelector),this.promptElement&&this.promptElement.addEventListener("input",this.debounce(this.run.bind(this),300)),this.createProgressBar(),this.run(),this.startAutoUpdate(),this.setupModelObserver()},run:function(){this.words=[],this.tokens=[];let e=0,t=0,n=0;if(this.promptElement){const n=this.promptElement.value||this.promptElement.innerText;e=this.countWords(n),t=this.estimateTokens(e)}this.responseElements=document.querySelectorAll(this.responseSelector),this.responseElements.forEach((e=>{const t=this.countWords(e.innerText);n+=this.estimateTokens(t)}));const o=t+n;this.updateProgressBar(o,this.tokenLimit)},estimateTokens:function(e){return Math.round(1.33*e)},countWords:function(e){if(""===(e=e.trim()))return 0;const t=e.match(/\b[A-Za-z0-9]+(?:['-][A-Za-z0-9]+)*\b/g);return t?t.length:0},createProgressBar:function(){document.getElementById(this.progressBarId)||(this.progressContainer=document.createElement("div"),this.progressContainer.id=this.progressBarId,this.progressContainer.classList.add("absolute","start-1/2","ltr:-translate-x-1/2","rtl:translate-x-1/2"),Object.assign(this.progressContainer.style,{height:"100%",width:"100%"}),this.innerContainer=document.createElement("div"),Object.assign(this.innerContainer.style,{width:"100%",height:"100%",backgroundColor:"#212121",color:"#ffffff",padding:"10px",borderBottom:"2px solid #333",boxSizing:"border-box",display:"flex",alignItems:"center",fontFamily:"Arial, sans-serif",fontSize:"14px"}),this.progressBarBackground=document.createElement("div"),Object.assign(this.progressBarBackground.style,{flexGrow:"1",height:"100%",backgroundColor:"#444",borderRadius:"5px",overflow:"hidden",marginRight:"10px",display:"flex",alignItems:"center",position:"relative"}),this.progressBarFill=document.createElement("div"),Object.assign(this.progressBarFill.style,{width:"0%",height:"100%",backgroundColor:"#4caf50",transition:"width 0.5s, background-color 0.5s"}),this.progressBarBackground.appendChild(this.progressBarFill),this.progressText=document.createElement("span"),Object.assign(this.progressText.style,{position:"absolute",left:"50%",transform:"translateX(-50%)",fontSize:"14px",color:"rgba(255, 255, 255, 0.8)",pointerEvents:"none"}),this.progressText.textContent=`0 / ${this.tokenLimit} tokens used`,this.progressBarBackground.appendChild(this.progressText),this.innerContainer.appendChild(this.progressBarBackground),this.progressContainer.appendChild(this.innerContainer),this.containerElement.prepend(this.progressContainer),Object.assign(this.containerElement.style,{width:"50%",height:"80%"}))},updateProgressBar:function(e,t){let n=e/t*100;n>100&&(n=100),this.progressBarFill.style.width=n+"%",this.progressBarFill.style.backgroundColor=n<60?"#4caf50":n<85?"#ffcc00":n<95?"#ff9800":"#f44336",this.progressText.textContent=`${e} / ${t} Tokens Used - Satori AI`},startAutoUpdate:function(){setInterval((()=>{this.run()}),this.updateInterval)},setupModelObserver:function(){new MutationObserver((()=>{this.detectModelAndSetLimit()})).observe(document.body,{childList:!0,subtree:!0,characterData:!0}),this.detectModelAndSetLimit()},detectModelAndSetLimit:function(){const e=document.querySelectorAll(this.modelSelector);if(e.length>1){const t=e[1].innerText.toLowerCase();console.log("Model found: "+t);const n={"4o":8192,"4o mini":1e4,"o3-mini-high":74e3,"o3-mini":64e3,o1:32e3};let o=this.tokenLimit;for(const[e,s]of Object.entries(n))if(t.includes(e.toLowerCase())){console.log(t+" Found!"),o=s;break}o!==this.tokenLimit&&(this.tokenLimit=o,this.updateProgressBarDisplay(),this.run())}},updateProgressBarDisplay:function(){this.progressText.textContent=`0 / ${this.tokenLimit} tokens used`},debounce:function(e,t){let n;return(...o)=>{clearTimeout(n),n=setTimeout((()=>e.apply(this,o)),t)}}}).init(t)}();