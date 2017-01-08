/**
 *  __          __  _    _____ _____  ______ 
 *  \ \        / / | |  |_   _|  __ \|  ____|
 *   \ \  /\  / /__| |__  | | | |  | | |__   
 *    \ \/  \/ / _ \ '_ \ | | | |  | |  __|  
 *     \  /\  /  __/ |_) || |_| |__| | |____ 
 *      \/  \/ \___|_.__/_____|_____/|______|
 *                                                                            
 *  @author André Ferreira <andrehrf@gmail.com>
 *  @license MIT
 */

"use strict";

let _ = require("lodash"),
    TemplateEngine = require("../wi.core.template.js");

module.exports = {
    /**
     * List of settings
     * @type object
     */
    list: {},
    
    /**
     * List of settings menu custom
     * @type object
     */
    menu: {},
    
    /**
     * List module assets
     * @type object
     */
    assets: {
        css: [__dirname + "/wi.core.settings.style.css"],
        js: [__dirname + "/wi.core.settings.events.js"]
    },
    
    /**
     * Function to set settings value
     * @param string key
     * @param mixed value
     * @return this
     */
    set: function(key, value){
        if(typeof key == "string")
            this.list[key] = value;
        else
            throw new SystemException("The default value for key settings items is 'string'.");
        
        return this;
    },
    
    /**
     * Function to check for settings
     * 
     * @param string key
     * @return boolean
     */
    has: function(key){
        return (this.list[key]);
    },
    
    /**
     * Function to get settings value
     * @param string key
     * @return mixed|null
     */
    get: function(key){
        return (this.has(key)) ? this.list[key] : null;
    },
    
    /**
     * Function to set setting item to setting window
     * 
     * @param string group
     * @param string subgroup
     * @param string key
     * @param string description
     * @param string type
     * @param mixed defaultvalue
     * @param function customdisplay
     * @return void
     */
    addSettingItem: function(group, subgroup, key, description, type, defaultvalue, customdisplay, onchange){
        if(typeof this.menu[group] !== "object")
            this.menu[group] = {itens: {}};
        
        if(typeof this.menu[group].itens[subgroup] !== "object")
            this.menu[group].itens[subgroup] = {};
        
        this.menu[group].itens[subgroup][key] = {
            description: description,
            type: type,
            defaultvalue: defaultvalue,
            customdisplay: customdisplay,
            onchange: onchange
        };
    },
    
    /**
     * Module startup function
     * 
     * @param object app
     * @return this
     */
    bootstrap: function(_this){ 
        let __this = this;
        
        _this.app.get("/settings", (req, res) => { 
            _this.mongodb.collection("users").findById(req.user._id, function(err, user){
                let userSettings = {};
                
                for(let keyUserSettings in user.settings)
                    userSettings[keyUserSettings.replace(/_/img, ".")] = user.settings[keyUserSettings];
                                                
                res.render(__dirname + "/wi.core.settings.tpl.ejs", {itens: __this.menu, settings: __this, userSettings: userSettings, __: _this.i18n.__}); 
            });
        });
        
        _this.app.post("/settings", (req, res) => {
            let set = {};
            set["settings." + req.body.key.replace(/\./img, "_")] = req.body.value;
            
            _this.mongodb.collection("users").update({_id: req.user._id}, {$set: set}, (err, result) => {
                if(err) res.status(500).send(err);             
                else res.status(204).send(result); 
            });
        });
        
        return this;
    }
};