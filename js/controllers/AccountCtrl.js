/*
 * AccountCtrl : Compte de l'assuré
 */
Controllers.controller('AccountCtrl', ['$scope', '$log', '$window', '$filter', 'Data',
    function ($scope, $log, $window, $filter, Data){

        /*
         * Récupère la liste des bénéficiaires depuis le service Data
         */
        $scope.items = Data.getBeneficiairesList();

        /*
         * changeAvatar(index) : permet de choisir un nouvel avatar
         * @index : numéro de l'élément dans le scope. C'est l'ID du
         * bénéficiaire
         */
        $scope.changeAvatar = function (index){

        };
    }]);


