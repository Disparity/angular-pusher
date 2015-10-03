'use strict';

(function (angular) {
angular.module('angular-pusher', [])
    .provider('pusher', [function () {
        var self = this;
        var config = {key: '', channels: [], options: {debug: false}, aliases: {}};
        self.subscribe = angular.bind(config.channels, config.channels.push);
        self.alias = function (channel, alias) {
            if (angular.isObject(channel)) {
                angular.extend(config.aliases, channel);
                return;
            }
            config.aliases[channel] = alias;
        };
        self.option = function (name, value) {
            if (angular.isObject(name)) {
                for(var i in name) {
                    self.option(i, name[i]);
                }
                return;
            }
            if (value === null) {
                delete config.options[name];
            }
            config.options[name] = value;
        };
        self.setApiKey = function (apiKey) {
            config.key = apiKey || config.key;
        };
        this.$get = ['$window', function ($window) {
            var pusher = new $window.Pusher(config.key, config.options);
            pusher.channelAliases = config.aliases;
            for (var i in config.channels) {
                pusher.subscribe(config.channels[i]);
            }
            angular.extend(self, {
                subscribe: angular.bind(pusher, pusher.subscribe),
                option: function (name) {
                    return angular.isString(name) ? pusher.config[name] : null;
                }
            });
            return pusher;
        }];
    }])
    .run(['pusher', '$rootScope', '$log', function (pusher, $rootScope, $log) {
        pusher.connection.bind_all(function (eventName, data) {
            pusher.config.debug && $log.debug([eventName, data]);
            var event = {name: eventName, data: data};
            switch(eventName) {
                case 'message':
                    angular.extend(event, {
                        name: (data.channel ? (pusher.channelAliases[data.channel] || data.channel) + ':' : '') + data.event,
                        data: data.data
                    });
                    break;
                default: return;
            }
            $rootScope.$broadcast(event.name, event.data);
            $rootScope.$digest();
        });
    }])
;
})(window.angular);
