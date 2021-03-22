<script>
	import { onMount, onDestroy } from 'svelte';
	import NumbersSign from './Components/NumberSign.svelte';
	import TimeUse from './Components/TimeUse.svelte';
	import Levels from './Components/Levels.svelte';

	import SudokuCore from './utils/SudokuCore';

	import { usedTime } from './store.js';

	const DIFFICULTY = .95;

	let sudoku = [],
		sudoku_copy = [],
		sudokuCore = new SudokuCore(),
		is_done = false,
		curr_difficulty = DIFFICULTY,
		prev_difficulty = curr_difficulty;

	onMount(() => {
		resetSudoku();
	});

	onDestroy(() => {
		usedTime.stop();
	});

	function copySudoku(sudoku) {
		sudoku_copy = sudoku.map(rows => rows.map(ele => ele));
	}

	function keydownHandler(rows_id, cell_id, e) {
		let keyCode = e.keyCode;

		if (keyCode === 8) {
			sudoku[rows_id][cell_id] = '';
		}

		if (keyCode === 116) {
			window.location.reload();
		}

		if ((keyCode >= 49 && keyCode <= 57) ||
			(keyCode >= 97 && keyCode <= 105)) {
			return;
		} else {
			e.preventDefault();
		}
	}

	function keyupHandler(rows_id, cell_id, e) {
		let keyCode = e.keyCode;

		if (keyCode === 229) {
			e.target.value = '';
			sudoku[rows_id][cell_id] = '';
		}

		e.target.blur();
	}

	function changeHandler(rows_id, cell_id, e) {
		let val = e.target.value.trim();
		val = val.slice(val.length - 1);
		sudoku[rows_id][cell_id] = val;

		let sudoku_t = sudoku.map(rows => rows.map(ele => parseInt(ele)));
		is_done = sudokuCore.checkSudoku(sudoku_t);

		if (is_done) {
			sudoku = sudoku_t;
			usedTime.stop();
		}
	}

	function restartSudoku() {
		sudoku = sudoku_copy;
		copySudoku(sudoku_copy);
		curr_difficulty = prev_difficulty;
		is_done = false;
		usedTime.start();
	}

	function resetSudoku() {
		sudoku = sudokuCore.createBlankCell(sudokuCore.initializeSudoku(), curr_difficulty);
		copySudoku(sudoku);
		prev_difficulty = curr_difficulty;
		is_done = false;
		usedTime.start();
	}

	function changeDifficulty(e) {
		let val = e.detail.value;
		curr_difficulty = val;
	}
</script>

<style>
	.sudoku-wrap {
		margin: 20px auto;
		width: 360px;
		font-size: 14px;
		color: #36f;
		text-align: center;
		user-select: none;
	}
	.sudoku {
		flex: 1;
		transition: transform .2s ease-in;
	}
	.sudoku.s-done {
		transition: transform .2s ease-out;
		transform: scale(.95);
	}
	.title {
		margin-bottom: -1px;
		border: 1px solid #ccc;
		font-size: 20px;
		line-height: 2;
	}
	.grids-wrap {
		font-size: 16px;
	}
	.grids {
		display: flex;
		height: 40px;
		line-height: 40px;
	}
	.cell {
		flex: 1;
		border: 1px solid #ccc;
	}
	.grids:not(:nth-child(3n+1)) {
		margin-top: -1px;
	}
	.cell:not(:nth-child(3n+1)) {
		margin-left: -1px;
	}
	.cell input {
		border: 0;
		width: 38px;
		height: 33px;
		font-size: 16px;
		text-align: center;
		color: #36f;
		background-color: #f7f7f7;
	}
	.cell input:focus {
		margin-bottom: -2px;
		box-shadow: 0 0 10px #ccc;
		transform: translate(0, -2px) scale(1.15, 1.3);
	}
	button {
		margin-right: 20px;
		padding: 5px 10px;
		background-color: #fff;
		border: 1px solid #ccc;
		border-radius: 4px;
		cursor: pointer;
		transition: transform .1s ease-out;
	}
	button:hover {
		transform: scale(.98) translate(0, 1px);
	}
</style>

<div class="sudoku-wrap">
	<div class="sudoku { is_done ? 's-done' : '' }">
		<div class="title">Sudoku</div>

		<div class="grids-wrap">
			{ #each sudoku as rows, rows_id (rows_id) }
				<ul class="grids">
					{ #each rows as cell, cell_id (cell_id) }
						<li class="cell">
							{ #if typeof cell === 'number' }
								{ cell }
							{ :else }
								<input bind:value={ cell }
										on:keydown={ (e) => keydownHandler(rows_id, cell_id, e) }
										on:keyup={ (e) => keyupHandler(rows_id, cell_id, e) }
										on:change={ (e) => changeHandler(rows_id, cell_id, e) }>
							{ /if }
						</li>
					{ /each }
				</ul>
			{ /each }
		</div>
	</div>

	<Levels levels={ sudokuCore.levels } curr_difficulty={ curr_difficulty } on:choseDifficulty={ changeDifficulty } />

	<TimeUse />

	<button on:click={ restartSudoku }>重新此局</button>
	<button on:click={ resetSudoku }>新的一局</button>

	<NumbersSign sudoku={ sudoku } />
</div>