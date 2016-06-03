/* jshint esversion: 6
*/

export function shuffle(collection){
	'use strict';
	/** The Durstenfeld shuffle, in JavaScript as explained here:
		http://stackoverflow.com/a/12646864	
	*/
	let elem_array = Array.from(collection);
	for(let cur_elem_idx = elem_array.length-1; cur_elem_idx > 0; --cur_elem_idx){
		let random_elem_idx = Math.floor(Math.random() * (cur_elem_idx + 1));
		let swap = elem_array[cur_elem_idx];
		elem_array[cur_elem_idx] = elem_array[random_elem_idx];
		elem_array[random_elem_idx] = swap;
		return elem_array;
	}

}