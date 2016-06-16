/* jshint esversion: 6
*/
(function muster_sef() {
	'use strict';
	
	function make_player(first_name, last_name, DCI_number, DM, healer){
	
		let player = $(
			'<div class="player" style="display:none;">' +
				'<div class="player-first-name">'+ first_name + '</div>' +
				'<div class="player-last-name">' + last_name + '</div>' +
				'<div class="player-DCI-number">' + DCI_number + '</div>' +
				'<div class ="player-DM">' + DM + '</div>' +
			'</div>'
			);
		if(!DM){
			$(player).append(
				'<div class="player-healer">'  + healer + '</div>');
		}
		return player;
	}

	function player_card(player){
		let first_name = $(player).children( ".player-first-name" ).text();
		let last_name = $(player).children( ".player-last-name" ).text();

		let card_div = $(
			'<div class="ui-state-default player-card">' + 
				'<span class="ui-icon ui-icon-arrowthick-2-n-s"></span>' + first_name + ' ' + last_name + '</div>');
		card_div.append(player);
		return card_div;
	}

	function player_sign_up_reset_handler(event){
		setTimeout(player_sign_up_post_reset, 0);
	}
	
	function player_sign_up_post_reset(){
		$( '#DM_flag' ).trigger('change');
		$( '#healer_flag' ).trigger('change');
	}

	function sign_up_submit_handler(event){
		event.preventDefault();
		
		let new_player = make_player(
			$('#first_name').val(),
			$('#last_name').val(), 
			$('#DCI_number').val(),
			$('#DM_flag').prop('checked'),
			$('#healer_flag').prop('checked'));
		let new_player_card = player_card(new_player);
		$('#player_deck').append(new_player_card);
		$('#player-sign-up').trigger('reset');
}

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
		let items = $("#player_deck .player-card");
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
    	$( '#DM_flag').on('change', DM_flag_checkbox);
    	$( "#healer_flag" ).button();
    	$( "#healer_flag_label .ui-button-text").disableSelection()
    	$( '#healer_flag').on('change', healer_flag_checkbox);
    	$( '#sign-up-button').button();
    	$( '#player-sign-up').submit(sign_up_submit_handler);
    	$( "#sign-up-reset-button").button();
    	$( '#player-sign-up' ).on('reset', player_sign_up_reset_handler);

	    
	    $( "#player_deck" ).sortable();
	    $( "#player_deck" ).disableSelection();

	    $( "#shuffle" ).button().click(suffle_button_setup);
		
	}
	$(document).ready(muster_main);
})();
