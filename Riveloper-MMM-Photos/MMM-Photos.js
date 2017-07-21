/* global Module */

/* Magic Mirror
 * Module: Ads
 *
 * By Austin Sweat
 * MIT Licensed.
 */

Module.register("MMM-Photos", {

    requiresVersion: "2.1.0",
    debug: true,

    photos: [
      { 'key': 0, 'photos': ['http://placeholdit.imgix.net/~text?txtsize=33&txt=Sample%20Photo%201&w=444&h=800', 'http://placeholdit.imgix.net/~text?txtsize=33&txt=Sample%20Photo%202&w=444&h=800', 'http://placeholdit.imgix.net/~text?txtsize=33&txt=Sample%20Photo%203&w=444&h=800'] },
      { 'key': 1, 'photos': ['http://placeholdit.imgix.net/~text?txtsize=33&txt=Sample%20Photo%204&w=444&h=800', 'http://placeholdit.imgix.net/~text?txtsize=33&txt=Sample%20Photo%205&w=444&h=800', 'http://placeholdit.imgix.net/~text?txtsize=33&txt=Sample%20Photo%206&w=444&h=800'] }
    ],

    currentKey: 0,

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

        // if ((document.getElementById('photo_wrapper')) == null){
          var photo_wrapper = document.createElement("div");
          photo_wrapper.id = 'photo_wrapper';
        // }else{
          // var photo_wrapper = document.getElementById("photo_wrapper");
        // }

        var photoSet = self.photos[self.currentKey].photos;

        for (var i = 0; i < photoSet.length; i++) {
          var photo = photoSet[i];
          var img = document.createElement("img");
          img.id = 'photo_img';
          img.src = photo;
          photo_wrapper.appendChild(img);
        }

        wrapper.appendChild(photo_wrapper);

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
          if (payload.currentMenu != 'photos'){
            self.hide = true;
            self.updateDom();
          }else{
            if (payload.payload.action == 'UP'){
              if (self.currentKey != self.photos.length-1){
                self.currentKey += 1;
              }else{
                self.currentKey = 0;
              }
            }else if (payload.payload.action == 'DOWN'){
              if (self.currentKey > 0){
                self.currentKey -= 1;
              }else{
                self.currentKey = 0;
              }
            }

            self.hide = false;
            self.updateDom();
          }
        }
    }
});
