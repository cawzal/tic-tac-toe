class MinimaxCustom extends MinimaxDepth {
	dispatchc(maximise, state, depth = 0) {
		const { terminalState, utility } = generateStateUtility(state, depth);
		if (terminalState) {
			return [{ value: utility }];
		}
		return maximise ? this.maxc(state, depth) : this.minc(state, depth);
	}
	maxc(state, depth) {
		const moves = [];

		for (const index of findEmptyIndexes(state)) {
			state[index ] = NUMBER.CROSS;
			const reply = this.dispatch(false, state, depth + 1);
			state[index ] = NUMBER.EMPTY;

			moves.push({
				index,
				value: reply.value
			});
		}
		return moves;
	}
	minc(state, depth) {
		const moves = [];

		for (const index of findEmptyIndexes(state)) {
			state[index] = NUMBER.NOUGHT;
			const reply = this.dispatch(true, state, depth + 1);
			state[index] = NUMBER.EMPTY;

			moves.push({
				index,
				value: reply.value
			});
		};
		return moves;
	}
	findAll(maximise, state) {
		return this.dispatchc(maximise, state);
	}
	find(maximise, state) {
		const winOrDrawMove = maximise ? (move => move.value >= 0) : (move => move.value <= 0);
		const moves = this.findAll(maximise, state).filter(winOrDrawMove);
		return moves[Math.floor(Math.random() * moves.length)];
	}
}