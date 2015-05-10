/*
 * ListCtrl : Liste tous les évènements (RDV, campagne de communication etc...)
 */
Controllers.controller('RdvListCtrl', ['$scope', '$window', '$log', 'Data',
    function ($scope, $window, $log, Data){

        /*
         * Si l'utilisateur n'est pas loggué on redirige vers la page de connexion
         */
        if(Data.getUser() === false){

            $window.location.hash = '#/home';

            return;
        }

        /*
         * Si c'est la première visite on redirige vers le tutoriel
         */
        if(Data.isFirstVisit() === true){

            $window.location.hash = '#/tutoriel';

            return;
        }

        /*
         * @items : objet qui contient tous les évènements récupérés depuis le service Data
         */
        $scope.items = Data.getRdvList();

        /*
         * @menus : menu qui permet de filtrer rapidement les évènements.
         * Charge {{query}}.
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
         * selectItem(index) : Quand on clique sur un élement du menu.
         * Met à jour la requête {{query}}
         */
        $scope.selectItem = function (index){

            $scope.selectedIndex = index;

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