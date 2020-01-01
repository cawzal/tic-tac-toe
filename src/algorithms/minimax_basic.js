class MinimaxBasic {
	dispatch(maximise, state) {
		const { terminalState, utility } = generateStateUtility(state);
		if (terminalState) {
			return { value: utility };
		}
		return maximise ? this.max(state) : this.min(state);
	}
	max(state) {
		let currentBestValue = Number.NEGATIVE_INFINITY;
		let currentBestIndex;

		for (const index of findEmptyIndexes(state)) {
			state[index] = NUMBER.CROSS;
			const reply = this.dispatch(false, state);
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
	min(state) {
		let currentBestValue = Number.POSITIVE_INFINITY;
		let currentBestIndex;

		for (const index of findEmptyIndexes(state)) {
			state[index] = NUMBER.NOUGHT;
			const reply = this.dispatch(true, state);
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