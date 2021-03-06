/*
 * SearchCtrl : permet de rechercher, filtrer et choisir un PS ou un établissement
 */
Controllers.controller('PsSearchCtrl', ['$scope', '$http', '$window', '$log', 'Data', 
    function ($scope, $http, $window, $log, Data){

        /*
         * Récupère la liste des professions
         * A FAIRE : appel webservice de requêtage des professions
         */
        $http.get('datas/data-profession.json').success(function (data){

            $scope.optionsProfession = data;

            /*
             * Selection par défaut du premier item de l'objet
             */
            $scope.profession = $scope.optionsProfession[0].id;
        });


        //Sélection par défaut
        $scope.type = "Professionnel de sante";


        /*
         * AfficherFiltreRecherche() : Affiche ou cache les options de recherche supplémentaires.
         * Par défaut, elles sont cachées
         */
        $scope.filtre_recherche_titre = "+ Afficher plus d'options de recherche";
        $scope.classe_filtre = "filtre_recherche cacher";
        $scope.afficherFiltreRecherche = function (){

            if ($scope.classe_filtre == "filtre_recherche cacher"){
                $scope.filtre_recherche_titre = "- Afficher plus d'options de recherche";
                $scope.classe_filtre = "filtre_recherche voir";
            }
            else{
                $scope.filtre_recherche_titre = "+ Afficher plus d'options de recherche";
                $scope.classe_filtre = "filtre_recherche cacher";
            }
        };



        /*
         * Fonction de recherche d'un PS ou d'un établissement
         */
        $scope.searchPs = function(){
            console.log("Recherche PS" + $scope.type + $scope.nom + $scope.prenom + $scope.localisation + $scope.acte, this);

            /*
             * Récupère les données depuis l'API
             * A FAIRE : appel webservice de requêtage des PS avec les critères de recherche en argument
             */
            $http.get('datas/data-ps.json').success(function (data){

                /*
                 * On crée ce tableau pour y ajouter des données manipulées
                 */
                var arrItems = [];

                angular.forEach(data, function (item){

                    //On regarde si le PS ou l'établissement fait partie des favoris
                    if (Data.isFavori(item.numero))
                        $favori = "img/star-yellow.svg";
                    else
                        $favori = "img/star-grey.svg";

                    /*
                     *  @nom :
                     *   - Nom du PS
                     *   - Raison sociale de l'établissement
                     *
                     *  @prenom :
                     *   - Prénom du PS
                     *   - Vide si établissement
                     *
                     *  @telephone :
                     *   - Téléphone du PS ou de l'établissement
                     *
                     *  @adresse :
                     *   - Adresse du PS ou de l'établissement
                     *
                     *  @honoraire :
                     *   - type d'honoraire du PS
                     *
                     *  @cv :
                     *   - true : si le PS prend la carte vitale
                     *   - false : si le PS ne prend pas la carte vitale
                     *
                     */
                    arrItems.push({
                        "numero": item.numero,
                        "nom": item.nom,
                        "prenom": item.prenom,
                        "telephone": item.telephone,
                        "adresse": item.adresse,
                        "honoraire": item.honoraire,
                        "cv": item.cv,
                        "favori": $favori
                    });
                });

                /*
                 * @items : objet qui contient tous les évènements + les données insérées par calculs
                 */
                $scope.items = arrItems;


                /*
                 * @nb_result : nombre d'occurences trouvées
                 */
                if (arrItems.length == 1)
                    $scope.nb_result = arrItems.length + " résultat correspond à votre recherche : ";
                else
                    $scope.nb_result = arrItems.length + " résultats correspondent à votre recherche : ";


            });


        }


        /*
         * ajouterFavori() : ajoute le PS ou l'établissement dans les favoris.
         */
        $scope.ajouterFavori = function ($index){

            if ($scope.items[$index].favori == "img/star-grey.svg")
            {
                $scope.items[$index].favori = "img/star-yellow.svg";

                Data.setFavori({
                    numero : $scope.items[$index].numero,
                    nom : $scope.items[$index].nom,
                    prenom : $scope.items[$index].prenom
                });
            }
            else
            {
                $scope.items[$index].favori = "img/star-grey.svg";

                Data.deleteFavori($scope.items[$index].numero);
            }
        };


        /*
         * planifierRdv() : redirige vers le formulaire de création d'un RDV.
         */
        $scope.planifierRdv = function ($index){

            /*
             * Redirige vers la vue rdv-create
             */
            $window.location.hash = '#/rdv-create/' + $scope.items[$index].numero;
        };

    }]);
