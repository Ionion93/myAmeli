/*
 * Data : ce service gèrent les requêtes REST
 */
Services.factory('Data', ['$resource', '$filter', '$routeParams', '$log', 'localStorageService', 'Notification',
    function ($resource, $filter, $routeParams, $log, localStorageService, Notification){

        /*
         * @urlDataRdv : URL des données RDV
         */
        var urlDataRdv = './datas/data-rdv.json';

        /*
         * @urlDataBeneficiaires : URL des données bénéficiaires
         */
        var urlDataBeneficiaires = './datas/data-beneficiaires.json';

        /*
         * @urlDataPaiement  : URL des données de remboursement
         */
        var urlDataPaiement = null;

        /*
         * Super class
         */
        var request = {
            /*
             * Vérifie si les données des RDV sont dans localStorage
             */
            isDataRdv : function (){

                var status = false;

                if(localStorageService.isSupported){

                    /*
                     * LocalStorage est supporté
                     */
                    if(localStorageService.get("data-rdv") !== null){

                        /*
                         * Les données sont présentes dans localStorage
                         */
                        status = true;
                    }
                }

                return status;
            },
            /*
             * Liste tous les RDV de l'assuré et de ses bénéficiaires
             */
            getRdvList : function (){

                /*
                 * Les données ne sont pas dans localStorage
                 */
                var data = request.isDataRdv() === true ? localStorageService.get("data-rdv") : [];

                /*
                 * @lastData : date des dernières données sauvegardées
                 */
                var dateData = localStorageService.isSupported && localStorageService.get("data-rdv-date") !== null ? localStorageService.get("data-rdv-date") : new Date().getTime();

                /*
                 * @arrData : objet qui contient les données mises à jour
                 */
                var arrData = [];

                /*
                 * On parcoure les données à la recherche de nouveau paiement
                 */
                angular.forEach(data, function (item){

                    /*
                     * A FAIRE : vérifier si un paiement à eu lieu et
                     * enrichir l'élement avec les données de paiement
                     */

                    /*
                     * NOTIFICATION DE RAPPEL
                     *
                     * Envoi une notification si :
                     * 1 - les notifications sont activées
                     * 2 - la date du jour est égale ou supérieur à la date de rappel
                     * 3 - le rappel n'a pas encore été notifié
                     */
                    if(Notification.isNotification() === true
                        && new Date().getTime() >= item.dateRappel
                        && item.dateRappel !== null
                        && item.rappel === false){

                        /*
                         * Envoi une notification via le service Notification
                         */
                        Notification.send({
                            id : item.id,
                            titre : "Rappel de rendez-vous",
                            body : "Un rendez-vous arrive à échéance. Cliquez pour en savoir plus.",
                            icon : item.beneficiaire.avatar
                        });

                        /*
                         * Une fois la notification envoyée, on change le status de celle-ci
                         */
                        item.rappel = true;
                    }

                    /*
                     * NOTIFICATION DE REMBOURSEMENT
                     *
                     * Envoi une notification si :
                     * 1 - les notifications sont activées
                     * 2 - la date des dernières données est connue
                     * 4 - le remboursement SS a été effectué
                     * 5 - la notification n'a pas encore été envoyée
                     */
                    if(Notification.isNotification() === true
                        && dateData !== null
                        && item.remboursement.date !== null
                        && item.etat === true
                        && item.notification === false){

                        /*
                         * Envoi une notification via le service Notification
                         */
                        Notification.send({
                            id : item.id,
                            titre : "Nouveau remboursement",
                            body : "Vous avez reçu un remboursement le " + $filter('date')(item.remboursement.date, 'dd/MM/yyyy') + " d'un montant de " + item.remboursement.montant + "€.",
                            icon : item.beneficiaire.avatar
                        });

                        /*
                         * Une fois la notification envoyée on change le status de celle-ci
                         */
                        item.notification = true;
                    }

                    /*
                     * Insère l'élement dans l'objet
                     */
                    arrData.push(item);
                });

                /*
                 * On sauvegarde les données dans localStorage
                 */
                if(localStorageService.isSupported){

                    localStorageService.set("data-rdv", arrData);

                    localStorageService.set("data-rdv-date", dateData);
                }

                /*
                 * Renvoi l'objet
                 */
                return arrData;
            },
            /*
             * Renvoie le max ID des données RDV
             */
            getLastRdvId : function (){

                /*
                 * Récupère les données RDV
                 */
                var data = request.getRdvList();

                /*
                 * S'il n'y pas encore de données
                 * renvoie l'ID 0
                 */
                if(data.length === 0){

                    return -1;
                }

                /*
                 * Crée un tableau contenant tous les ID
                 */
                var arrId = Object.keys(data).map(function (k){

                    return data[k].id;
                });

                /*
                 * Tri décroissant des ID
                 */
                arrId.sort(function (a, b){

                    return b - a;
                });

                /*
                 * ID le plus élevé
                 */
                return arrId[0];
            },
            /*
             * Récupère le détail d'un RDV
             */
            getRdvDetail : function (params){

                /*
                 * @data : tous les RDV
                 */
                var data = request.getRdvList();

                /*
                 * @result : détail d'un RDV
                 */
                var result = $filter("filter")(data, {id : parseInt($routeParams.id, 0)})[0];

                return result;
            },
            /*
             * Supprimer un RDV
             */
            deleteRdv : function (){

                /*
                 * Récupère les données RDV
                 */
                var data = request.getRdvList();

                /*
                 * Nouvel objet qui contient les RDV
                 */
                var arrData = [];

                /*
                 * Supprime le RDV par son ID dans la liste des RDV
                 */
                arrData = data.filter(function (item){

                    return item.id !== parseInt($routeParams.id, 0);
                });

                /*
                 * Mise à jour des donnés dans localStorage
                 */
                if(localStorageService.isSupported){

                    localStorageService.set("data-rdv", arrData);
                }
            },
            /*
             * Mise à jour d'un RDV
             * @params : objet qui contient les élements à mettre à jour
             */
            updateRdv : function (params){

                var data = request.getRdvList();

                /*
                 * Nouvel objet qui contient les RDV
                 */
                var arrData = [];

                angular.forEach(data, function (item){

                    if(item.id === parseInt($routeParams.id)){

                        angular.forEach(params, function (value, param){

                            /*
                             * Met à jour l'élément du RDV avec la nouvelle valeur
                             */
                            item[param] = value;
                        });
                    }

                    arrData.push(item);
                });

                /*
                 * Mise à jour des donnés dans localStorage
                 */
                if(localStorageService.isSupported){

                    localStorageService.set("data-rdv", arrData);
                }
            },
            /*
             * Crée un nouveau RDV
             */
            createRdv : function (obj){

                /*
                 * Récupère la liste des RDV
                 */
                var data = request.getRdvList();

                /*
                 * Ajoute le nouveau RDV
                 */
                data.push(obj);

                /*
                 * Enregistrement et mise à jour dans localStorage
                 */
                if(localStorageService.isSupported){

                    localStorageService.set("data-rdv", data);

                    localStorageService.set("data-rdv-date", new Date().getTime());
                }

                return true;
            },
            /*
             * Vérifie si les données sur les bénéficiaires sont dans localStorage
             */
            isDataBeneficiaires : function (){

                var status = false;

                if(localStorageService.isSupported){

                    /*
                     * LocalStorage est supporté
                     */
                    if(localStorageService.get("data-beneficiaires") !== null){

                        /*
                         * Les données sont présentes dans localStorage
                         */
                        status = true;
                    }
                }

                return status;
            },
            /*
             * Liste tous les bénéficiaires du compte
             */
            getBeneficiairesList : function (){

                /*
                 * Données chargées en local
                 */
                if(request.isDataBeneficiaires() === true){

                    $log.info("Données bénéficiaires chargées depuis localStorage");

                    return localStorageService.get("data-beneficiaires");
                }

                /*
                 * Données chargées en distant
                 */
                var resource = $resource(urlDataBeneficiaires, {}, {
                    query : {
                        method : 'GET',
                        params : {user : request.getUser()},
                        isArray : true,
                        responseType : 'json',
                        transformResponse : function (data){

                            /*
                             * Sauvegarde les données dans localStorage
                             */
                            if(localStorageService.isSupported){

                                localStorageService.set("data-beneficiaires", data);
                            }

                            return data;
                        }
                    }
                });

                /*
                 * Renvoi les données
                 */
                return resource.query();
            },
            /*
             * Met à jout les informations d'un bénéficiaires
             * @params : objet qui contient l'élement à mettre à jour
             */
            updateBeneficiaire : function (params){

                /*
                 * @data : données existantes
                 */
                var data = request.getBeneficiairesList();

                /*
                 * Mise à jour de la combinaison element/valeur
                 */
                data[params.id][params.element] = params.valeur;

                /*
                 * Sauvegarde des données modifiées
                 */
                if(localStorageService.isSupported){

                    localStorageService.set("data-beneficiaires", data);
                }

                /*
                 * Si l'élément modifié est l'avatar, on propage la modification
                 * dans les données RDV
                 */
                if(params.element === 'avatar'){

                    $log.log(params);

                    /*
                     * @data : données des RDV existantes
                     */
                    var data = request.getRdvList();

                    /*
                     * @arrData : nouvelles données
                     */
                    var arrData = [];

                    angular.forEach(data, function (item){

                        if(item.beneficiaire.id === params.id){

                            /*
                             * Met à jour l'avatar du bénéficiaire
                             */
                            item.beneficiaire.avatar = params.valeur;
                        }

                        arrData.push(item);
                    });

                    /*
                     *  Si localStorage est supporté on l'utilise
                     */
                    if(localStorageService.isSupported){

                        /*
                         * On sauvegarde les datas dans localStorage pour optimiser
                         */
                        localStorageService.set("data-rdv", arrData);

                        /*
                         * On sauvegarde la date de la mise à jour des données
                         */
                        localStorageService.set("data-rdv-date", new Date().getTime());
                    }
                }
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

                /*
                 * Chargement des données Bénéficiaires
                 */
                request.getBeneficiairesList();

                /*
                 * Chargement des données RDV
                 */
                request.getRdvList();

                return true;
            },
            /*
             * Retourne le NIR de l'utilisateur courant depuis localStorage
             */
            getUser : function (){

                if(localStorageService.isSupported){

                    if(localStorageService.get("user") !== null){

                        return localStorageService.get("user");
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
            },
            /*
             * Retourne la liste des favoris
             */
            getFavorisList : function (){

                if(localStorageService.isSupported){

                    if(localStorageService.get("favoris") !== null){

                        return localStorageService.get("favoris");
                    }else{

                        return [];
                    }
                }

                return false;
            },
            /*
             * Ajoute le PS ou l'établissement dans les favoris
             */
            setFavori : function (params){
                /*
                 * Récupération des favoris stockés dans LocalStorage
                 * et ajout du nouvel élément
                 */
                var arrData = request.getFavorisList();
                arrData.push(params);

                /*
                 * Mise à jour des donnés dans localStorage
                 */
                if(localStorageService.isSupported){

                    localStorageService.set("favoris", arrData);
                }
            },
            /*
             * Ajoute le PS ou l'établissement dans les favoris
             */
            deleteFavori : function (param){
                /*
                 * On récupère les favoris stockés dans LocalStorage
                 */
                var data = request.getFavorisList();

                /*
                 * On parcourt la liste des favoris pour constituer une nouvelle liste
                 * qui ne contiendra pas l'élément passé en paramètre
                 */
                var arrData = [];

                angular.forEach(data, function (item){

                    if(item.numero !== param){

                        arrData.push(item);
                    }
                });

                /*
                 * Mise à jour des donnés dans localStorage
                 */
                if(localStorageService.isSupported){

                    localStorageService.set("favoris", arrData);
                }
            },
            /*
             * Retourne true si le PS ou l'établissement est dans les favoris
             */
            isFavori : function (param){
                /*
                 * On récupère les favoris stockés dans LocalStorage
                 */
                var data = request.getFavorisList();

                var retour = false;

                /*
                 * On parcourt la liste des favoris pour chercher le PS ou l'établissement passé en paramètre
                 */
                angular.forEach(data, function (item){

                    if(item.numero === param){
                        retour = true;
                    }
                });

                return retour;
            }

        };

        return request;
    }]);