/*
 * SettingsCtrl : permet de paramétrer l'application (notifications, utilisateurs, avatars)
 */
Controllers.controller('SettingsCtrl', ['$scope', '$window', '$filter', 'Data', 'Notification', 'Soap',
    function ($scope, $window, $filter, Data, Notification, Soap){

        /*
         * Notifications : activer/désactiver
         */
        $scope.checked = Notification.isNotification();

        $scope.switchNotifications = function (){

            $scope.checked = Notification.switch();
        };

        /*
         * Efface toutes les données stockées dans localStorage
         */
        $scope.clearCache = function (){

            if(Data.clearCache() === true){

                $window.location.hash = '#/home';
            }
        };

        /*
         * Affiche une notification d'exemple
         */
        $scope.simulerNotification = function (){

            Notification.send({
                titre : "Nouveau remboursement",
                body : "Vous avez un remboursement d'un montant de 8,45€",
                icon : "img/avatars/cartman.jpg",
                test : true
            });
        };

        /*
         * Simule des RDV avec des remboursements de soins
         */
        $scope.simulerPaiements = function (){

            /*
             * @dateRdv : date du RDV saisie par l'utilisateur
             */
            var dateRdv = new Date().getTime() - (1000 * 60 * 60 * 24 * 5);

            /*
             * @dateRdvJour : convertit la date en timestamp sans l'heure
             */
            var dateRdvJour = new Date($filter("date")(dateRdv, "MM/dd/yyyy")).getTime();

            /*
             * @dateRdvRappel : date de rappel du RDV
             */
            var dateRdvRappel = dateRdv + 0;

            /*
             * @notes : notes saisies par l'utilisateur
             */
            var userNotes = "Apporter le carnet de santé du petit bonhomme";

            /*
             * @defaultDelaiRemboursement : délai de remboursement par défaut
             * + 5 jours
             */
            var defaultDelaiRemboursement = 1000 * 60 * 60 * 24 * 5;

            /*
             * @dateRemboursement : date de remboursement par défaut
             */
            var defaultDateRemboursement = new Date().getTime();

            /*
             * @defaultMontantRemboursement : montant total du remboursement
             */
            var defaultMontantRemboursement = 68.5;

            /*
             * @defaultTaux : taux de rembousement
             */
            var defaultTaux = 70;

            /*
             * @defaultMontantAS : part Assurance Maladie
             */
            var defaultMontantAS = 70;

            /*
             * @defaultMontantMutuelle : part mutuelle
             */
            var defaultMontantMutuelle = 30;

            /*
             * @defaultMontantPF : montant des participations forfaitaires
             */
            var defaultMontantPF = 1;

            /*
             * @defaultMontantFR : montant des franchises médicales
             */
            var defaultMontantFR = 0.5;

            /*
             * @defaultMontantPaye : montant réglé au PS par défaut
             */
            var defaultMontantPaye = 100;

            /*
             * @defaultEtat : etat aléatoire pour les tests
             */
            var defaultEtat = true;

            /*
             * @defaultRdvId : max ID des données RDV
             */
            var defaultRdvId = Data.getLastRdvId() + 1;

            /*
             * @arrBeneficiaire : informations sur le bénéficiaire récupérées depuis
             */
            var arrBeneficiaire = Data.getBeneficiairesList()[Math.ceil(Math.random()*2)];

            /*
             * Données sur le PS
             */
            var arrPs = {
                numero : "751225487",
                titre : "Dr. Tami Harrell",
                telephone : "0158386715",
                adresse : "21 rue Georges Auric, 75019 Paris"
            };

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
             * Crée le RDV via le service DATA
             */
            Data.createRdv(arrRdv);
        };
    }]);