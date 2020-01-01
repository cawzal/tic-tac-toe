class MinimaxDepth {
	dispatch(maximise, state, depth = 0) {
		const { terminalState, utility } = generateStateUtility(state, depth);
		if (terminalState) {
			return { value: utility };
		}
		return maximise ? this.max(state, depth) : this.min(state, depth);
	}
	max(state, depth) {
		let currentBestValue = Number.NEGATIVE_INFINITY;
		let currentBestIndex;

		for (const index of findEmptyIndexes(state)) {
			state[index] = NUMBER.CROSS;
			const reply = this.dispatch(false, state, depth + 1);
			state[index] = NUMBER.EMPTY;

			if (reply.value > currentBestValue) {
				currentBestValue = reply.value;
				currentBestIndex = index;
			}
		}
		return {
			index: currentBestIndex,
			value: currentBestValue
		};
	}
	min(state, depth) {
		let currentBestValue = Number.POSITIVE_INFINITY;
		let currentBestIndex;

		for (const index of findEmptyIndexes(state)) {
			state[index] = NUMBER.NOUGHT;
			const reply = this.dispatch(true, state, depth + 1);
			state[index] = NUMBER.EMPTY;

			if (reply.value < currentBestValue) {
				currentBestValue = reply.value;
				currentBestIndex = index;
			}
		};
		return {
			index: currentBestIndex,
			value: currentBestValue
		};
	}
	find(maximise, state) {
		return this.dispatch(maximise, state);
	}
}