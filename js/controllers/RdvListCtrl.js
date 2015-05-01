/*
 * ListCtrl : Liste tous les évènements (RDV, campagne de communication etc...)
 */
Controllers.controller('RdvListCtrl', ['$scope', '$window', '$log', 'Data',
    function ($scope, $window, $log, Data){

        /*
         * @items : objet qui contient tous les évènements récupérées depuis le service Data
         */
        $scope.items = Data.getRdvList({
            forceUpdate : false,
            notification : false,
            user : 1820375114166
        });

        /*
         * Si c'est la première connexion rediriger vers le tutoriel
         * A FAIRE :
         */
        if($scope.items.length === 0){

            //$window.location.hash = '#/tutoriel';
        }

        /*
         * @menus : menu qui permet de filtrer rapidement les évènements. Charge {{query}}.
         */
        $scope.menus = [
            {
                "titre" : "Tout afficher",
                "url" : "#/rdv-list",
                "image" : "img/menu.svg",
                "query" : ""
            },
            {
                "titre" : "En attente",
                "url" : "#/rdv-list",
                "image" : "img/schedule-orange.svg",
                "query" : false
            },
            {
                "titre" : "Remboursés",
                "url" : "#/rdv-list",
                "image" : "img/check-green.svg",
                "query" : true
            }
        ];

        /*
         * @selectedIndex : Element selectionné par défaut
         */
        $scope.selectedIndex = 0;

        /*
         * selectItem(index) : Quand on clique sur un élement du menu. Met à jour la requête {{query}}
         */
        $scope.selectItem = function (index){

            $scope.selectedIndex = index;

            /*
             * Met à jour le filtre
             */
            $scope.query = $scope.menus[$scope.selectedIndex].query;
        };

        /*
         * createEvenement() : créer un nouvel évènement.
         */
        $scope.createEvenement = function (){

            /*
             * Redirige vers la vue ps-search
             */
            $window.location.hash = '#/ps-search';
        };
    }]);