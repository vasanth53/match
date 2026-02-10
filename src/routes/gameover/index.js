import { Component } from 'preact';
import { route } from 'preact-router';
import style from './style.css';


export default class GameOver extends Component{
	startGame = () => {
		route('/');
	};
	
	render (props) {
		const { score, moves, time, pairs } = props;
		return (
			<div class={style.gameover}>
				<div class={style.head}>
					<div class={style.emoji}>😭</div>
					<div>You lost!</div>
				</div>
				<div class={style.results}>
					<p>Score: {score}</p>
					<p>Moves: {moves}</p>
					<p>Time Left: {time}s</p>
					<p>Pairs: {pairs}</p>
				</div>
				<button class={style.button} onClick={this.startGame}>Try Again</button>
			</div>
		);

	}
}
