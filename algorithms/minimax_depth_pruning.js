class MinimaxDepthPruning {
    dispatch(maximise, state, depth = 0, alpha = Number.NEGATIVE_INFINITY, beta = Number.POSITIVE_INFINITY) {
        const { terminal, utility } = generateUtility(state, depth);
        if (terminal) {
            return { value: utility };
        }
        return maximise ? this.max(state, depth, alpha, beta) : this.min(state, depth, alpha, beta);
    }
    max(state, depth, alpha, beta) {
        let value = Number.NEGATIVE_INFINITY;
        let index;

        for (const option of generateOptions(state)) {
            state[option] = NUMBER.CROSS;
            const reply = this.dispatch(false, state, depth + 1, alpha, beta);
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
    min(state, depth, alpha, beta) {
        let value = Number.POSITIVE_INFINITY;
        let index;

        for (const option of generateOptions(state)) {
            state[option] = NUMBER.NOUGHT;
            const reply = this.dispatch(true, state, depth + 1, alpha, beta);
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