class MinimaxCustom extends MinimaxDepth {
	dispatchCustom(maximise, state, depth = 0) {
		return maximise ? this.maxCustom(state, depth) : this.minCustom(state, depth);
	}
	maxCustom(state, depth) {
		const options = [];

		for (const option of generateOptions(state)) {
			state[option] = NUMBER.CROSS;
			const reply = this.dispatch(false, state, depth + 1);
			state[option] = NUMBER.EMPTY;

			options.push({
				index: option,
				value: reply.value
			});
		}
		return options;
	}
	minCustom(state, depth) {
		const options = [];

		for (const option of generateOptions(state)) {
			state[option] = NUMBER.NOUGHT;
			const reply = this.dispatch(true, state, depth + 1);
			state[option] = NUMBER.EMPTY;

			options.push({
				index: option,
				value: reply.value
			});
		};
		return options;
	}
	findAll(maximise, state) {
		return this.dispatchCustom(maximise, state);
	}
	find(maximise, state) {
		const func = maximise ? (p => p.value > 0) : (p => p.value < 100);
		const possibles = this.findAll(maximise, state).filter(func);
		return possibles[Math.floor(Math.random() * possibles.length)];
	}
}