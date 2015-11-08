'use strict';

(function (angular) {
angular.module('angular-pusher', [])
    .provider('pusher', [function () {
        var self = this;
        var config = {key: '', channels: [], options: {debug: false, debounce: 50, aliases: {}}};
        self.subscribe = angular.bind(config.channels, config.channels.push);
        self.alias = function (channel, alias) {
            if (angular.isObject(channel)) {
                angular.extend(config.options.aliases, channel);
                return;
            }
            config.options.aliases[channel] = alias;
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
        this.$get = ['$pusher', function ($pusher) {
            var pusher = $pusher(config.key, config.options);
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
    .service('$pusher', ['$window', '$rootScope', '$timeout', '$log', function ($window, $rootScope, $timeout, $log) {
        var debouncer = null;
        return function (apiKey, options) {
            var digest = options.debounce > 0 ? angular.bind($rootScope, $rootScope.$digest) : function () {
                debouncer && $timeout.cancel(debouncer);
                debouncer = $timeout(angular.noop, options.debounce).finally(function () {debouncer = null;});
            };

            var pusher = new $window.Pusher(apiKey, options);
            pusher.connection.bind_all(function (eventName, data) {
                options.debug && $log.debug([apiKey, eventName, data]);
            });
            pusher.connection.bind_all(function (eventName, data) {
                var event = {name: eventName, data: data, key: apiKey};
                switch(eventName) {
                    case 'message':
                        angular.extend(event, {
                            name: (data.channel ? (options.aliases[data.channel] || data.channel) + ':' : '') + data.event,
                            data: data.data
                        });
                        break;
                    default: return;
                }
                $rootScope.$broadcast(event.name, event.data);
                digest();
            });
            return pusher;
        }
    }])
    .run(['pusher', angular.noop])
;
})(window.angular);
