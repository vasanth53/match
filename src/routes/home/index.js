
import { Component } from 'preact';
import { route } from 'preact-router';
import style from './style.css';


export default class Home extends Component{
	startGame = (numberOfPairs) => () => {
		route(`/game/${numberOfPairs}`);
	};
	
	render () {
		return (
			<div class={style.home}>
				<div class={style.head}>
					<h2>Match Game</h2>
				</div>
				<div class={style.difficultySelection}>
					<h3>Select Difficulty:</h3>
					<button class={style.button} onClick={this.startGame(6)}>Easy (6 Pairs)</button>
					<button class={style.button} onClick={this.startGame(10)}>Medium (10 Pairs)</button>
					<button class={style.button} onClick={this.startGame(15)}>Hard (15 Pairs)</button>
				</div>
			</div>
		);

	}
}