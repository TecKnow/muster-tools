/* jshint esversion: 6
*/
(function muster_sef() {
	'use strict';
	
	function shuffle_button_work(){
		var list = $( "#sortable" );
		var items = $("#sortable li");
		list.detach();
		if(items.length){
			console.log("Found some items");
			for(let i = 0; i < items.length; ++i){
				console.log(items.eq(i).text());
			}
			//The Durstenfeld shuffle, in JavaScript as explained here:
			//http://stackoverflow.com/a/12646864
			for(let current = items.length - 1; current > 0; current--){
				let random = Math.floor(Math.random() * (current+1));
				items.eq(random).insertAfter(items.eq(current));
			}
			list.prependTo($('body'));
			list.fadeToggle('fast');
		} else {
			console.log("Selector did not find any list items");
		}
	}

	function suffle_button_setup( event ){
		var list = $( "#sortable" );
		list.fadeToggle('fast', shuffle_button_work);
	}

	function muster_main(){
	    $( "#sortable" ).sortable();
	    $( "#sortable" ).disableSelection();

	    $( "#shuffle" ).button().click(shuffle_button_callback);
		
	}
})();