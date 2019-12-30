class Minimax {
    dispatch(maximise, state) {
        const { terminal, utility } = generateUtility(state);
        if (terminal) {
            return { value: utility };
        }
        return maximise ? this.max(state) : this.min(state);
    }
    max(state) {
        let value = Number.NEGATIVE_INFINITY;
        let index;

        for (const option of generateOptions(state)) {
            state[option] = NUMBER.CROSS;
            const reply = this.dispatch(false, state);
            state[option] = NUMBER.EMPTY;

            if (reply.value > value) {
                value = reply.value;
                index = option;
            }
        }
        return { index, value };
    }
    min(state) {
        let value = Number.POSITIVE_INFINITY;
        let index;

        for (const option of generateOptions(state)) {
            state[option] = NUMBER.NOUGHT;
            const reply = this.dispatch(true, state);
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