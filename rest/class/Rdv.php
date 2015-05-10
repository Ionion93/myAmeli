<?php
/*
  Ce script permet :
  1 - Lister les RDV
  2 - Lister le détail RDV
  3 - Créér un RDV
  4 - Supprime un RDV
  5 - Met à jour un RDV
 */

class Rdv{
    /*
      @request : paramètres de l'URL
     */
    public $request;

    /*
      @action : action demandée
     */
    private $action;

    /*
      @user : NIR
     */
    private $user;

    /*
      @id : ID du RDV
     */
    private $id;

    /*
      @data : données au format JSON
     */
    private $data;

    function __construct($request){

        $this -> request = $request;

        $this -> action = $this -> request['action'];

        switch($this -> action){

            case 'list':

                $this -> user = $this -> request['user'];

                $this -> listRdv();

                break;

            case 'detail':

                $this -> id = $this -> request['id'];

                $this -> detailRdv();

                break;

            case 'create':

                $this -> id = $this -> request['id'];

                $this -> createRdv();

                break;

            case 'delete':

                $this -> id = $this -> request['id'];

                $this -> deleteRdv();

                break;

            case 'update':

                $this -> id = $this -> request['id'];

                $this -> updateRdv();

                break;

            default:

                /*
                  Pour test
                 */
                $fopen = fopen('./datas/data.json' , 'r');

                $fread = fread($fopen , '4096');

                $this -> data = json_decode($fread);

                break;
        }
    }

    /*
      Liste tous les RDV d'un utilisateur
     */
    function listRDV(){

        require_once('inc/bdd.php');

        $req = $db -> query("SELECT *
		FROM rdv
		WHERE nir = $this -> user");

        $this -> data = $req -> fetch_object();

        $req -> close();
    }

    function detailRDV(){

    }

    function createRdv(){

    }

    function deleteRDV(){

    }

    function updateRdv(){

    }

    function __destruct(){

        header('Content-Type: application/json');

        echo json_encode($this -> data);
    }

}
