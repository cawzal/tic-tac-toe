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

const boardEl = document.querySelector('#board');

let gameState = STATE.INIT;
let didPlayerStart = true;

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

function checkStatus(state) {
	for (const [x, y, z] of configurations) {
        if (state[x] === NUMBER.EMPTY)
            continue;

        if ((state[x] === state[y]) && (state[y] === state[z])) {
        	return false;
        }
    }

    const hasSpacesLeft = (state.some((num) => num === NUMBER.EMPTY));
    return hasSpacesLeft;
}

function getReply(maximise, state) {
	// const m = new Random(maximise, state);
	// const m = new Minimax(maximise, state);
	const m = new MinimaxCustom();
	// const m = new MinimaxDepth();
	// const m = new MinimaxPruning();
	// const m = new MinimaxDepthPruning();

	const repy = m.find(maximise, state);
	return repy.index;
}

function computerGo() {
	const maximise = (didPlayerStart) ? false : true;
	let state = generateStateFromBoard();
	const index = getReply(maximise, state);

	board.children[index].textContent = (didPlayerStart) ? CHAR.NOUGHT : CHAR.CROSS;

	state = generateStateFromBoard();
	const active  = checkStatus(state);
	console.log(active);
	if (active) {
		// wait for players turn...
	} else {
		endGame();
	}
}

function endGame(message, indexes) {
	gameState = STATE.OVER;
	[...board.children].forEach((square) => {
		square.style.backgroundColor = '#fff';
	});
}

function playerCrossBegin() {
	gameState = STATE.ACTIVE;
	didPlayerStart = true;
}

function playerNoughtBegin() {
	gameState = STATE.ACTIVE;
	didPlayerStart = false;
	computerGo()
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

	const state = generateStateFromBoard();
	const active = checkStatus(state);
	if (active) {
		computerGo();
	} else {
		endGame();
	}
}

boardEl.addEventListener('click', boardElClickHandler);