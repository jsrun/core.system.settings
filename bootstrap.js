/**
 *  __          __  _    _____ _____  ______    _____      _   _   _                 
 *  \ \        / / | |  |_   _|  __ \|  ____|  / ____|    | | | | (_)                
 *   \ \  /\  / /__| |__  | | | |  | | |__    | (___   ___| |_| |_ _ _ __   __ _ ___ 
 *    \ \/  \/ / _ \ '_ \ | | | |  | |  __|    \___ \ / _ \ __| __| | '_ \ / _` / __|
 *     \  /\  /  __/ |_) || |_| |__| | |____ _ ____) |  __/ |_| |_| | | | | (_| \__ \
 *      \/  \/ \___|_.__/_____|_____/|______(_)_____/ \___|\__|\__|_|_| |_|\__, |___/
 *                                                                          __/ |    
 *                                                                         |___/     
 *                                                                            
 *  @author André Ferreira <andrehrf@gmail.com>
 *  @license MIT
 */

"use strict";

let _ = require("lodash"),
    path = require("path"),
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
     * 
     * @param string key
     * @return mixed|null
     */
    get: function(key){
        return (this.has(key)) ? this.list[key] : null;
    },
    
    /**
     * Function to get user settings value
     * 
     * @param string|number _id
     * @return string 
     */
    getUser: function(_this, _id, key, defaultValue, cb){
        _this.mongodb.collection("users").findOne({_id: _id}, (err, result) => {
            try{
                for(let keyUserSettings in result.settings)
                    result.settings[keyUserSettings.replace(/_/img, ".")] = result.settings[keyUserSettings];
            
                
                if(typeof cb == "function")
                    cb((result.settings.theme) ? result.settings.theme : defaultValue, result.settings);
            }
            catch(e){ cb(defaultValue, null); }
        });
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
        
        this.set(key, defaultvalue);
        this.menu[group].itens[subgroup][key] = {
            description: description,
            type: type,
            defaultvalue: defaultvalue,
            customdisplay: customdisplay,
            onchange: onchange
        };
    },
    
    addAtomConfigSchema: function(configSchema, filename, ext, namespace){
        for(let key in configSchema){
            var options = null;

            switch(configSchema[key].type){
                case "string": 
                    if(typeof configSchema[key].enum == "object"){
                        options = "";

                        for(let keyEnum in configSchema[key].enum)
                            options += configSchema[key].enum[keyEnum]+":"+configSchema[key].enum[keyEnum]+"|";

                        options = options.substr(0, options.length-1);                                        
                        var type = "option"; 
                    }
                    else{
                        var type = "text"; 
                    }
                break;
                case "integer": var type = "number"; break;
                case "boolean": var type = "boolean"; break;
                default: var type = "text"; break;
            }    

            try{
                this.addSettingItem("Atom", path.basename(filename, ext), namespace + "." + key, configSchema[key].title, type, configSchema[key].default, options, "webide.atom.setAtomConfig");
            }
            catch(e) { console.log(e.message);  }
        }
    },
    
    /**
     * Module startup function
     * 
     * @param object app
     * @return this
     */
    bootstrap: function(_this){ 
        let __this = this;
        
        _this.settings.addSettingItem("WebIDE", "Theme", "theme", "WebIDE Theme", "option", "default", "default:Default|c9:Cloud9|light:Light", "webide.settings.setTheme");
        _this.settings.addSettingItem("WebIDE", "Theme", "ace.editor.theme", "Editor Theme", "option", "twilight", "ambiance:Ambiance|chaos:Chaos|chrome:Chrome|clouds:Clouds|clouds_midnight:Clouds Midnight|cobalt:Cobalt|crimson_editor:Crimson Editor|dawn:Dawn|dreamweaver:Dreamweaver|eclipse:Eclipse|github:Github|idle_fingers:idle Fingers|iplastic:IPlastic|katzenmilch:KatzenMilch|kr_theme:krTheme|kuroir:Kuroir|merbivore:Merbivore|merbivore_soft:Merbivore Soft|mono_industrial:Mono Industrial|monokai:Monokai|pastel_on_dark:Pastel on dark|solarized_dark:Solarized Dark|solarized_light:Solarized Light|sqlserver:SQL Server|terminal:Terminal|textmate:TextMate|tomorrow:Tomorrow|tomorrow_night:Tomorrow Night|tomorrow_night_blue:Tomorrow Night Blue|tomorrow_night_bright:Tomorrow Night Bright|tomorrow_night_eighties:Tomorrow Night 80s|twilight:Twilight|vibrant_ink:Vibrant Ink|xcode:XCode", "webide.settings.setAceEditorTheme");

        _this.navbar.addItem("Tools/Settings...", {
            onclick: "webide.tabs.add('Settings', '/settings', 'url', null, function(id){ webide.settings.setTab(id); })"
        }, 1000);
        
        _this.app.get("/settings", (req, res) => { 
            let _id = (req.user) ? req.user._id : 0;
            
            _this.mongodb.collection("users").findById(_id, function(err, user){
                let userSettings = {};
                
                if(user)
                    for(let keyUserSettings in user.settings)
                        userSettings[keyUserSettings.replace(/_/img, ".")] = user.settings[keyUserSettings];
                                                
                res.render(__dirname + "/template.ejs", {itens: __this.menu, settings: __this, userSettings: userSettings, __: _this.i18n.__}); 
            });
        });
        
        _this.app.post("/settings", (req, res) => {
            let set = {};
            set["settings." + req.body.key.replace(/\./img, "_")] = req.body.value;
            
            let _id = (req.user) ? req.user._id : 0;            
            _this.mongodb.collection("users").update({_id: _id}, {$set: set}, {upsert: true}, (err, result) => {
                if(err) res.status(500).send(err);             
                else res.status(204).send(result); 
            });
        });
        
        return this;
    },
    
    /**
     * Function to generate template
     * 
     * @param object _this
     * @return string
     */
    getTemplate: function(_this){
        return TemplateEngine(__dirname + "/map.ejs").seti18n(_this.i18n).render({settings: JSON.stringify(this.list)});
    }
};