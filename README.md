# angular-pusher
Pusher events bridge to angular events

https://disparity.github.io/angular-pusher/

## Usage
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
