const NUMBER = {
	EMPTY: 0,
	CROSS: 1,
	NOUGHT: -1
};

const CHAR = {
	EMPTY: '-',
	CROSS: 'X',
	NOUGHT: 'O'
};

const STATE = {
	INIT: 0,
	ACTIVE: 1,
	OVER: 2
};

const configurations = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6]
];

const algorithmSl = document.querySelector('#algorithm');
const playerCrossBt = document.querySelector('#player-cross');
const playerNoughtBt = document.querySelector('#player-nought'); 
const boardEl = document.querySelector('#board');

let gameState = STATE.INIT;
let didPlayerStart = true;
let algorithm;

function generateOptions(state) {
	const options = [];
	state.forEach((num, index) => {
		if (num === NUMBER.EMPTY)
			options.push(index);
	});
	return options;
}

function generateStateFromBoard() {
	return [...board.children].map((square) => {
		switch(square.textContent) {
			case CHAR.CROSS: return NUMBER.CROSS;
			case CHAR.NOUGHT: return NUMBER.NOUGHT;
			default: return NUMBER.EMPTY;
		}
	});
}


function generateUtility(state, depth = -1) {
	if (depth !== -1) {
		for (const [x, y, z] of configurations) {
			if (state[x] === NUMBER.EMPTY)
				continue;

			if ((state[x] === state[y]) && (state[y] === state[z])) {
				const utility = (state[x] === NUMBER.CROSS) ? 1000 - depth : depth - 1000;
				return { 
					terminal: true,
					utility: utility
				};
			}
		}
		const options = generateOptions(state);
		if (options.length === 0) {
			return {
				terminal: true,
				utility: Math.abs(depth)
			};
		}
	} else {
		for (const [x, y, z] of configurations) {
			if (state[x] === NUMBER.EMPTY)
				continue;

			if ((state[x] === state[y]) && (state[y] === state[z])) {
				const utility = (state[x] === NUMBER.CROSS) ? 1 : -1;
				return { 
					terminal: true,
					utility: utility
				};
			}
		}
		const options = generateOptions(state);
		if (options.length === 0) {
			return {
				terminal: true,
				utility: 0
			};
		}
	}
	return {
		terminal: false
	};
}

function checkGameStatus(wasPlayer) {
	const state = generateStateFromBoard();
	let active = true;
	let indexes = [];

	for (const [x, y, z] of configurations) {
		if (state[x] === NUMBER.EMPTY)
			continue;

		if ((state[x] === state[y]) && (state[y] === state[z])) {
			active = false;
			indexes = [x, y, z];
		}
	}

	if (!active) {
		const className = (wasPlayer) ? 'win' : 'lose';
		gameState = STATE.OVER;
		[...board.children].forEach((square) => {
			square.classList.add('over');
		});
		for (const index of indexes) {
			board.children[index].classList.add(className);
		}
		return;
	}

	active = state.some(val => val === NUMBER.EMPTY);

	if (!active) {
		gameState = STATE.OVER;
		[...board.children].forEach((square) => {
			square.classList.add('over');
		});
		return;		
	}

	if (wasPlayer) {
		computerGo();
	}
}

function resetGame() {
	gameState = STATE.INIT;
	[...board.children].forEach((square) => {
		square.className = 'square';
		square.textContent = '';
	});
	playerCrossBt.className = '';
	playerNoughtBt.className = '';
	algorithm = null;
}

function computerGo() {
	const maximise = (didPlayerStart) ? false : true;
	const state = generateStateFromBoard();
	const { index } = algorithm.find(maximise, state);

	board.children[index].textContent = (didPlayerStart) ? CHAR.NOUGHT : CHAR.CROSS;
	board.children[index].classList.add('nohover');

	checkGameStatus(false);
}

function playerCrossBegin() {
	gameState = STATE.ACTIVE;
	didPlayerStart = true;
	playerNoughtBt.classList.add('off');
	instantiateAlgorithm(algorithmSl.value);
}

function playerNoughtBegin() {
	gameState = STATE.ACTIVE;
	didPlayerStart = false;
	playerCrossBt.classList.add('off');
	instantiateAlgorithm(algorithmSl.value);
	computerGo();
}

function instantiateAlgorithm(value) {
	const algorithmFromValue = new Map([
		['random', Random],
		['minimax-custom', MinimaxCustom],
		['minimax-basic', MinimaxBasic],
		['minimax-depth', MinimaxDepth],
		['minimax-pruning', MinimaxPruning],
		['minimax-depth-pruning', MinimaxDepthPruning]
	]);
	algorithm = new (algorithmFromValue.get(value))();
}

function algorithmSlChangeHandler(event) {
	instantiateAlgorithm(this.value);
	resetGame();
}

function playerCrossBtClickHandler(event) {
	if (gameState !== STATE.INIT) 
		resetGame();
	playerCrossBegin();
}

function playerNoughtBtClickHandler(event) {
	if (gameState !== STATE.INIT)
		resetGame();
	playerNoughtBegin();
}

function boardElClickHandler(event) {
	if (gameState === STATE.OVER)
		return;

	const index = Number(event.target.dataset.index);
	if (isNaN(index))
		return;

	const target = board.children[index];
	switch (gameState) {
		case STATE.INIT: {
			playerCrossBegin()
			break;
		}
		case STATE.ACTIVE: {
			if (target.textContent !== '')
				return;
			break;
		}
	}

	target.textContent = (didPlayerStart) ? CHAR.CROSS : CHAR.NOUGHT;
	target.classList.add('nohover');
	checkGameStatus(true);
}

algorithmSl.addEventListener('change', algorithmSlChangeHandler)
playerCrossBt.addEventListener('click', playerCrossBtClickHandler);
playerNoughtBt.addEventListener('click', playerNoughtBtClickHandler);
boardEl.addEventListener('click', boardElClickHandler);