/*
 * DetailCtrl : affiche la carte détaillée de l'évènement selectionné
 */
Controllers.controller('RdvDetailCtrl', ['$scope', '$log', '$window', '$routeParams', '$filter', 'Data',
    function ($scope, $log, $window, $routeParams, $filter, Data){

        /*
         * Récupère le détail de l'évènement depuis le service Data
         * et charge le scope
         */
        $scope.item = Data.getRdvDetail();

        /*
         * Contrôle si le délai prévisionnel de remboursement est dépassé
         * si oui, proposer les canaux de contact : mail et tél
         * + 1 jours
         */
        $scope.dateLimite = new Date().getTime();

        $scope.showContact = function (){

            /*
             * Popup de confirmation
             */
            $scope.popUrl = 'views/popups/rdv-show-contact.html';

            /*
             * Personnalisation de la popup
             */
            $scope.popup = {
                "titre" : "Délai trop long ?",
                "message" : "D'après nos calculs, le délai de remboursement semble trop long. Si vous estimez que nous avons raison, contactez votre caisse primaire d'assurance maladie.",
                "class" : "info",
                "boutons" : {
                    "confirm" : {
                        "titre" : "Supprimer",
                        "action" : "confirm()"
                    },
                    "cancel" : {
                        "titre" : "Fermer",
                        "action" : "cancel()"
                    }
                }
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

        /*
         * Met à jour l'état de la notification pour ne pas qu'elle s'affiche de nouveau
         */
        if($scope.item.etat === true && $scope.item.notification === false){

            Data.updateRdv({
                notification : true
            });
        }

        /*
         *  Mise à jour dynamique lors de la saisie d'une note
         */
        $scope.$watch('item.notes', function (){

            Data.updateRdv({
                notes : $scope.item.notes
            });
        });

        /*
         * Permet de mettre à jour la date du RDV
         */
        $scope.changeDate = function (){

            /*
             * Popup de confirmation
             */
            $scope.popUrl = 'views/popups/rdv-change-date.html';

            /*
             * Personnalisation de la popup
             */
            $scope.popup = {
                "titre" : "Reporter",
                "message" : "",
                "class" : "",
                "boutons" : {
                    "confirm" : {
                        "titre" : "Reporter",
                        "action" : "confirm()"
                    },
                    "cancel" : {
                        "titre" : "Annuler",
                        "action" : "cancel()"
                    }
                }
            };

            /*
             * Jours du mois
             */
            $scope.jours = [];

            for(var i = 1; i <= 31; i++){

                $scope.jours.push(i);
            }

            /*
             * Mois de l'année
             */
            $scope.mois = [];

            for(var i = 1; i <= 12; i++){

                $scope.mois.push(i);
            }
            /*
             * Année
             */
            $scope.annees = [];

            for(var i = 2014; i <= 2020; i++){

                $scope.annees.push(i);
            }
            /*
             * Heures
             */
            $scope.heures = [];

            for(var i = 0; i <= 23; i++){

                $scope.heures.push(i);
            }
            /*
             * Minutes
             */
            $scope.minutes = [];

            for(var i = 0; i <= 55; i = i + 5){

                $scope.minutes.push(i);
            }

            /*
             * Met à jour et formate les valeurs des <select>
             */
            $scope.dateJour = $filter('date')($scope.item.date, "dd");
            $scope.dateMois = $filter('date')($scope.item.date, "MM");
            $scope.dateAnnee = $filter('date')($scope.item.date, "yyyy");
            $scope.dateHeure = $filter('date')($scope.item.date, "hh");
            $scope.dateMinute = $filter('date')($scope.item.date, "mm");

            $scope.onChangeDate = function (value, type){

                switch(type){

                    case 'jour' :
                        $scope.dateJour = value;
                        break;

                    case 'mois' :
                        $scope.dateMois = value;
                        break;

                    case 'annee' :
                        $scope.dateAnnee = value;
                        break;

                    case 'heure' :
                        $scope.dateHeure = value;
                        break;

                    case 'minute' :
                        $scope.dateMinute = value;
                        break;

                    default:
                        break;
                }
            };

            /*
             * L'utilisateur clique sur le bouton de Valider
             */
            $scope.confirm = function (){

                /*
                 * Construction du timestamp
                 * Attention : Au format anglais la date commence par le mois
                 */
                var newDate = $scope.dateMois + '/' + $scope.dateJour + '/' + $scope.dateAnnee + ' ' + $scope.dateHeure + ':' + $scope.dateMinute + ':00';

                var newTimestamp = new Date(newDate).getTime();

                /*
                 * @newTimestamJour sert pour le regroupement par date
                 */
                var newDateJour = $filter('date')(newTimestamp, "MM/dd/yyyy");

                var newTimestampJour = new Date(newDateJour).getTime();

                /*
                 * Sauvegarde de la nouvelle date via le service Data
                 */
                Data.updateRdv({
                    date : newTimestamp,
                    dateJour : newTimestampJour
                });

                /*
                 * Mise à jour de la date dans le scope
                 */
                $scope.item.date = newTimestamp;

                /*
                 * Vide la vue
                 */
                $scope.popUrl = null;
            };

            /*
             * L'utilisateur clique sur Annuler
             */
            $scope.cancel = function (){

                /*
                 * Vide la vue
                 */
                $scope.popUrl = null;
            };

        };

        /*
         * duplicateEvenement() : dupliquer un évènement.
         */
        $scope.duplicateEvenement = function (){

            /*
             * Popup de confirmation
             */
            $scope.popUrl = 'views/popups/alert.html';

            /*
             * Personnalisation de la popup
             */
            $scope.popup = {
                "titre" : "Dupliquer",
                "message" : "Voulez-vous dupliquer cet évènement ?",
                "class" : "success",
                "boutons" : {
                    "confirm" : {
                        "titre" : "Dupliquer",
                        "action" : "confirm()"
                    },
                    "cancel" : {
                        "titre" : "Annuler",
                        "action" : "cancel()"
                    }
                }
            };

            /*
             * L'utilisateur confirme la duplication
             */
            $scope.confirm = function (){

                /*
                 * Appelle la vue ps-search en passant le numéro de PS
                 */
                $window.location.hash = '#/ps-search/' + $scope.item.numero;
            };

            /*
             * L'utilisateur annule la duplication
             */
            $scope.cancel = function (){

                /*
                 * Vide la vue
                 */
                $scope.popUrl = null;
            };
        };

        /*
         * archiveEvenement() : archiver un évènement.
         */
        $scope.archiveEvenement = function (){

            /*
             * Popup de confirmation
             */
            $scope.popUrl = 'views/popups/alert.html';

            /*
             * Personnalisation de la popup
             */
            $scope.popup = {
                "titre" : "Archiver",
                "message" : "Êtes-vous sûr de vouloir archiver cet évènement ?",
                "class" : "",
                "boutons" : {
                    "confirm" : {
                        "titre" : "Archiver",
                        "action" : "confirm()"
                    },
                    "cancel" : {
                        "titre" : "Annuler",
                        "action" : "cancel()"
                    }
                }
            };

            /*
             * L'utilisateur confirme l'archivage
             */
            $scope.confirm = function (){

                /*
                 * Sauvegarde de la nouvelle date via le service Data
                 */
                Data.updateRdv({
                    archive : true
                });

                $window.location.hash = '#/rdv-list';
            };

            /*
             * L'utilisateur annule l'archivage
             */
            $scope.cancel = function (){

                /*
                 * Vide la vue
                 */
                $scope.popUrl = null;
            };
        };

        /*
         * deleteEvenement() : supprimer un évènement.
         */
        $scope.deleteEvenement = function (){

            /*
             * Popup de confirmation
             */
            $scope.popUrl = 'views/popups/alert.html';

            /*
             * Personnalisation de la popup
             */
            $scope.popup = {
                "titre" : "Supprimer",
                "message" : "Êtes-vous sûr de vouloir supprimer cet évènement ?",
                "class" : "danger",
                "boutons" : {
                    "confirm" : {
                        "titre" : "Supprimer",
                        "action" : "confirm()"
                    },
                    "cancel" : {
                        "titre" : "Annuler",
                        "action" : "cancel()"
                    }
                }
            };

            /*
             * L'utilisateur confirme la suppression
             */
            $scope.confirm = function (){

                /*
                 * Actions :
                 * 1 - Supprimer le rdv dans localStorage
                 * 2 - Supprimer le rdv sur le serveur
                 * 3 - Rediriger vers la page d'accueil
                 */
                Data.deleteRdv();

                /*
                 * Redirection vers la liste des RDV
                 */
                $window.location.hash = '#/rdv-list';
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
