/*
 * RdvCreateCtrl : permet de créer un nouveau RDV avec les informations récupérées
 * depuis la vue de recherche d'un PS et les informations saisies par l'utilisateur
 */
Controllers.controller('RdvCreateCtrl', ['$scope', '$window', '$log', '$filter', 'Data',
    function ($scope, $window, $log, $filter, Data){

        /*
         * @arrPs : informations sur le PS récupérées depuis le service Data
         *
         * A FAIRE : Récupérer les vraies données sur le PS
         */
        var arrPs = {
            numero : "751225487",
            titre : "Etab. Tami Harrell",
            telephone : "0158386715",
            adresse : "21 rue Georges Auric, 75019 Paris"
        };

        /*
         * On injecte les informations du PS dans le scope
         */
        $scope.ps = arrPs;

        /*
         * Injecte les informations sur les bénéficiaires dans le scope
         */
        $scope.beneficiaires = Data.getBeneficiairesList();

        /*
         * Bénéficiaire selectionné par défaut
         */
        $scope.selectedBeneficiaire = 0;

        /*
         * selectBeneficiaire($index) : permet de changer l'heure du rappel
         */
        $scope.selectBeneficiaire = function ($index){

            $scope.selectedBeneficiaire = $index;
        };

        /*
         * plage(min, max) : génère un nombre dans l'intervalle définit
         * par @min et @max
         */
        $scope.plage = function (min, max){

            var arrNumbers = [];

            for(var i = min; i <= max; i++){

                arrNumbers.push(i);
            }

            return arrNumbers;
        };

        /*
         * Element de la date selectionné par défaut
         */
        $scope.selectedJour = parseInt($filter('date')(new Date().getTime(), 'dd'));

        $scope.selectedMois = parseInt($filter('date')(new Date().getTime(), 'MM'));

        $scope.selectedAnnee = parseInt($filter('date')(new Date().getTime(), 'yyyy'));

        $scope.selectedHeure = parseInt($filter('date')(new Date().getTime(), 'HH'));

        $scope.selectedMinute = parseInt($filter('date')(new Date().getTime(), 'mm'));

        /*
         * onChangeDate(item, value) : permet de changer la date et l'heure
         */
        $scope.onChangeDate = function (item, value){

            switch(item){

                case 'jour':
                    $scope.selectedJour = value;
                    break;

                case 'mois':
                    $scope.selectedMois = value;
                    break;

                case 'annee':
                    $scope.selectedAnnee = value;
                    break;

                case 'heure':
                    $scope.selectedHeure = value;
                    break;

                case 'minute':
                    $scope.selectedMinute = value;
                    break;

                default:
                    break;
            }
        };

        /*
         * @delais : contient les délais de rappel
         */
        $scope.delais = [
            {
                titre : "A l'heure",
                valeur : 0
            },
            {
                titre : "1 jour avant",
                valeur : 1000 * 60 * 60 * 24
            },
            {
                titre : "1 heure avant",
                valeur : 1000 * 60 * 60
            },
            {
                titre : "30 min avant",
                valeur : 1000 * 60 * 30
            }
        ];

        /*
         * Dalai du rappel par défaut
         */
        $scope.selectedDelai = 0;

        /*
         * selectDelai($index) : permet de changer l'heure du rappel
         */
        $scope.selectDelai = function ($index){

            $scope.selectedDelai = $scope.delais[$index].valeur;
        };

        /*
         * Crée le RDV en faisant appel au service Data
         */
        $scope.submit = function (){

            /*
             * @dateRdv : date du RDV saisie par l'utilisateur
             */
            var dateRdv = new Date($scope.selectedMois + "/" + $scope.selectedJour + "/" + $scope.selectedAnnee + " " + $scope.selectedHeure + ":" + $scope.selectedMinute).getTime();

            /*
             * @dateRdvJour : convertit la date en timestamp sans l'heure
             */
            var dateRdvJour = new Date($filter("date")(dateRdv, "MM/dd/yyyy")).getTime();

            /*
             * @dateRdvRappel : date de rappel du RDV
             */
            var dateRdvRappel = dateRdv + $scope.selectedDelai;

            /*
             * @notes : notes saisies par l'utilisateur
             */
            var userNotes = "Apporter les analyses du laboratoire";

            /*
             * @defaultDelaiRemboursement : délai de remboursement par défaut
             * + 5 jours
             */
            var defaultDelaiRemboursement = 1000 * 60 * 60 * 24 * 5;

            /*
             * @dateRemboursement : date de remboursement par défaut
             */
            var defaultDateRemboursement = null;

            /*
             * @defaultMontantRemboursement : montant total du remboursement
             */
            var defaultMontantRemboursement = null;

            /*
             * @defaultTaux : taux de rembousement
             */
            var defaultTaux = null;

            /*
             * @defaultMontantAS : part Assurance Maladie
             */
            var defaultMontantAS = null;

            /*
             * @defaultMontantMutuelle : part mutuelle
             */
            var defaultMontantMutuelle = null;

            /*
             * @defaultMontantPF : montant des participations forfaitaires
             */
            var defaultMontantPF = null;

            /*
             * @defaultMontantFR : montant des franchises médicales
             */
            var defaultMontantFR = null;

            /*
             * @defaultMontantPaye : montant réglé au PS par défaut
             */
            var defaultMontantPaye = null;

            /*
             * @defaultEtat : etat aléatoire pour les tests
             */
            var defaultEtat = false;

            /*
             * @defaultRdvId : max ID des données RDV
             */
            var defaultRdvId = Data.getLastRdvId() + 1;

            /*
             * @arrBeneficiaire : informations sur le bénéficiaire récupérées depuis
             */
            var arrBeneficiaire = $filter("filter")($scope.beneficiaires, {id : $scope.selectedBeneficiaire})[0];

            /*
             * @arrRdv : Objet nouveau RDV
             */
            var arrRdv = {
                id : defaultRdvId,
                type : "rdv",
                date : dateRdv,
                dateJour : dateRdvJour,
                etat : defaultEtat,
                notification : false,
                dateRappel : dateRdvRappel,
                rappel : false,
                archive : false,
                beneficiaire : {
                    id : arrBeneficiaire.id,
                    nom : arrBeneficiaire.nom,
                    prenom : arrBeneficiaire.prenom,
                    avatar : arrBeneficiaire.avatar,
                    qualite : arrBeneficiaire.qualite,
                    sexe : arrBeneficiaire.sexe,
                    dateNaissance : arrBeneficiaire.dateNaissance,
                    rang : arrBeneficiaire.rang
                },
                ps : {
                    titre : arrPs.titre,
                    numero : arrPs.numero,
                    telephone : arrPs.telephone,
                    adresse : arrPs.adresse
                },
                notes : userNotes,
                delaiRemboursement : defaultDelaiRemboursement,
                montantPaye : defaultMontantPaye,
                remboursement : {
                    etat : defaultEtat,
                    montant : defaultMontantRemboursement,
                    taux : defaultTaux,
                    montantAS : defaultMontantAS,
                    montantMutuelle : defaultMontantMutuelle,
                    montantPF : defaultMontantPF,
                    montantFR : defaultMontantFR,
                    date : defaultDateRemboursement
                }
            };


            /*
             * Sauvegarde le RDV dans localStorage
             */
            if(Data.createRdv(arrRdv) === true){

                /*
                 * Popup de notification
                 */
                $scope.popUrl = 'views/popups/alert.html';

                /*
                 * Personnalisation de la popup
                 */
                $scope.popup = {
                    "titre" : "RDV enregistré",
                    "message" : "L'évènement a été sauvegardé avec succès.",
                    "class" : "success",
                    "boutons" : {
                        "confirm" : {
                            "titre" : "Cool !",
                            "action" : "confirm()"
                        },
                        "cancel" : {
                            "titre" : "Fermer",
                            "action" : "cancel()"
                        }
                    }
                };

                /*
                 * L'utilisateur confirme la duplication
                 */
                $scope.confirm = function (){

                    /*
                     * Appelle la vue détail d'un RDV en passant l'ID du RDV
                     */
                    $window.location.hash = '#/rdv-detail/' + defaultRdvId;
                };

                /*
                 * L'utilisateur confirme la duplication
                 */
                $scope.cancel = function (){

                    /*
                     * Appelle la vue détail d'un RDV en passant l'ID du RDV
                     */
                    $window.location.hash = '#/rdv-detail/' + defaultRdvId;
                };
            }
        };
    }]);