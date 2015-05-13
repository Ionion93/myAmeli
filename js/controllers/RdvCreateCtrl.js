/*
 * RdvCreateCtrl : permet de créer un nouveau RDV avec les informations récupérées
 * depuis la vue de recherche d'un PS et les informations saisies par l'utilisateur
 */
Controllers.controller('RdvCreateCtrl', ['$scope', '$log', '$filter', 'Data',
    function ($scope, $log, $filter, Data){

        /*
         * @arrBeneficiaire : informations sur le bénéficiaire récupérées depuis
         * le service Data
         *
         * A FAIRE : Récupérer le vrai ID du bénéficiaire. Pour les test, l'ID est
         * généré aléatoirement
         */

        $log.log("Nb rdv dans localStorage : " + Data.getRdvList().length);

        var arrBeneficiaire = Data.getBeneficiairesList()[Math.ceil(Math.random() * Data.getBeneficiairesList().length - 1)];

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
         * @dateRdv : date du RDV saisie par l'utilisateur
         *
         * A FAIRE : date générée aléatoire
         */
        var dateRdv = new Date().getTime() - Math.ceil(Math.random() * (1000 * 60 * 60 * 24 * 10));

        /*
         * @dateRdvJour : convertit la date en timestamp sans l'heure
         */
        var dateRdvJour = new Date($filter("date")(dateRdv, "MM/dd/yyyy")).getTime();

        /*
         * @notes : notes saisies par l'utilisateur
         */
        var userNotes = null;

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
         * @defaultMontantPaye : montant réglé au PS par défaut
         */
        var defaultMontantPaye = null;

        /*
         * @defaultEtat : etat aléatoire pour les tests
         */
        var defaultEtat = false;

        /*
         * @maxId : max ID des données RDV
         */
        var defaultRdvId = Data.getLastRdvId() + 1;

        /*
         * @arrRdv : Objet nouveau RDV
         */
        var arrRdv = {
            id : defaultRdvId,
            type : "rdv",
            date : dateRdv,
            dateJour : dateRdvJour,
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
            titre : arrPs.titre,
            numero : arrPs.numero,
            telephone : arrPs.telephone,
            adresse : arrPs.adresse,
            notes : userNotes,
            etat : defaultEtat,
            delaiRemboursement : defaultDelaiRemboursement,
            montantPaye : null,
            remboursement : {
                etat : defaultEtat,
                delaiRemboursement : defaultDelaiRemboursement,
                montant : defaultMontantPaye,
                date : defaultDateRemboursement
            },
            archive : false,
            notification : false
        };

        /*
         * Crée le RDV en faisant appel au service Data
         */
        Data.createRdv(arrRdv);
    }]);
