class Random {
	find(maximise, state) {
		const options = findEmptyIndexes(state);
		return {
			index: options[Math.floor(Math.random() * options.length)]
		};
	}
}