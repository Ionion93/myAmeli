/*
 * Data : ce service gèrent les requêtes REST
 */
Services.factory('Data', ['$resource', '$filter', '$routeParams', '$log', 'localStorageService', 'Notification',
    function ($resource, $filter, $routeParams, $log, localStorageService, Notification){

        /*
         * @dateExpiration : délai d'expiration des données
         * + 10 min
         */
        var dateExpiration = new Date().getTime() - 1000 * 60 * 10;
        //var dateExpiration = new Date().getTime() + 10;

        /*
         * @defaultDelaiRemboursement : délai de remboursement par défaut
         * + 5 jours
         */
        var defaultDelaiRemboursement = 1000 * 60 * 60 * 24 * 5;

        /*
         * @defaultMontantPaye : montant réglé au PS par défaut
         */
        var defaultMontantPaye = 50;

        /*
         * @urlDataRdv : URL des données RDV
         */
        var urlDataRdv = './datas/data-rdv.json';

        /*
         * @urlDataBeneficiaires : URL des données bénéficiaires
         */
        var urlDataBeneficiaires = './datas/data-beneficiaires.json';

        var request = {
            /*
             * Vérifie si les données sont dans localStorage et sont à jour
             */
            isDataRdv : function (){

                var status = false;

                if(localStorageService.isSupported){
                    /*
                     * LocalStorage est supporté
                     */

                    if(localStorageService.get("data-rdv") !== null
                        && localStorageService.get("data-rdv-date") !== null){
                        /*
                         * Les données sont présentes dans localStorage
                         */
                        status = true;

                        if(localStorageService.get("data-rdv-date") < dateExpiration){
                            /*
                             * Les données ne sont pas à jour
                             */
                            status = false;
                        }
                    }
                }

                return status;
            },
            /*
             * Liste tous les RDV de l'assuré et de ses bénéficiaires
             */
            getRdvList : function (params){

                /*
                 * Données locales
                 * Si les données sont présentes et à jours on les charge depuis localStorage
                 * Sinon on les charge depuis le serveur
                 */
                if(request.isDataRdv() === true){

                    $log.info('Données chargées depuis localStorage');

                    return localStorageService.get("data-rdv");
                }

                /*
                 * Données distantes
                 */
                var resource = $resource(urlDataRdv, {}, {
                    query : {
                        method : 'GET',
                        params : {user : request.getUser()},
                        isArray : true,
                        responseType : 'json',
                        transformResponse : function (data){

                            $log.info('Données chargées depuis le serveur');

                            /*
                             * @dateLastData : date des dernières données dans localStorage
                             */
                            var dateLastData = localStorageService.isSupported && localStorageService.get("data-rdv-date") !== null ? localStorageService.get("data-rdv-date") : null;

                            /*
                             * @arrItems : liste de tous les RDV
                             */
                            var arrItems = [];

                            angular.forEach(data, function (item){

                                /*
                                 * A FAIRE :
                                 * Pour les tests : génère une date aléatoire dans les 10 derniers jours
                                 * Si le remboursement à eu lieu on enlève 5 jours à la date du RDV
                                 * Et on compte 5 jours de plus pour la date de remboursement
                                 */
                                var nbRandom = Math.ceil(Math.random() * (1000 * 60 * 60 * 24 * 10));

                                item.date = new Date().getTime() - nbRandom;

                                if(item.etat === true){

                                    item.date = item.date - (1000 * 60 * 60 * 24 * 5);

                                    item.remboursement.date = item.date + (1000 * 60 * 60 * 24 * 5);
                                }

                                /*
                                 * @dateJour : timestamp de la date sans l'heure pour le regroupement
                                 */
                                item.dateJour = new Date($filter("date")(item.date, "MM/dd/yyyy")).getTime();

                                /*
                                 * Delai de remboursement par défaut
                                 */
                                item.delaiRemboursement = defaultDelaiRemboursement;

                                /*
                                 * Montant payé par défaut
                                 */
                                item["montantPaye"] = defaultMontantPaye;

                                /*
                                 * Ajoute l'élément dans l'objet
                                 */
                                arrItems.push(item);

                                /*
                                 * Envoi une notification si :
                                 * 1 - les notifications sont activées
                                 * 2 - la date des dernières données est connue
                                 * 3 - la date de remboursement est supérieur à la date des dernières données
                                 * 4 - le remboursement SS a été effectué
                                 * 5 - la notification n'a pas encore été envoyée
                                 */
                                if(Notification.isNotification() === true
                                    && dateLastData !== null
                                    && item.remboursement.date > dateLastData
                                    && item.etat === true
                                    && item.notification === false){

                                    Notification.send({
                                        id : item.id,
                                        titre : 'Nouveau remboursement',
                                        body : "Vous avez reçu un remboursement le " + $filter('date')(item.remboursement.date, 'dd/MM/yyyy') + " d'un montant de " + item.remboursement.montant + "€.",
                                        icon : item.beneficiaire.avatar
                                    });
                                }

                            });

                            /*
                             * Timestamp actuel
                             */
                            var dateNow = new Date().getTime();

                            /*
                             *  Si localStorage est supporté on l'utilise
                             */
                            if(localStorageService.isSupported){

                                /*
                                 * On sauvegarde les datas dans localStorage pour optimiser
                                 */
                                localStorageService.set("data-rdv", arrItems);

                                /*
                                 * On sauvegarde la date de la mise à jour des données
                                 */
                                localStorageService.set("data-rdv-date", dateNow);
                            }

                            /*
                             * On retourne l'objet
                             */
                            return arrItems;
                        }
                    }
                });

                return resource.query();
            },
            /*
             * Récupère le détail d'un RDV
             *
             * @params : ATTENTION : il faut passer un objet {} pour récupérer tous les paramètres
             */
            getRdvDetail : function (params){

                /*
                 * @data : tous les RDV
                 * @result : détail d'un RDV
                 */
                var data, result = null;

                data = request.getRdvList();

                /*
                 * On parcoure l'objet à la recherche du RDV
                 */
                angular.forEach(data, function (item){

                    if(item.id === parseInt($routeParams.id, 0)){

                        result = item;
                    }
                });

                return result;
            },
            /*
             * Supprimer un RDV
             */
            deleteRdv : function (){

                var data = request.getRdvList();

                /*
                 * Nouvel objet qui contient les RDV
                 */
                var arrItems = [];

                angular.forEach(data, function (item){

                    if(item.id !== parseInt($routeParams.id, 0)){

                        arrItems.push(item);
                    }
                });

                /*
                 * Mise à jour des donnés dans localStorage
                 */
                if(localStorageService.isSupported){

                    localStorageService.set("data-rdv", arrItems);
                }
            },
            /*
             * Mise à jour d'un RDV
             */
            updateRdv : function (params){

                var data = request.getRdvList();

                /*
                 * Nouvel objet qui contient les RDV
                 */
                var arrItems = [];

                angular.forEach(data, function (item){

                    if(item.id === parseInt($routeParams.id)){

                        angular.forEach(params, function (value, param){

                            /*
                             * Met à jour l'élément du RDV avec la nouvelle valeur
                             */
                            item[param] = value;
                        });
                    }

                    arrItems.push(item);
                });

                /*
                 * Mise à jour des donnés dans localStorage
                 */
                if(localStorageService.isSupported){

                    localStorageService.set("data-rdv", arrItems);
                }
            },
            /*
             * Liste tous les bénéficiaires
             */
            getBeneficiairesList : function (){

                var resource = $resource(urlDataBeneficiaires, {}, {
                    query : {
                        method : 'GET',
                        params : {user : request.getUser()},
                        isArray : true,
                        responseType : 'json',
                        transformResponce : function (data){
                            return data;
                        }
                    }
                });

                return resource.query();
            },
            /*
             * Vérifie le login et mot de passe
             *
             * @params : {
             *      nir : numéro SS
             *      password : mot de passe Ameli
             *	}
             *
             *	A FAIRE :
             */
            loginUser : function (params){

                if(localStorageService.isSupported){

                    localStorageService.set("user", params.nir);
                }

                return true;
            },
            /*
             * Retourne le NIR de l'utilisateur courant depuis localStorage
             */
            getUser : function (){

                if(localStorageService.isSupported){

                    if(localStorageService.get("user") !== null){

                        return localStorageService.get("user");
                    }else{

                        return false;
                    }
                }

                return false;
            },
            /*
             * Est-ce la première visite ?
             */
            isFirstVisit : function (){

                if(localStorageService.isSupported){

                    if(localStorageService.get("is-first-visit") !== null){

                        return false;
                    }else{

                        localStorageService.set("is-first-visit", false);

                        return true;
                    }
                }

                return true;
            },
            /*
             * Réinitialise l'application
             * Vide toutes les données de localStorage
             */
            clearCache : function (){

                if(localStorageService.isSupported){

                    localStorageService.clearAll();
                }

                return true;
            }
        };

        return request;
    }]);