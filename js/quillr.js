
var app = angular.module('quillrApp',['ngSanitize']);

var OAUTH2_CLIENT_ID = '7230788854-76abvqa8pdgvhtcpru0qg4bs7as1adpd.apps.googleusercontent.com';
        var OAUTH2_SCOPES = [
            'https://www.googleapis.com/auth/youtube'
        ];

        var googleApiClientReady = function() {
          console.log('1.25.098');
            gapi.auth.init(function() {
                window.setTimeout(checkAuth, 1);
            });
        }

        function checkAuth() {
            gapi.auth.authorize({
                client_id: OAUTH2_CLIENT_ID,
                scope: OAUTH2_SCOPES,
                immediate: true
                // authuser: ''
            }, handleAuthResult);
        }

        function handleAuthResult(authResult) {
          console.log('auth result:', authResult);
            if (authResult && !authResult.error) {
                loadAPIClientInterfaces();
            } else {
                $('#login-link').click(function() {
                    gapi.auth.authorize({
                        client_id: OAUTH2_CLIENT_ID,
                        scope: OAUTH2_SCOPES,
                        immediate: false
                        }, handleAuthResult);
                });
            }
        }

        function loadAPIClientInterfaces() {
            gapi.client.load('youtube', 'v3', function() {
                handleAPILoaded();
            });
        }
        function handleAPILoaded() {
          $('#search-button').attr('disabled', false);
        }

        var search = function (q, callback) {
         
          var request = gapi.client.youtube.search.list({
            q: q,
            part: 'snippet'
          });

          request.execute(function(response) {
            callback(response.items);
          });
        }

        app.controller('quillrCtrl', function($scope, $sce) {
             $scope.trustSrc = function(src) {
                return $sce.trustAsResourceUrl(src);
              }
            $scope.query = '';
            $scope.data = [];
            $scope.search = function(query) {
                if(query){
                    search(query, function(items) {
                        for(var i in items ) {
                            items[i].initUrl = 'http://www.youtube.com/embed/' + items[i].id.videoId;
                        }
                        $scope.data = items;
                        $scope.data = items;
                    });
                }
            }

        });