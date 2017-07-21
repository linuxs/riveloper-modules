/* global Module */

/* Magic Mirror
 * Module: Ads
 *
 * By Austin Sweat
 * MIT Licensed.
 */

Module.register("MMM-TV", {

    requiresVersion: "2.1.0",
    debug: true,

    videos: [ 'https://video.nest.com/embedded/live/wSbs3mRsOF?autoplay=1', 'https://www.youtube.com/embed/d6m08InT8Oo&autoplay=1' ],

    // Define start sequence.
    start: function() {
        Log.info("Starting module: " + this.name);
    },

    resume: function() {
      return this.getDom();
    },

    currentIndex: 0,

    // Override dom generator.
    getDom: function() {
        var self = this;

        var wrapper = document.createElement("div");
        if (self.hide){
          return wrapper;
        }

        var iframe = document.createElement("IFRAME");
		    iframe.style = "border:0"
		    iframe.width = "100%";
		    iframe.height = "100%";
        iframe.scrolling = "false";
        url = this.videos[this.currentIndex];
        console.log(url);
        iframe.src = url;

        wrapper.appendChild(iframe);
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

    hide: true,

    notificationReceived: function(notification, payload, sender) {
        var self = this;

        if (notification == 'REMOTE_ACTION'){
          if (payload.currentMenu != 'tv'){
            self.hide = true;
            self.updateDom();
          }else{
            if (payload.payload.action == 'UP'){
              if (self.currentIndex != self.videos.length-1){
                self.currentIndex += 1;
              }else{
                self.currentIndex = 0;
              }
            }else if (payload.payload.action == 'DOWN'){
              if (self.currentIndex > 0){
                self.currentIndex -= 1;
              }else{
                self.currentIndex = 0;
              }
            }
            self.hide = false;
            self.updateDom();
          }
        }
    }
});
