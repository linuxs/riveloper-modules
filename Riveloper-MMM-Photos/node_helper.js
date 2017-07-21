/* Magic Mirror
 * Node Helper: Ads
 *
 * By Austin Sweat
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
    },

    notificationReceived: function(notification, payload, sender) {
        console.log(notification);
        console.log(payload);
    }
});
