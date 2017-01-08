/**
 * Frontend settings events
 * 
 * @author André Ferreira <andrehrf@gmail.com>
 * @license MIT
 */

(function(){
    webide.settings = {
        /**
         * Function to set settings value
         * 
         * @param string key
         * @param mixed value
         * @return void
         */
        set: function(key, value){
            localStorage.setItem(key, value);
            webide.send("/settings", {key: key, value: value});
        },
        
        /**
         * Function to get settings value
         * 
         * @param string key
         * @return mixed|null
         */
        get: function(key){
            return localStorage.getItem(key);
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
            $("#" + id + " .wi-settings-navbar-group").click(function(){
                //Submenu
                $("#" + id + " .wi-settings-navbar-subgroup").css("display", "none");
                $(".wi-settings-navbar-subgroup", this).css("display", "block");
                
                //Collapse
                $("#" + id + " .wi-settings-navbar-group-collapse i").removeClass("fa-caret-down").addClass("fa-caret-right");
                $(".wi-settings-navbar-group-collapse i", this).removeClass("fa-caret-right").addClass("fa-caret-down");
                
                //Contents
                $("#" + id + " .wi-settings-contents-group-active").removeClass("wi-settings-contents-group-active");
                $($(this).attr("rel")).addClass("wi-settings-contents-group-active");
            });
            
            $("#" + id + " .wi-settings-navbar-link-anchor").click(function(e){
                e.preventDefault();
                $("#" + id + " .wi-settings-contents-group-active").mCustomScrollbar("scrollTo", $.attr(this, 'href'));                
                return false;
            });
            
            //Active first group
            $("#" + id + " .wi-settings-navbar-subgroup:first").css("display", "block");
            $("#" + id + " .wi-settings-navbar-group-collapse i:first").removeClass("fa-caret-right").addClass("fa-caret-down");
            $("#" + id + " .wi-settings-contents-group:first").addClass("wi-settings-contents-group-active");
        }
    };    
})();