/* jshint esversion: 6
*/
(function muster_sef() {
	'use strict';
	
	function healer_flag_checkbox(event){
		if($(this).prop('checked')){
			$( "#healer-true" ).show();
			$( "#healer-false" ).hide();
		} else {
			$( "#healer-true" ).hide();
			$( "#healer-false" ).show();
		}
	}

	function DM_flag_checkbox(event){
		if($(this).prop('checked')){
			$( "#DM-true" ).show();
			$( "#DM-false" ).hide();
			$( "#character-info-fieldset" ).hide();
		} else {
			$( "#DM-true" ).hide();
			$( "#DM-false" ).show();
			$( "#character-info-fieldset" ).show();
		}
	}

	function shuffle(collection){
		/** The Durstenfeld shuffle, in JavaScript as explained here:
			http://stackoverflow.com/a/12646864	
		*/
		let elem_array = Array.from(collection);
		for(let cur_elem_idx = elem_array.length-1; cur_elem_idx > 0; --cur_elem_idx){
			let random_elem_idx = Math.floor(Math.random() * (cur_elem_idx + 1));
			let swap = elem_array[cur_elem_idx];
			elem_array[cur_elem_idx] = elem_array[random_elem_idx];
			elem_array[random_elem_idx] = swap;
		}
		return elem_array;
	}

	function shuffle_button_work(){
		let list = $( "#player_deck" );
		let items = $("#player_deck div");
		list.detach();
		items = $(shuffle(items));
		list.append(items);
		list.prependTo($('#player_deck_slot'));
		list.fadeToggle('fast');
	}

	function suffle_button_setup( event ){
		let list = $( "#player_deck" );
		list.fadeToggle('fast', shuffle_button_work);
	}

	function muster_main(){
		$( "#tabs" ).tabs();
    	$( "#DM_flag" ).button();
    	$( "#DM_flag_label .ui-button-text").disableSelection()
    	$( '#DM_flag').click(DM_flag_checkbox);
    	$( "#healer_flag" ).button();
    	$( "#healer_flag_label .ui-button-text").disableSelection()
    	$( '#healer_flag').click(healer_flag_checkbox);
	    
	    $( "#player_deck" ).sortable();
	    $( "#player_deck" ).disableSelection();

	    $( "#shuffle" ).button().click(suffle_button_setup);
		
	}
	$(document).ready(muster_main);
})();
