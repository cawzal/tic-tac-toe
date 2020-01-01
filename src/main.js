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
	END: 2
};

const winningIndexCombinations = [
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

function findEmptyIndexes(state) {
	const indexes = [];
	state.forEach((value, index) => {
		if (value === NUMBER.EMPTY)
			indexes.push(index);
	});
	return indexes;
}

function generateStateUtility(state, depth = 0) {
	for (const [x, y, z] of winningIndexCombinations) {
		if (state[x] === NUMBER.EMPTY)
			continue;

		if ((state[x] === state[y]) && (state[y] === state[z])) {
			const utility = (state[x] === NUMBER.CROSS) ? 1000 - depth : depth - 1000;
			return { 
				terminalState: true,
				utility
			};
		}
	}

	const hasRemainingMoves = state.some(function isEmpty(value) {
		return value === NUMBER.EMPTY;
	});
	if (!hasRemainingMoves) {
		return {
			terminalState: true,
			utility: 0
		};
	}

	return {
		terminalState: false
	};
}

function findWinningIndexes(state) {
	for (const [x, y, z] of winningIndexCombinations) {
		if (state[x] === NUMBER.EMPTY)
			continue;

		if ((state[x] === state[y]) && (state[y] === state[z])) {
			return [x, y, z];
		}
	}
}

function checkGameStateAfterMove(wasPlayerMove) {
	const state = generateStateFromBoard();
	const { terminalState, utility } = generateStateUtility(state);
	if (terminalState) {
		endGame(state, wasPlayerMove, utility);
	} else if (wasPlayerMove) {
		computerGo();
	}
}

function endGame(state, wasPlayerMove, stateUtility) {
	gameState = STATE.END;
	const squares = [...board.children];
	squares.forEach(function addEndGameColor(square) {
		square.classList.add('end');
	});

	if (stateUtility !== 0)  {
		const className = (wasPlayerMove) ? 'win' : 'lose';
		(didPlayerStart) ? playerCrossBt.classList.add(className) : playerNoughtBt.classList.add(className);
		for (const index of findWinningIndexes(state)) {
			squares[index].classList.add(className);
		}
	}
}

function resetGame() {
	gameState = STATE.INIT;
	[...board.children].forEach(function resetSquare(square) {
		square.className = 'square';
		square.textContent = '';
	});
	playerCrossBt.className = '';
	playerNoughtBt.className = '';
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

function computerGo() {
	const maximise = (didPlayerStart) ? false : true;
	const { index } = algorithm.find(maximise, generateStateFromBoard());

	const target = board.children[index];
	target.textContent = (didPlayerStart) ? CHAR.NOUGHT : CHAR.CROSS;
	target.classList.add('nohover');

	checkGameStateAfterMove(false);
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
	if (gameState === STATE.END)
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
	checkGameStateAfterMove(true);
}

algorithmSl.addEventListener('change', algorithmSlChangeHandler)
playerCrossBt.addEventListener('click', playerCrossBtClickHandler);
playerNoughtBt.addEventListener('click', playerNoughtBtClickHandler);
boardEl.addEventListener('click', boardElClickHandler);