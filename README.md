# Angular-pusher bridge
This library is an open source angular bridge to the [Pusher](https://pusher.com/).

## Usage overview

### Installation

### Configuration

### Binding to events
```javascript
angular.module('app', ['angular-pusher'])
    .config(['pusherProvider', function (provider) {
        provider.setApiKey('XXXXX');
        provider.subscribe('my_channel');
    }])
    .controller('ctrl', ['$scope', '$log', function ($scope, $log) {
        $scope.$on('my_channel:new_message', function (event, data) {
            $log.debug(data);
        });
    }])
```


### Demo

https://disparity.github.io/angular-pusher/
