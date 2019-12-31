class MinimaxDepth {
	dispatch(maximise, state, depth = 0) {
		const { terminal, utility } = generateUtility(state, depth);
		if (terminal) {
			return { value: utility };
		}
		return maximise ? this.max(state, depth) : this.min(state, depth);
	}
	max(state, depth) {
		let value = Number.NEGATIVE_INFINITY;
		let index;

		for (const option of generateOptions(state)) {
			state[option] = NUMBER.CROSS;
			const reply = this.dispatch(false, state, depth + 1);
			state[option] = NUMBER.EMPTY;

			if (reply.value > value) {
				value = reply.value;
				index = option;
			}
		}
		return { index, value };
	}
	min(state, depth) {
		let value = Number.POSITIVE_INFINITY;
		let index;

		for (const option of generateOptions(state)) {
			state[option] = NUMBER.NOUGHT;
			const reply = this.dispatch(true, state, depth + 1);
			state[option] = NUMBER.EMPTY;

			if (reply.value < value) {
				value = reply.value;
				index = option;
			}
		};
		return { index, value };
	}
	find(maximise, state) {
		return this.dispatch(maximise, state);
	}
}