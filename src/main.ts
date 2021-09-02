import './main.scss';
import App from './App.svelte';
import { game } from './game';
import './FrameBuffer';
import VConsole from 'vconsole';

// const vConsole = new VConsole({ maxLogNumber: 50 });

new App({
	target: document.body,
	props: {}
});
