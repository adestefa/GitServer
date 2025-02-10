
var EXPORT = {

    init : function() {

        console.log("Satori::EXPORT:init:");
    
        // 1) Prompt user for a session name
        sessionName = prompt("Enter session name for this ChatGPT session:");
        // 1) Prompt user for a session name
        sessionDesc = prompt("Enter session description for this ChatGPT session:");
    
        // 2) Collect ChatGPT data
        const prompts = document.querySelectorAll('.whitespace-pre-wrap');
        const responses = document.querySelectorAll('.markdown');
        const data_final = { session: [] };
    
        const len = Math.min(prompts.length, responses.length);
        for (let i = 0; i < len; i++) {
            // Use .innerText (or .textContent/innerHTML) as needed
            let promptText = prompts[i].innerText;
            let responseText = responses[i].innerText;
            data_final.session.push({
                prompt: promptText,
                response: responseText
            });
        }
    
        // 3) Add name field
        data_final.name = sessionName || "Untitled ChatGPT Session";
        data_final.desc = sessionDesc || "TBD";
    
        // 4) Add date field (formatted as YYYY:MM:DD:HH:MM)
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const hour = String(now.getHours()).padStart(2, "0");
        const minute = String(now.getMinutes()).padStart(2, "0");
        data_final.date = `${year}:${month}:${day}:${hour}:${minute}`;
    
        // 5) Convert object to JSON
        const jsonText = JSON.stringify(data_final, null, 2);
    
        // 6) Create a Blob and prompt file download
        const blob = new Blob([jsonText], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
    
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        // Optionally name the file using the session name
        a.download = (sessionName || "chat_export") + ".json"; 
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    
        console.log("[My ChatGPT Tools] File saved successfully!");
    
        }
}
