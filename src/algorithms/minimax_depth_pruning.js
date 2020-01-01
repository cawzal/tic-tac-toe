class MinimaxDepthPruning {
	dispatch(maximise, state, depth = 0, alpha = Number.NEGATIVE_INFINITY, beta = Number.POSITIVE_INFINITY) {
		const { terminalState, utility } = generateStateUtility(state, depth);
		if (terminalState) {
			return { value: utility };
		}
		return maximise ? this.max(state, depth, alpha, beta) : this.min(state, depth, alpha, beta);
	}
	max(state, depth, alpha, beta) {
		let currentBestValue = Number.NEGATIVE_INFINITY;
		let currentBestIndex;

		for (const index of findEmptyIndexes(state)) {
			state[index] = NUMBER.CROSS;
			const reply = this.dispatch(false, state, depth + 1, alpha, beta);
			state[index] = NUMBER.EMPTY;

			if (reply.value > currentBestValue) {
				currentBestValue = reply.value;
				currentBestIndex = index;
			}
			if (currentBestValue >= beta) {
				return { 
					index: currentBestIndex,
					value: currentBestValue
				};
			}
			alpha = Math.max(alpha, currentBestValue);
		}
		return {
			index: currentBestIndex,
			value: currentBestValue
		};
	}
	min(state, depth, alpha, beta) {
		let currentBestValue = Number.POSITIVE_INFINITY;
		let currentBestIndex;

		for (const index of findEmptyIndexes(state)) {
			state[index] = NUMBER.NOUGHT;
			const reply = this.dispatch(true, state, depth + 1, alpha, beta);
			state[index] = NUMBER.EMPTY;

			if (reply.value < currentBestValue) {
				currentBestValue = reply.value;
				currentBestIndex = index;
			}
			if (currentBestValue <= alpha) {
				return { 
					index: currentBestIndex,
					value: currentBestValue
				};
			}
			beta = Math.min(beta, currentBestValue);
		}
		return {
			index: currentBestIndex,
			value: currentBestValue
		};
	}
	find(maximise, state) {
		return this.dispatch(maximise, state);
	}
}