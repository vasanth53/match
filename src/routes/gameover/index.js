import { Component } from 'preact';
import { route } from 'preact-router';
import style from './style.css';


export default class GameOver extends Component{
	startGame = () => {
		route('/');
	};
	
	render () {
		return (
			<div class={style.gameover}>
				<div class={style.head}>
					<div class={style.emoji}>😭</div>
					<div>You lost!</div>
				</div>
				<button class={style.button} onClick={this.startGame}>Try Again</button>
			</div>
		);

	}
}
