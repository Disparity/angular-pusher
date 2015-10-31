# Angular-pusher bridge
This library is an open source angular bridge to the [Pusher](https://pusher.com/).

# Usage overview
## Installation
### Bower
```
bower install angular-pusher-bridge
```
and then
```html
<script src="bower_components/angular-pusher-bridge/angular-pusher.min.js" type="text/javascript"></script>
```

### NPM
```
npm install angular-pusher-bridge
```
and then
```html
<script src="node_modules/angular-pusher-bridge/angular-pusher.min.js" type="text/javascript"></script>
```

## Configuration
The service provider provides the following methods:
* `.setApiKey('KEY')` - set pusher application key;
* `.option(name, value)` or `.option({name: value})` - Configuring the pusher's client. [Available pusher options](https://pusher.com/docs/client_api_guide/client_connect#options_parameter);
* `.subscribe(channel)` - subscribe to the channel events;
* `.alias(channel, alias)` or `.alias({channel: alias})` - set alias for channel

These methods are available during configuration through pusherProvider. At run time, the following methods are changing their behavior:
* `.option(name)` - return pusher's option value;

### Enable debugging
`.option('debug', true)` - enable logging (via $log) all events (default: false)

### Debounce $digest
`.option('debounce', int)` - enable debounce $rootScope.$digest. Run $digest after 'milliseconds' (default: 50)

## Binding to events
This module is designed for integration events received through the pusher, into the system event angular.
Events propagate from $rootScope.

```javascript
$scope.$on('channel:event', function (angularEvent, pusherEventData) {
    $log.debug(pusherEventData);
});
```
or
```javascript
$scope.$on('global_event', function (angularEvent, pusherEventData) {
    $log.debug(pusherEventData);
});
```

If the channel has been set an alias, the name of the event instead of the name of the channel will be used an alias:
```javascript
pusherProvider.alias('channel', 'alias');
$scope.$on('alias:event', function (angularEvent, pusherEventData) {
    $log.debug(pusherEventData);
});
```

## Examples

```javascript
angular.module('app', ['angular-pusher'])
    .config(['pusherProvider', function (provider) {
        provider.setApiKey('XXXXX');
        provider.option({
            debug: true,
            cluster: 'eu'
        });
        // subscribe to channel during configuration.
        provider.subscribe('my_channel');
        // subscribe to dynamic generation channel name
        provider.subscribe('private-channel-' + user.id);
        // making dynamic name - static, by specifying an alias
        provider.alias('private-channel-' + user.id, 'personal-events'); 
    }])
    .controller('ctrl', ['$scope', '$window', 'pusher', 'pusherProvider', function ($scope, $window, pusher, pusherProvider) {
        // subscribe to channel in runtime
        pusherProvider.subscribe('runtime_channel');
        // Bind listeners
        $scope.$on('my_channel:new_message', function (event, data) {
            $window.alert($window.JSON.stringify(data));
        });
        $scope.$on('personal-events:new_message', function (event, data) {
            $window.alert($window.JSON.stringify(data));
        });
        // use original pusher client
        pusher; 
    }])
```

## Demo

https://disparity.github.io/angular-pusher/#demo
