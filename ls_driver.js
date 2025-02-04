
/**
 * Local Storage Driver
 * Satori AI All rights reserved 2025
 * Author: Anthony DeStefano
 * Date: 2/3/2025
 * Descrption: Manage object state using local browser storage
 * Object serialization/deserialization using JSON
 * 
 * versions:
 * 0.1 : 2/3 - fixed pull bug
 * 
 * 
 * 
 */




var LS = {

ver : "0.1",

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
  }
  
}