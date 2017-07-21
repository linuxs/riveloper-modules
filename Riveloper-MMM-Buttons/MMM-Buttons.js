/* global Module */

/* Magic Mirror
 * Module: Buttons
 *
 * By Joseph Bethge
 * MIT Licensed.
 */

Module.register("MMM-Buttons", {

    requiresVersion: "2.1.0",
    debug: true,
    currentMenu: 'timer',
    timer: {
      'currentTimer': 0,
      'status': 'idle',
      'interval': undefined
    },

    // Default module config.
    defaults: {
        buttons: [
          {
                pin: 25,
                name: "timer",
                longPress: undefined,
                shortPress: {
                    notification: "REMOTE_ACTION",
                    payload: {action: "TIMER"}
                }
            },
            {
                pin: 24,
                name: "up",
                longPress: undefined,
                shortPress: {
                    notification: "REMOTE_ACTION",
                    payload: {action: "UP"}
                }
            },
            {
                pin: 23,
                name: "down",
                longPress: undefined,
                shortPress: {
                    notification: "REMOTE_ACTION",
                    payload: {action: "DOWN"}
                }
            },
            {
                pin: 22,
                name: "action",
                longPress: undefined,
                shortPress: {
                    notification: "REMOTE_ACTION",
                    payload: {action: "ACTION"}
                }
            },
            {
                pin: 21,
                name: "nav",
                shortPress: {
                    notification: "REMOTE_ACTION",
                    payload: {action: "NAVIGATION"}
                },
                longPress: undefined
            }
        ],
        minShortPressTime: 0,
        maxShortPressTime: 500
    },

    // Define start sequence.
    start: function() {
        Log.info("Starting module: " + this.name);

        this.sendConfig();

        this.intervals = [];
        this.alerts = [];
        for (var i = 0; i < this.config.buttons.length; i++)
        {
            this.intervals.push(undefined);
            this.alerts.push(false);
        }
    },

    // Override dom generator.
    getDom: function() {
        var wrapper = document.createElement("div");

        return wrapper;
    },

    /* sendConfig()
     * intialize backend
     */
    sendConfig: function() {
        this.sendSocketNotification("BUTTON_CONFIG", {
            config: this.config
        });
    },

    checkStatus: function(){
      var self = this;
      // console.log(this);return;
      if (this.timer.status == 'running'){
        if (this.timer.currentTimer >= 1000){
          console.log('timer running: ' + ((this.timer.currentTimer/60)/1000));
          this.timer.currentTimer -= 1000;
          setTimeout(function(){ self.checkStatus(); }, 1000);
        }else{
          console.log('timer completed');
          this.timer.currentTimer = 0;
          this.timer.status = 'idle';
          // clearInterval(this.timer.interval);
        }
      }
    },

    buttonUp: function(index, duration) {
      var self = this;
      var button = this.config.buttons[index];

      if (button['name'] == 'nav'){
        if (this.debug){
          console.log('Current Menu: ' + this.currentMenu);
        }

        switch (this.currentMenu) {
          case 'timer':
            this.currentMenu = 'tv';
            this.sendSocketNotification("LED_CONFIG", {
                timer: 1,
                up: 1,
                down: 1,
                action: 1,
                nav: 1
            });
            break;

          case 'tv':
            this.currentMenu = 'games';
            this.sendSocketNotification("LED_CONFIG", {
                timer: 1,
                up: 0,
                down: 0,
                action: 0,
                nav: 1
            });
            break;

          case 'games':
            this.currentMenu = 'photos';
            this.sendSocketNotification("LED_CONFIG", {
                timer: 1,
                up: 1,
                down: 1,
                action: 0,
                nav: 1
            });
            break;

          case 'photos':
            this.currentMenu = 'timer';
            this.sendSocketNotification("LED_CONFIG", {
                timer: 1,
                up: 0,
                down: 0,
                action: 0,
                nav: 1
            });
            break;
        }

        if (this.debug){
          console.log('New Menu: ' + this.currentMenu);
        }
      }

      if (this.currentMenu == 'timer'){
        if (button['name'] == 'timer'){
          if (this.timer.currentTimer >= 1000){
            if (this.timer.status == 'idle'){
              this.timer.status = 'running';

              this.timer.interval = setTimeout(function(){ self.checkStatus(); },1000);
            }else{
              this.timer.status = 'idle';
              if (typeof(this.timer.interval) != 'undefined'){
                clearInterval(this.timer.interval);
              }
            }
          }
          return;
        }

        if (button['name'] == 'up'){
          this.timer.currentTimer += 300000;
          if (this.debug){
            console.log('Timer value altered: ' + this.timer.currentTimer);
          }
          return;
        }

        if (button['name'] == 'down'){
          if (this.timer.currentTimer >= 1000){
            this.timer.currentTimer -= 300000;
          }
          if (this.debug){
            console.log('Timer value altered: ' + this.timer.currentTimer);
          }
          return;
        }
      }

      if (this.currentMenu == 'tv'){
        if (button['name'] == 'up'){
          console.log('tv up');
        }

        if (button['name'] == 'down'){
          console.log('tv down');
        }

        if (button['name'] == 'action'){
          console.log('tv action');
        }
      }

      if (this.currentMenu == 'games'){

      }

      if (this.currentMenu == 'photos'){

      }

      if (this.currentMenu == 'ads'){

      }

        // if (this.alerts[index]) {
        //     // alert already shown, clear interval to update it and hide it
        //     if (this.intervals[index] !== undefined) {
        //         clearInterval(this.intervals[index]);
        //     }
        //     this.alerts[index] = false;
        //     this.sendNotification("HIDE_ALERT");
        // } else {
            // no alert shown, clear time out for showing it
            if (this.intervals[index] !== undefined) {
                clearTimeout(this.intervals[index]);
            }
        // }
        this.intervals[index] = undefined;

        // var min = this.config.minShortPressTime;
        // var max = this.config.maxShortPressTime;
        var shortPress = this.config.buttons[index].shortPress
        // var longPress = this.config.buttons[index].longPress

        // if (shortPress && min <= duration && duration <= max)
        // {


            this.sendAction(shortPress);
    },

    sendAction(description) {
        var customPayload = {
          payload: description.payload,
          currentMenu: this.currentMenu
        };
        this.sendNotification(description.notification, customPayload);
    },

    buttonDown: function(index) {
        var self = this;

        // if (self.config.buttons[index].longPress && self.config.buttons[index].longPress.title)
        // {
        //     this.intervals[index] = setTimeout(function () {
        //         self.startAlert(index);
        //     }, this.config.maxShortPressTime);
        // }
    },

    showAlert: function (index) {
        // display the message
        this.sendNotification("SHOW_ALERT", {
            title: this.config.buttons[index].longPress.title,
            message: this.config.buttons[index].longPress.message,
            imageFA: this.config.buttons[index].longPress.imageFA
        });
    },

    startAlert: function(index) {
        this.alerts[index] = true;
        this.showAlert(index);
    },

    // Override socket notification handler.
    socketNotificationReceived: function(notification, payload) {
        if (notification === "BUTTON_UP")
        {
            this.buttonUp(payload.index, payload.duration);
        }
        if (notification === "BUTTON_DOWN")
        {
            this.buttonDown(payload.index);
        }
    },
});
