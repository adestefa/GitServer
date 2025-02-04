
/**
 * Local Storage Driver
 * Satori AI All rights reserved 2025
 * Author: Anthony DeStefano
 * Date: 2/3/2025
 * Descrption: Manage object state using local browser storage
 * Object serialization/deserialization using JSON
 * 
 * versions:
 * 0.0 : 2/3 - Happy Birthday
 * 0.1 : 2/3 - fixed pull bug
 * 0.2 : 2/3 - added test cases for reading writing
 * 0.3 : 2/3 - added ability to save/export chatGPT session as JSON string
 * 
 */




var LS = {

ver : "0.3",


read_ : function () {
    console.log("Satori:reading chatGPT session from local storage");
    var data = this.pull("gpt_session");
    console.log("Data found:");
    console.log(data);
},

// export chatGPT as JSON to local browser storage
save_ : function () {
    console.log("Satori::saving chatGPT session to local storage");

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
    console.log(jsonText);

    console.log("Saving to local storage..");
    this.push("gpt_session", jsonText);
    

   
},

// export chatGPT session as json file on local file system
exportJSON : function() {

    console.log("Satori::saveSession:");

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

},


push : function (key, data){
    console.log("Satori::LS::push: data stored as:" + key + " Data:" + data);
    this.storeJSON(key,data);
},
pull : function (key){
    console.log("Satori::LS::pull:" + key);
    return this.readJSON(key);
},

    /**
 * Stores a JSON object in local storage under the specified key.
 * @param {string} key - The key under which to store the JSON data.
 * @param {Object} data - The JSON object to store.
 */
 storeJSON : function(key, data) {
    try {
      // Convert the object to a JSON string before storing
      const jsonData = JSON.stringify(data);
      localStorage.setItem(key, jsonData);
      console.log(`Data successfully stored under key "${key}".`);
    } catch (error) {
      console.error("Error storing JSON in local storage:", error);
    }
  },
  
  /**
   * Reads a JSON object from local storage by the specified key.
   * @param {string} key - The key under which the JSON data is stored.
   * @returns {Object|null} The parsed JSON object, or null if not found or an error occurs.
   */
   readJSON : function(key) {
    try {
      const jsonData = localStorage.getItem(key);
      if (jsonData === null) {
        console.warn(`No data found under key "${key}".`);
        return null;
      }
      // Parse the JSON string back to an object
      return JSON.parse(jsonData);
    } catch (error) {
      console.error("Error reading JSON from local storage:", error);
      return null;
    }
  },



  run_tests : function() {
    var testJSON = {
            "list": [
                {
                    "name":"Anthony",
                    "role" : "CTO"
                }, 
                {
                    "name":"Rocco",
                     "role" : "CEO"
                },
                {
                    "name":"Khurrum",
                    "role" : "CFO"
                }
            ]
        }
    

    // write to local storage
    console.log("Test Case 1: Push data into Local Storage");
    LS.push("data", testJSON );

    // read from local storage
    console.log("Test Case 2: Pull data from local Stroate");
    var result = LS.pull("data");

    // print results
    console.log("RESULTS:");
    if (result.list[1].role === "CEO" ) {
        console.log("Test Case 1 - PASS");
        console.log("Test Case 2 - PASS");
    } else {
        console.log("Test Case 1 - FAIL");
        console.log("Test Case 2 - FAIL");
    }


  }
  
}