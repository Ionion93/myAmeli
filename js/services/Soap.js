/*
 * Soap : ce service gère les requêtes SOAP
 */
Services.factory('Soap', ['$soap', '$filter', '$log',
    function ($soap, $filter, $log){
		
		var base_url = "http://www.cooldomain.com/SoapTest/webservicedemo.asmx";

		return {
			
			maFonction : function(){
				
				return $soap.post(base_url, "HelloWorld");
			}
		};
		
	}]);