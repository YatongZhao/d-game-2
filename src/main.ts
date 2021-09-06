import './main.scss';
import App from './components/App.svelte';
import './FrameBuffer';
import VConsole from 'vconsole';

// const vConsole = new VConsole({ maxLogNumber: 50 });

new App({
	target: document.body,
	props: {}
});
