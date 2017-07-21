/* Magic Mirror
 * Node Helper: Buttons
 *
 * By Joseph Bethge
 * MIT Licensed.
 */

const Gpio = require('onoff').Gpio;
const NodeHelper = require("node_helper");

module.exports = NodeHelper.create({
    // Subclass start method.
    start: function() {
        var self = this;

        console.log("Starting node helper for: " + self.name);

        this.loaded = false;
    },

    // Subclass socketNotificationReceived received.
    socketNotificationReceived: function(notification, payload) {
        console.log(notification);
        if (notification === 'BUTTON_CONFIG') {
            this.config = payload.config;

            this.intializeButtons();
            this.initalizeLeds();
        };

        if (notification === 'LED_CONFIG'){
          console.log(payload);
          this.leds[0].writeSync(payload['timer']);
          this.leds[1].writeSync(payload['up']);
          this.leds[2].writeSync(payload['down']);
          this.leds[3].writeSync(payload['action']);
          this.leds[4].writeSync(payload['nav']);
        }
    },

    watchHandler: function(index) {
        var self = this;

        return function (err, value) {
            if (value == 1) {
                self.buttons[index].pressed = new Date().getTime();
                self.sendSocketNotification("BUTTON_DOWN", {
                    index: index
                });
                setTimeout(self.watchHandler(index), self.config.minLongPressTime, undefined, 0);
                return;
            }
            if (value == 0 && self.buttons[index].pressed !== undefined) {
                var start = self.buttons[index].pressed;
                var end = new Date().getTime();
                var time = end - start;

                self.buttons[index].pressed = undefined;

                self.sendSocketNotification("BUTTON_UP", {
                    index: index,
                    duration: time
                });
                return;
            }
        }
    },

    intializeButton: function(index) {
        const self = this;

        var options = { persistentWatch: true };

        var pir = new Gpio(self.buttons[index].pin, 'in', 'both', options);
        pir.watch(this.watchHandler(index));
    },

    leds: [],

    initalizeLeds: function(){
      this.leds = [
        new Gpio(13, 'out'),
        new Gpio(19, 'out'),
        new Gpio(26, 'out'),
        new Gpio(12, 'out'),
        new Gpio(16, 'out')
      ];

      this.leds[0].writeSync(1);
      this.leds[1].writeSync(0);
      this.leds[2].writeSync(0);
      this.leds[3].writeSync(0);
      this.leds[4].writeSync(1);
    },

    intializeButtons: function() {
        const self = this;

        if (self.loaded) {
            return;
        }

        self.buttons = self.config.buttons;

        for (var i = 0; i < self.buttons.length; i++) {
            console.log("Initialize button " + self.buttons[i].name + " on PIN " + self.buttons[i].pin);
            self.buttons[i].pressed = undefined;
            self.intializeButton(i);
        }

        self.loaded = true;
    }
});
