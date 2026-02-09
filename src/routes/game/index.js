import { Component } from 'preact';
import { route } from 'preact-router';

import Card from '../../components/card';
import style from './style';

/**
 * helper function to generate a shuffled array of cards
 */
function generateGridCards () {
	const emojis = ['🚀', '😺', '🐶', '🏈', '📦', '🙊', '🍊', '🍌', '🍉', '🔔'];

	return [...emojis, ...emojis]
		.sort(() => Math.random() - Math.random())
		.map((emoji, idx) => ({ key: idx, emoji }));
}

export default class Game extends Component {
	state = {
		cards: generateGridCards(),
		flippedCards: { first: {}, second: {} },
		isMatched: {},
		score: 0,
		time: 60,
		timePenalty: false
	};

	getCardFlipStatus = ({ key, emoji }) => {
		const { flippedCards, isMatched } = this.state;
		
		if (isMatched[emoji]) {
			return 'MATCHED';
		}
		
		if ([flippedCards.first.key,  flippedCards.second.key].includes(key)) {
			return 'FLIPPED';
		}


		return 'DEFAULT';
	}

	createCardClickListener = card => () => {
		this.flipCard(card);
	}
	
	flipCard = card => {
		const { flippedCards } = this.state;

		// if it's the first card to be flipped, we don't need
		// to worry about anything else
		const isFirstFlippedCard = Object.keys(flippedCards.first).length === 0;
		if (isFirstFlippedCard) {
			return this.setState({ flippedCards: { ...flippedCards, first: card } });
		}

		this.flipSecondCard(card);

	}

	flipSecondCard = card => {
		const { flippedCards, isMatched, score } = this.state;

		// Flip the second and then check after 500 ms whether it's a match
		// or mismatch and handle it
		this.setState({ flippedCards: { ...flippedCards, second: card } });
		setTimeout(() => {
			if (flippedCards.first.emoji === card.emoji) {
				// it's a match
				this.setState({ score: score + 1, isMatched: { ...isMatched, [card.emoji]: true } });
				if (score === 9) {
					this.handleWin();
				}
			} else {
				// it's a mismatch, so flip the cards back and penalize the time
				this.setState({ time: Math.max(0, this.state.time - 5), timePenalty: true });
				setTimeout(() => this.setState({ timePenalty: false }), 500);
			}

			// it's a mismatch, so flip the cards back
			this.setState({ flippedCards: { first: {}, second: {} } });
		}, 500);
	}

	handleWin = () => {
		clearInterval(this.timer);
		setTimeout(() => {
			route('/win');
		}, 500);
	}

	handleGameOver = () => {
		setTimeout(() => {
			route('/gameover');
		}, 500);
	}

	componentDidMount() {
		this.timer = setInterval(() => {
			if (this.state.time <= 0) {
				this.handleGameOver();
			} else {
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
				<header class={style.score}>Score: {state.score} | <span class={state.timePenalty ? style.timePenalty : ''}>Time: {state.time}</span></header>
				<div class={style.grid}>
					{state.cards.map(card => (
						<Card
							hiddenValue={card.emoji}
							flipStatus={this.getCardFlipStatus(card)}
							disabled={false}
							onClick={this.createCardClickListener(card)}
						/>
					))}
				</div>
			</div>
		);
	}

}