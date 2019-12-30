class Random {
	find(maximise, state) {
		const options = generateOptions(state);
		return {
			index: options[Math.floor(Math.random() * options.length)]
		};
	}
}