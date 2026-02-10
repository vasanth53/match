import { Component } from 'preact';
import { route } from 'preact-router';
import style from './style.css';


export default class Win extends Component{
	startGame = () => {
		route('/');
	};
	
	render (props) {
		const { score, moves, time, pairs } = props;
		return (
			<div class={style.win}>
				<div class={style.head}>
					<div class={style.emoji}>🎉</div>
					<div>You won!</div>
				</div>
				<div class={style.results}>
					<p>Score: {score}</p>
					<p>Moves: {moves}</p>
					<p>Time Left: {time}s</p>
					<p>Pairs: {pairs}</p>
				</div>
				<button class={style.button} onClick={this.startGame}>New Game</button>
			</div>
		);

	}
}