import { Component } from 'preact';
import { Router } from 'preact-router';

// import Home from '../routes/home';
import Game from '../routes/game';
import Win from '../routes/win';
import GameOver from '../routes/gameover';

export default class App extends Component {
	render() {
		return (
			<div id="app">
				<Router onChange={this.handleRoute}>
					{/* <Home path="/" /> */}
					<Game path="/" />
					<Win path="/win" />
					<GameOver path="/gameover" />
				</Router>
			</div>
		);
	}
}
