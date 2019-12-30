class MinimaxPruning {
    dispatch(maximise, state, alpha = Number.NEGATIVE_INFINITY, beta = Number.POSITIVE_INFINITY) {
        const { terminal, utility } = generateUtility(state);
        if (terminal) {
            return { value: utility };
        }
        return maximise ? this.max(state, alpha, beta) : this.min(state, alpha, beta);
    };
    max(state, alpha, beta) {
        let value = Number.NEGATIVE_INFINITY;
        let index;

        for (const option of generateOptions(state)) {
            state[option] = NUMBER.CROSS;
            const reply = this.dispatch(false, state, alpha, beta);
            state[option] = NUMBER.EMPTY;

            if (reply.value > value) {
                value = reply.value;
                index = option;
            }
            if (value >= beta) {
                return { index, value };
            }
            alpha = Math.max(alpha, value);
        }
        return { index, value };
    }
    min(state, alpha, beta) {
        let value = Number.POSITIVE_INFINITY;
        let index;

        for (const option of generateOptions(state)) {
            state[option] = NUMBER.NOUGHT;
            const reply = this.dispatch(true, state, alpha, beta);
            state[option] = NUMBER.EMPTY;

            if (reply.value < value) {
                value = reply.value;
                index = option;
            }
            if (value <= alpha) {
                return { index, value };
            }
            beta = Math.min(beta, value);
        }
        return { index, value };
    }
    find(maximise, state) {
        return this.dispatch(maximise, state);
    }
}