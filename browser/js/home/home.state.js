app.config(function($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        template: `<toolbar></toolbar>`,
        resolve:{
            nps: function(){
                var npsDataPromise = new Promise(function(resolve, reject) {

                var req = new XMLHttpRequest();
                req.open('GET', '/api/nps');
                req.onload = function(){
                if(req.status == 200){
                  resolve(JSON.parse(req.response));
                }
                else{
                  reject(Error(req.statusText))
                }
                }
                req.send();


                });

                return npsDataPromise.then(data => {
                    return data;
                })
            },
            fittings: function(){
                var fittingsDataPromise = new Promise(function(resolve, reject) {

                    var req = new XMLHttpRequest();
                    req.open('GET', '/api/fittings');
                    req.onload = function(){
                    if(req.status == 200){
                        resolve(JSON.parse(req.response));
                    }
                    else{
                        reject(Error(req.statusText))
                    }
                    }
                    req.send();
                });

                return fittingsDataPromise.then(data => {
                    return data;
                })
            }

        },
        controller: function($scope, nps, fittings){
            $scope.nps = nps;
            $scope.fittings = fittings;
            console.log($scope);
        }
    });
});
