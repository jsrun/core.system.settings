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

(function(){
    webide.settings = {
        /**
         * Default values
         * @type object
         */
        map: {},
        
        /**
         * User values
         * @type object
         */
        usermap: {},
        
        /**
         * Function to set settings value
         * 
         * @param string key
         * @param mixed value
         * @return void
         */
        set: function(key, value){
            localStorage.setItem(key, value);
            webide.settings.usermap[key] = value;
            webide.send("/settings", {key: key, value: value});
        },
        
        /**
         * Function to associate existing map
         * 
         * @param object map
         * @return void
         */
        assignMap: function(mapname, map){
            for(var key in map){
                if(!this[mapname][key]){
                    this[mapname][key] = map[key];
                }
                else{
                    for(var key2 in map[mapname][key])
                        this.map[mapname][key][key2] = map[key][key2];
                }
            }
        },
        
        /**
         * Function to change WebIDE theme
         * 
         * @param string key
         * @param mixed value
         * @return void
         */
        setTheme: function(key, value){
            var now = new Date().getTime();
            webide.settings.set(key, value);
            $("#themestyle").attr("href", "./" + value + "/style.css?" + now);
        },
        
        /**
         * Function to get settings value
         * 
         * @param string key
         * @return mixed|null
         */
        get: function(key){
            return localStorage.getItem(key) || webide.settings.usermap[key] || webide.settings.map[key];
        },
        
        /**
         * Function to get all settings by regex pattern
         * 
         * @param RegExp regex
         * @return object
         */
        getByPattern: function(regex){
            var results = {};
            
            if(typeof regex.test == "function")
                for(var keylocalStorage in localStorage)
                    if(regex.test(keylocalStorage))
                        results[keylocalStorage] = localStorage[keylocalStorage];
                
            return results;
        },
        
        /**
         * Function to get all settings values
         * 
         * @return object
         */
        getAll: function(){
            return localStorage;
        },
        
        /**
         * Function to set settings tab
         * @param string id
         * @return void
         */
        setTab: function(id){
            $(".wi-settings-navbar-group").click(function(){
                //Submenu
                $(" .wi-settings-navbar-subgroup").css("display", "none");
                $(".wi-settings-navbar-subgroup", this).css("display", "block");
                
                //Collapse
                $(" .wi-settings-navbar-group-collapse i").removeClass("fa-caret-down").addClass("fa-caret-right");
                $(".wi-settings-navbar-group-collapse i", this).removeClass("fa-caret-right").addClass("fa-caret-down");
                
                //Contents
                $(" .wi-settings-contents-group-active").removeClass("wi-settings-contents-group-active");
                $($(this).attr("rel")).addClass("wi-settings-contents-group-active");
            });
            
            $(".wi-settings-navbar-link-anchor").click(function(e){
                e.preventDefault();            
                return false;
            });
            
            //Active first group
            $(".wi-settings-navbar-subgroup:first").css("display", "block");
            $(".wi-settings-navbar-group-collapse i:first").removeClass("fa-caret-right").addClass("fa-caret-down");
            $(".wi-settings-contents-group:first").addClass("wi-settings-contents-group-active");
        }
    };    
})();