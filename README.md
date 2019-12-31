# Tic-Tac-Toe

### Description
Minimax based tic-tac-toe game. Minimax implementations based on the outline provided in the lecture [CS 188 Lecture 5: Adversarial Search](https://www.youtube.com/watch?v=_3djr6ZXLzQ) with the timestamps being 0:34:25 for basic minimax and 1:17:55 for minimax with alpha-beta pruning. The lecture considers the problem of not considering turns taken in evaluating any particular state in the pacman scenario provided, hence it was also considered in this project. A basic UI is provided to play the game.

### Algorithms
In order to compare the result of having slightly different algorithms, each implementation has been provided as simple as possible without regard for duplicated code between classes.
- MinimaxCustom (minimax_custom.js) -- Selects a winning or drawing move at random
- MinimaxBasic (minimax_basic.js)
- MinimaxPruning (minimax_pruning.js) -- MinimaxBasic with alpha-beta pruning
- MinimaxDepth (minimax_depth.js) -- Considers the amount of turns taken when evaluating state
- MinimaxDepthPruning (minimax_depth_pruning.js) -- MinimaxDepth with alpha-beta pruning