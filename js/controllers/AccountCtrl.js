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
         * id : numéro de l'élément dans le scope. C'est l'ID du
         * bénéficiaire
         */
        $scope.changeAvatar = function (id){

            $scope.popUrl = "views/popups/account-change-avatar.html";

            /*
             * Personnalisation de la popup
             */
            $scope.popup = {
                "titre" : "Choisir un avatar",
                "message" : "",
                "class" : "info",
                "boutons" : {
                    "confirm" : {
                        "titre" : "Fermer",
                        "action" : "confirm()"
                    },
                    "cancel" : {
                        "titre" : "Fermer",
                        "action" : "cancel()"
                    }
                }
            };

            /*
             * @items : contient la liste des avatars disponibles
             */
            $scope.popup.items = [
                {
                    id : 0,
                    url : "img/avatars/femme-1.png"
                }, {
                    id : 1,
                    url : "img/avatars/femme-2.png"
                }, {
                    id : 2,
                    url : "img/avatars/garcon-1.png"
                }, {
                    id : 3,
                    url : "img/avatars/garcon-2.png"
                }, {
                    id : 4,
                    url : "img/avatars/garcon-3.png"
                }, {
                    id : 5,
                    url : "img/avatars/homme-1.png"
                }, {
                    id : 6,
                    url : "img/avatars/homme-2.png"
                }, {
                    id : 7,
                    url : "img/avatars/homme-3.png"
                }, {
                    id : 8,
                    url : "img/avatars/homme-4.png"
                },
                {
                    id : 9,
                    url : "img/avatars/cartman.jpg"
                }
            ];

            /*
             * @selectedItem : bénéficiaire selectionné
             */
            $scope.popup.selectedItem = $scope.items[id].avatar;

            /*
             * chooseAvatar(url) : quand l'utilisateur clique sur un avatar
             */
            $scope.chooseAvatar = function (url){

                /*
                 * Met à jour l'avatar du bénéficiaire choisi
                 */
                $scope.items[id]["avatar"] = url;

                /*
                 * Met à jour l'avatar selectionné
                 */
                $scope.popup.selectedItem = $scope.items[id].avatar;

                /*
                 * Met à jour l'avatar dans le service Data
                 */
                Data.updateBeneficiaire({
                    id : id,
                    element : "avatar",
                    valeur : url
                });
            };

            /*
             * L'utilisateur annule
             */
            $scope.cancel = function (){

                /*
                 * Vide la vue
                 */
                $scope.popUrl = null;
            };

        };
    }]);


