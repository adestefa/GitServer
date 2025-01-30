// TOKEN COUNTER WITH FLOATING PROGRESS BAR

(function() {
        var TC = {
            ver: "3.0",
            p: null,
            r: document.querySelectorAll('.markdown'),
            w: [],
            t: [],
            l: 0,
            limit: 8192,
            interval: 5000,
    
            init: function() {
                this.p = document.getElementById('prompt-textarea');
                this.r = document.querySelectorAll('.markdown');
                this.l = Math.min(this.p ? 1 : 0, this.r.length);
    
                if (this.p) {
                    this.p.addEventListener('input', this.run.bind(this));
                }
    
                this.createPB();
                this.run();
                this.startAutoUpdate();
            },
    
            run: function() {
                this.w = [];
                this.t = [];
                var pw = 0, rw = 0, pt = 0, rt = 0;
    
                if (this.p) {
                    var a = this.countWords(this.p.innerText);
                    pw += a;
                    this.w.push(a);
    
                    var c = this.estimateTokens(a);
                    pt += c;
                    this.t.push(c);
                }
    
                for (var i = 0; i < this.r.length; i++) {
                    var b = this.countWords(this.r[i].innerText);
                    rw += b;
                    this.w.push(b);
    
                    var d = this.estimateTokens(b);
                    rt += d;
                    this.t.push(d);
                }
    
                var f = {
                    prompts: { words: pw, tokens: pt },
                    responses: { words: rw, tokens: rt },
                    totals: { words: (pw + rw), tokens: (pt + rt), maxresponse: 0 }
                };
    
                f.totals.maxresponse = this.limit - f.totals.tokens;
                this.updatePB(f.totals.tokens, f.totals.maxresponse);
            },
    
            estimateTokens: function(c) {
                return Math.round(c * 1.33);
            },
    
            countWords: function(s) {
                s = s.trim();
                if (s === "") return 0;
                var w = s.match(/\b[A-Za-z0-9]+(?:['-][A-Za-z0-9]+)*\b/g);
                return w ? w.length : 0;
            },
    
            createPB: function() {
                this.c = document.createElement('div');
                this.c.id = 'token-pb';
    
                Object.assign(this.c.style, {
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    width: '250px',
                    padding: '10px',
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    color: '#fff',
                    borderRadius: '8px',
                    fontFamily: 'Arial,sans-serif',
                    fontSize: '14px',
                    zIndex: '10000',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                });
    
                var t = document.createElement('div');
                t.innerText = 'Context Window';
                Object.assign(t.style, {
                    marginBottom: '8px',
                    fontWeight: 'bold'
                });
                this.c.appendChild(t);
    
                this.bg = document.createElement('div');
                Object.assign(this.bg.style, {
                    width: '100%',
                    height: '20px',
                    backgroundColor: '#ddd',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    marginBottom: '8px'
                });
                this.c.appendChild(this.bg);
    
                this.f = document.createElement('div');
                Object.assign(this.f.style, {
                    height: '100%',
                    width: '0%',
                    backgroundColor: '#4caf50',
                    borderRadius: '10px 0 0 10px',
                    transition: 'width 0.5s ease'
                });
                this.bg.appendChild(this.f);
    
                this.txt = document.createElement('div');
                this.txt.innerText = "0/" + this.limit + " tokens";
                Object.assign(this.txt.style, {
                    fontSize: '12px'
                });
                this.c.appendChild(this.txt);
    
                document.body.appendChild(this.c);
            },
    
            updatePB: function(u, r) {
                var p = (u / this.limit) * 100;
                if (p > 100) p = 100;
    
                this.f.style.width = p + "%";
    
                if (p < 50) {
                    this.f.style.backgroundColor = "#4caf50"; // Green
                } else if (p < 80) {
                    this.f.style.backgroundColor = "#ff9800"; // Orange
                } else {
                    this.f.style.backgroundColor = "#f44336"; // Red
                }
    
                this.txt.innerText = u + " / " + this.limit + " tokens";
            },
    
            startAutoUpdate: function() {
                setInterval(() => {
                    this.run();
                }, this.interval);
            }
        };
    
        TC.init();
    })();

