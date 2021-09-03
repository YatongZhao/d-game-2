<script lang="ts">
import { onDestroy, onMount } from "svelte";
import { fly } from "svelte/transition";
import { battleGroundDistance, battleGroundHeight, battleGroundWidth, heroCanvasHeight, heroCanvasWidth, heroInfo, heroInfoSet, HPHeight, HPWidth, init$, initHP } from "./const";
import { setCanvas } from "./draw";
import { setBulletCanvas } from "./draw/drawBullet";
import { heroRenderer } from "./draw/drawHero";
import { setHP, setHPCanvas } from "./draw/drawHP";
import { game } from "./game";
import Hero from "./Hero.svelte";
import { heroShop } from "./HeroShop";
import { port2 } from "./messageChannel";
import Shop from "./Shop.svelte";
import type { currentTurn } from "./worker/Game";
import type { Hero as HeroType } from './worker/Hero';

    let canvas: HTMLCanvasElement;
    let HPCanvas: HTMLCanvasElement;
    let bulletCanvas: HTMLCanvasElement;
	let HP = initHP;
	let money = init$;
	let roundNumber = 1;
	let showShop = false;
	let currentTurn: currentTurn = 'STRATEGY_TURN';
	
	let width = window.innerWidth;
	let height = window.innerHeight;
	let ratio = height / width;
	
	let heroSec: HTMLDivElement;
	let heroLeft = 0;
	let heroTop = 0;

	let showHeroShadow = false;
	let hitedHero: heroInfoSet|null = null;
	let heroTouchX = 0;
	let heroTouchY = 0;
	
	function handleMessage(msg: MessageEvent) {
		HP = msg.data.HP;
		roundNumber = msg.data.roundNumber;
		currentTurn = msg.data.currentTurn;
		heroShop.set$(msg.data.$);
		money = heroShop.get$();
		setHP(HP);
	}

	function handleShow() {
		showShop = !showShop;
	}

	function handleRem() {
		width = window.innerWidth;
		height = window.innerHeight;
		ratio = height / width;

		heroLeft = heroSec.offsetLeft;
		heroTop = heroSec.offsetTop;
	};

	async function handleHeroTouchEnd() {
		showHeroShadow = false;
		heroRenderer.clearOutMove();
		window.removeEventListener('touchmove', handleHeroTouchMove);
		if (hitedHero) {
			let hitedHero2 = heroRenderer.isHitHero(heroTouchX, heroTouchY);
			if (hitedHero2 && hitedHero2.hero !== hitedHero.hero) {
				let res = await game.moveHero(hitedHero.heroInfo, hitedHero2.heroInfo);
				heroRenderer.setHero(res as any);
			}
		}
		hitedHero = null;
	}

	function handleHeroTouchMove(e: TouchEvent) {
        e.preventDefault();
        e.stopPropagation();
		let {x, y} = getHeroTouchPosition(e);
		heroTouchY = y;
		heroTouchX = x;
		hitedHero && heroRenderer.setMove(hitedHero, { x: heroTouchX, y: heroTouchY });
	}

	onMount(() => {
		window.addEventListener('resize', handleRem);
		window.addEventListener('touchend', handleHeroTouchEnd);

		heroLeft = heroSec.offsetLeft;
		heroTop = heroSec.offsetTop;

		canvas.width = battleGroundWidth;
		canvas.height = battleGroundDistance;
		setCanvas(canvas);

		HPCanvas.width = HPWidth;
		HPCanvas.height = HPHeight;
		setHPCanvas(HPCanvas);

		bulletCanvas.width = battleGroundWidth;
		bulletCanvas.height = battleGroundHeight;
		setBulletCanvas(bulletCanvas);

		let setCosted$ = heroShop.setCosted$.bind(heroShop);
		heroShop.setCosted$ = function($: number) {
			setCosted$($);
			money = heroShop.get$();
		}

		port2.onmessage = handleMessage;
	});

	onDestroy(() => {
		window.removeEventListener('resize', handleRem);
		window.removeEventListener('touchend', handleHeroTouchEnd);
	});

	function getHeroTouchPosition(event: TouchEvent) {
		let x = event.touches[0].clientX;
		let y = event.touches[0].clientY;
		let _ratio;
		if (ratio > 2) {
			_ratio = width / battleGroundWidth;
			y -= height / 2 - width + battleGroundDistance * _ratio;
		} else {
			_ratio = height / battleGroundHeight;
			y -= battleGroundDistance * _ratio;
			x -= (width - height / 2) / 2;
		}
		y /= _ratio;
		x /= _ratio;
		return {x, y};
	}

	function handleTouchStart(event: TouchEvent) {
		if (currentTurn === 'BATTLE_TURN') return;
		let {x, y} = getHeroTouchPosition(event);
		heroTouchY = y;
		heroTouchX = x;
		let _hitedHero = heroRenderer.isHitHero(x, y);
		if (_hitedHero && _hitedHero.hero) {
			event.preventDefault();
			event.stopPropagation();
			showHeroShadow = true;
			hitedHero = _hitedHero;
			window.addEventListener('touchmove', handleHeroTouchMove, { passive: false });
			heroRenderer.setMove(hitedHero, { x, y });
		}
	}
</script>

<main style={`width:${ratio > 2 ? width+'px' : height/2+'px'};height:${ratio > 2 ? width*2+'px' : height+'px'}`}>
	<canvas class="enemy-canvas" bind:this={canvas} />
	<div class="hero-canvas" bind:this={heroSec}>
		<Hero />
	</div>
	{#if showHeroShadow}
	<div class="hero-shadow">
		<Hero />
	</div>
	{/if}
	<canvas class="bullet-canvas" bind:this={bulletCanvas} />
	<div class:h={ratio > 2} class:w={ratio <= 2} class="hp-box">
		<canvas class="hp-canvas" bind:this={HPCanvas} />
		<span class="hp-span">{HP}/1000</span>
	</div>
	<div class="event-mask" on:click={() => {
		showShop = false;
	}} on:touchstart={handleTouchStart}></div>
	<button class:h={ratio > 2} class:w={ratio <= 2}
		disabled={currentTurn === 'BATTLE_TURN'}
		on:click={() => game.startFighting()} class="battle-btn">开始战斗</button>
	<button class:h={ratio > 2} class:w={ratio <= 2} on:click={handleShow} class="main-btn">商店</button>
	{#if showShop}
		<Shop ratio={ratio} money={money} />
	{/if}
	<div class:h={ratio > 2} class:w={ratio <= 2} class="round-number">
		Round
		{#key roundNumber}
			<span in:fly={{ y: -40 }} out:fly={{ y: 80 }}>{roundNumber}</span>
		{/key}
	</div>
	<div class:h={ratio > 2} class:w={ratio <= 2} class="money">${money}</div>
</main>

<style lang="scss">
	main {
		overflow: hidden;
		position: fixed;
		left: 50%;
		top: 50%;
		transform: translate3d(-50%, -50%, 0);
		background-color: white;
	}
	.enemy-canvas {
		width: 100%;
		position: absolute;
		left: 0;
		z-index: 1;
	}
	.bullet-canvas {
		width: 100%;
		position: absolute;
		bottom: 0;
		left: 0;
		z-index: 2;
	}
	.hero-canvas {
		width: 100%;
		position: absolute;
		bottom: 0;
		left: 0;
		background-color: ghostwhite;
		box-shadow: 0px -2px 1px 1px burlywood;
		border-top: 1px solid gray;
	}
	.hero-shadow {
		width: 100%;
		background-color: ghostwhite;
		position: absolute;
		bottom: 20%;
		left: 0;
		z-index: 10000;
	}
	.hp-box {
		position: absolute;
		left: 0;
		width: 100%;
		z-index: 5;
		opacity: .8;
		.hp-span {
			color: white;
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate3d(-50%, -50%, 0);
			text-align: center;
		}
		&.h {
			bottom: 32vw;
			height: 4vw;
			.hp-span {
				font-size: 3vw;
			}
		}
		&.w {
			bottom: 16vh;
			height: 2vh;
			.hp-span {
				font-size: 1.5vh;
			}
		}
	}
	.hp-canvas {
		background-color: #aaa;
		box-sizing: border-box;
		position: absolute;
		width: 98%;
		left: 1%;
		border-radius: 3px;
		border: 1px solid #333;
		z-index: -1;
		height: 100%;
	}
	.event-mask {
		position: absolute;
		width: 100%;
		height: 100%;
		z-index: 1000;
	}
    .main-btn {
        position: absolute;
		z-index: 1001;
		border-radius: 5px;
		&.h {
			bottom: 37vw;
			left: 1vw;
		}
		&.w {
			bottom: 18.5vh;
			left: 0.5vh;
		}
    }
	.battle-btn {
        position: absolute;
		border-radius: 5px;
		z-index: 1001;
		&.h {
			bottom: 37vw;
			right: 1vw;
		}
		&.w {
			bottom: 18.5vh;
			right: 0.5vh;
		}
	}
	.round-number {
		position: absolute;
		left: 0;
		top: 40%;
		font-weight: 100;
		color: darkcyan;
		span {
			position: absolute;
			bottom: -5%;
		}
		&.h {
			width: 100vw;
			font-size: 12vw;
			span {
				margin-left: 4vw;
				font-size: 14vw;
			}
		}
		&.w {
			width: 50vh;
			font-size: 6vh;
			span {
				margin-left: 2vh;
				font-size: 7vh;
			}
		}
	}
	.money {
		position: absolute;
		z-index: 10000;
		text-shadow: 3px 5px 1px rgba(0, 0, 0, .2);
		color: brown;
		font-weight: 900;
		&.h {
			font-size: 6vw;
			top: 8vw;
			right: 8vw;
		}
		&.w {
			font-size: 3vh;
			top: 4vh;
			right: 4vh;
		}
	}
</style>
