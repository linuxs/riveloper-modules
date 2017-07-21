/* global Module */

/* Magic Mirror
 * Module: Ads
 *
 * By Austin Sweat
 * MIT Licensed.
 */

Module.register("MMM-Ads", {

    requiresVersion: "2.1.0",
    debug: true,

    ads: [ 'images/ad1.jpg', 'images/ad2.jpg', 'images/ad3.jpg' ],

    // Define start sequence.
    start: function() {
        Log.info("Starting module: " + this.name);
    },

    resume: function() {
      return this.getDom();
    },

    interval: undefined,

    // Override dom generator.
    getDom: function() {
        var self = this;

        var wrapper = document.createElement("div");
        if (self.hide){
          return wrapper;
        }

        if ((document.getElementById('ad_img_')) == null){
          var img = document.createElement("img");
          img.id = 'ad_img_';
        }else{
          var img = document.getElementById("ad_img_");
        }

        if (img.src == this.ads[0]){
          img.src = this.ads[1];
        }else{
          img.src = this.ads[0];
        }

        if (this.interval == undefined){
          this.interval = setInterval(function(){
            self.updateDom();
          }, 5000);
        }

        wrapper.appendChild(img);
        return wrapper;
    },

    sendAction(description) {
        this.sendNotification(description.notification, description.payload);
    },

    // Override socket notification handler.
    socketNotificationReceived: function(notification, payload) {
        console.log(notification);
        console.log(payload);
    },

    hide: false,

    notificationReceived: function(notification, payload, sender) {
        var self = this;

        if (notification == 'REMOTE_ACTION'){
          if (payload.currentMenu != 'timer'){
            self.hide = true;
            self.updateDom();
          }else{
            self.hide = false;
            self.updateDom();
          }
        }
    }
});
