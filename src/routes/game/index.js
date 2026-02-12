import { Component } from 'preact';
import { route } from 'preact-router';

import Card from '../../components/card';
import style from './style';

/**
 * helper function to generate a shuffled array of cards
 */
function generateGridCards (numberOfPairs) {
	const emojis = ['🚀', '😺', '🐶', '🏈', '📦', '🙊', '🍊', '🍌', '🍉', '🔔', '🚗', '🍎', '🍕', '🍔', '🍟'];
	const selectedEmojis = emojis.slice(0, numberOfPairs);

	return [...selectedEmojis, ...selectedEmojis]
		.sort(() => Math.random() - Math.random())
		.map((emoji, idx) => ({ key: idx, emoji }));
}

export default class Game extends Component {
	getCardFlipStatus = ({ key, emoji }) => {
		const { flippedCards, isMatched } = this.state;
		
		if (isMatched[emoji]) {
			return 'MATCHED';
		}
		
		if ([flippedCards.first.key,  flippedCards.second.key].includes(key)) {
			return 'FLIPPED';
		}

		return 'DEFAULT';
	};

	createCardClickListener = card => () => {
		this.flipCard(card);
	};
	
	flipCard = card => {
		const { flippedCards } = this.state;

		// if it's the first card to be flipped, we don't need
		// to worry about anything else
		const isFirstFlippedCard = Object.keys(flippedCards.first).length === 0;
		if (isFirstFlippedCard) {
			return this.setState({ flippedCards: { ...flippedCards, first: card } });
		}

		this.flipSecondCard(card);
	};

	flipSecondCard = card => {
		const { flippedCards, isMatched, score, numberOfPairs, moves } = this.state;

		// Flip the second and then check after 500 ms whether it's a match
		// or mismatch and handle it
		this.setState({ flippedCards: { ...flippedCards, second: card }, moves: moves + 1 });
		setTimeout(() => {
			if (flippedCards.first.emoji === card.emoji) {
				// it's a match
				this.setState({ score: score + 1, isMatched: { ...isMatched, [card.emoji]: true } });
				if (score + 1 === numberOfPairs) { // Adjusted win condition
					this.handleWin();
				}
			}
			else {
				// it's a mismatch, so flip the cards back and penalize the time
				this.setState({ time: Math.max(0, this.state.time - 5), timePenalty: true });
				setTimeout(() => this.setState({ timePenalty: false }), 500);
			}

			// it's a mismatch, so flip the cards back
			this.setState({ flippedCards: { first: {}, second: {} } });
		}, 500);
	}
	;

	handleWin = () => {
		clearInterval(this.timer);
		const { score, moves, time, numberOfPairs } = this.state;
		setTimeout(() => {
			route(`/win?score=${score}&moves=${moves}&time=${time}&pairs=${numberOfPairs}`, true);
		}, 500);
	}
	;

	handleGameOver = () => {
		clearInterval(this.timer);
		const { score, moves, time, numberOfPairs } = this.state;
		setTimeout(() => {
			route(`/gameover?score=${score}&moves=${moves}&time=${time}&pairs=${numberOfPairs}`, true);
		}, 500);
	}
	;

	getGridStyle = () => {
		const { numberOfPairs } = this.state;
		let columns, rows;

		// Determine grid dimensions based on numberOfPairs
		if (numberOfPairs <= 6) { // 12 cards (4x3)
			columns = 4;
			rows = 3;
		}
		else if (numberOfPairs <= 10) { // 20 cards (5x4)
			columns = 5;
			rows = 4;
		}
		else { // 30 cards (6x5)
			columns = 6;
			rows = 5;
		}

		return {
			gridTemplateColumns: `repeat(${columns}, 80px)`,
			gridTemplateRows: `repeat(${rows}, 80px)`
		};
	};

	constructor(props) {
		super(props);
		const numberOfPairs = parseInt(props.numberOfPairs, 10) || 10;
		this.state = {
			cards: generateGridCards(numberOfPairs),
			flippedCards: { first: {}, second: {} },
			isMatched: {},
			score: 0,
			moves: 0,
			time: numberOfPairs * 6, // Adjust time based on difficulty
			timePenalty: false,
			numberOfPairs
		};
	}

	componentDidMount() {
		this.timer = setInterval(() => {
			if (this.state.time <= 0) {
				this.handleGameOver();
			}
			else {
				this.setState({ time: this.state.time - 1 });
			}
		}, 1000);
	}

	componentWillUnmount() {
		clearInterval(this.timer);
	}

	render(props, state) {
		return (
			<div class={style.game}>
				<header class={style.score}>Score: {state.score} | Moves: {state.moves} | <span class={state.timePenalty ? style.timePenalty : ''}>Time: {state.time}</span></header>
				<div class={style.grid} style={this.getGridStyle()}>
					{state.cards.map(card => (
						<Card
							hiddenValue={card.emoji}
							flipStatus={this.getCardFlipStatus(card)}
							disabled={Object.keys(state.flippedCards.first).length === 2} // Disable cards when two are flipped
							onClick={this.createCardClickListener(card)}
						/>
					))}
				</div>
			</div>
		);
	}
}
