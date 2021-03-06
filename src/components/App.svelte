<script lang="ts">
import { onDestroy, onMount } from "svelte";
import { fly } from "svelte/transition";
import { battleGroundDistance, battleGroundHeight, battleGroundWidth, deleteHeroBtnHeight, heroCanvasHeight, heroCanvasWidth, heroInfo, heroInfoSet, heroSize, HPHeight, HPWidth, init$, initHP, offStageHeroPosition, onStageHeroPosition } from "../const";
import { setCanvas } from "../draw/drawEnemy";
import { setBulletCanvas } from "../draw/drawBullet";
import { heroRenderer } from "../draw/drawHero";
import { setHP, setHPCanvas } from "../draw/drawHP";
import { game } from "../game";
import Hero from "./Hero.svelte";
import { heroMap, heroShop } from "../HeroShop";
import { port2 } from "../messageChannel";
import Shop from "./Shop.svelte";
import type { currentTurn } from "../worker/Game";
import type { heroState } from "../worker/Hero";
import { heroManager } from "../HeroManager";

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
	let unitVw = ratio > 2 ? width / 100 : height / 200;
	
	let heroSec: HTMLDivElement;
	let heroLeft = 0;
	let heroTop = 0;

	let showHeroShadow = false;
	let hitedHero: heroInfoSet|null = null;
	let hitedHeroSoldMoney = 0;
	let hitedHero2: heroInfoSet|null = null;
	let heroTouchX = 0;
	let heroTouchY = 0;
	let heroTouchOffsetX = 0;
	let heroTouchOffsetY = 0;
	let isHitDeleteHero = false;

	// let bufferFrameNumber = 0;

	let isGameOver = false;
	
	function handleMessage(msg: MessageEvent) {
		HP = msg.data.HP;
		roundNumber = msg.data.roundNumber;
		currentTurn = msg.data.currentTurn;
		// bufferFrameNumber = msg.data.bufferFrameNumber;
		isGameOver = msg.data.isGameOver;
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
		unitVw = ratio > 2 ? width / 100 : height / 200;

		heroLeft = heroSec.offsetLeft;
		heroTop = heroSec.offsetTop;
	};

	async function handleHeroTouchEnd() {
		window.removeEventListener('touchmove', handleHeroTouchMove);
		await endCore();
	}

	function handleHeroTouchMove(event: TouchEvent) {
        event.preventDefault();
        event.stopPropagation();
		let _x = event.touches[0].clientX;
		let _y = event.touches[0].clientY;
		moveCore(_x, _y);
	}

	function handleTouchStart(event: TouchEvent) {
		let _x = event.touches[0].clientX;
		let _y = event.touches[0].clientY;
		startCore(event, _x, _y, () => window.addEventListener('touchmove', handleHeroTouchMove, { passive: false }));
	}

	async function handleMouseUp() {
		window.removeEventListener('mousemove', handleMouseMove);
		await endCore();
	}

	function handleMouseMove(event: MouseEvent) {
		event.preventDefault();
		event.stopPropagation();
		let _x = event.clientX;
		let _y = event.clientY;
		moveCore(_x, _y);
	}

	function handleMouseDown(event: MouseEvent) {
		let _x = event.clientX;
		let _y = event.clientY;
		startCore(event, _x, _y, () => window.addEventListener('mousemove', handleMouseMove, { passive: false }));

	}

	onMount(() => {
		window.addEventListener('resize', handleRem);
		window.addEventListener('touchend', handleHeroTouchEnd);
		window.addEventListener('mouseup', handleMouseUp);

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

	function getHeroTouchPosition(x: number, y: number) {
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

	function startCore(event: TouchEvent|MouseEvent, _x: number, _y: number, addEventListenerCb: () => void) {
		if (currentTurn === 'BATTLE_TURN') return;
		let {x, y} = getHeroTouchPosition(_x, _y);
		heroTouchY = y;
		heroTouchX = x;
		let _hitedHero = heroRenderer.isHitHero(x, y);
		if (_hitedHero && _hitedHero.hero) {
			showShop = false;
			event.preventDefault();
			event.stopPropagation();
			showHeroShadow = true;
			hitedHero = _hitedHero;
			hitedHeroSoldMoney = heroMap[_hitedHero.hero.type].sold$[_hitedHero.hero.level - 1];
			let { stage, index } = hitedHero.heroInfo;
			let position = (stage === 'on' ? onStageHeroPosition : offStageHeroPosition)[index];
			heroTouchOffsetX = heroTouchX - position.x;
			heroTouchOffsetY = heroTouchY - position.y;
			addEventListenerCb();
			heroRenderer.setMove(hitedHero, { x, y }, { offsetX: heroTouchOffsetX, offsetY: heroTouchOffsetY });
		}
	}

	function moveCore(_x: number, _y: number) {
		let {x, y} = getHeroTouchPosition(_x, _y);
		heroTouchY = y;
		heroTouchX = x;
		hitedHero && heroRenderer.setMove(
			hitedHero,
			{ x: heroTouchX, y: heroTouchY },
			{ offsetX: heroTouchOffsetX, offsetY: heroTouchOffsetY });
		
		hitedHero2 = heroRenderer.isHitHero(heroTouchX - heroTouchOffsetX, heroTouchY - heroTouchOffsetY);
		isHitDeleteHero = isHitDeleteHeroBtn();
	}
	
	function isHitDeleteHeroBtn() {
		return heroTouchX - heroTouchOffsetX > -heroSize
			&& heroTouchX - heroTouchOffsetX < battleGroundWidth
			&& heroTouchY - heroTouchOffsetY > -deleteHeroBtnHeight - heroSize
			&& heroTouchY - heroTouchOffsetY < 0;
	}

	async function endCore() {
		showHeroShadow = false;
		heroRenderer.clearOutMove();
		if (hitedHero) {
			let hitedHero2 = heroRenderer.isHitHero(heroTouchX - heroTouchOffsetX, heroTouchY - heroTouchOffsetY);
			if (hitedHero2 && hitedHero2.hero !== hitedHero.hero) {
				await heroManager.move(hitedHero.heroInfo, hitedHero2.heroInfo);
				heroRenderer.setHero(await heroManager.getAll());
			} else if (isHitDeleteHero) {
				let hero = hitedHero.hero as heroState;
				let res = await heroShop.sell(hero, hitedHero.heroInfo);
				heroRenderer.setHero(await heroManager.getAll());
			} else {
				heroRenderer.renderOutHero();
			}
		} else {
			heroRenderer.renderOutHero();
		}
		hitedHero = null;
		hitedHero2 = null;
		isHitDeleteHero = false;
	}
</script>

<main style={`width:${ratio > 2 ? width+'px' : height/2+'px'};height:${ratio > 2 ? width*2+'px' : height+'px'}`}>
	<canvas class="enemy-canvas" bind:this={canvas} />
	<div class="hero-canvas" bind:this={heroSec}>
		<Hero unitVw={unitVw} ratio={ratio} selectedIndex={hitedHero2 ? hitedHero2.heroInfo.index : -1} stage={hitedHero2 ? hitedHero2.heroInfo.stage : 'on'} />
	</div>
	{#if showHeroShadow}
	<div class="hero-shadow" style={`bottom: ${unitVw*30+1}px;`}>
		<Hero unitVw={unitVw} ratio={ratio} selectedIndex={hitedHero2 ? hitedHero2.heroInfo.index : -1} stage={hitedHero2 ? hitedHero2.heroInfo.stage : 'on'} />
		<div class="delete-hero-btn" class:hited={isHitDeleteHero}
			style={`height: ${unitVw*deleteHeroBtnHeight/heroCanvasWidth*100}px;`}>
			<div class="inner">
				移动到此区域卖掉该棋子（+{hitedHeroSoldMoney}）
			</div>
		</div>
	</div>
	{/if}
	<canvas class="bullet-canvas" bind:this={bulletCanvas} />
	<div class:h={ratio > 2} class:w={ratio <= 2} class="hp-box">
		<canvas class="hp-canvas" bind:this={HPCanvas} />
		<span class="hp-span">{HP}/1000</span>
	</div>
	<div class="event-mask" class:game-over={isGameOver} on:click={() => {
		showShop = false;
	}} on:touchstart={handleTouchStart} on:mousedown={handleMouseDown}></div>
	<button class:h={ratio > 2} class:w={ratio <= 2}
		disabled={currentTurn === 'BATTLE_TURN' || isGameOver}
		on:click={() => {
			game.startFighting();
			showShop = false;
		}} class="battle-btn">开始战斗</button>
	<button class:h={ratio > 2} class:w={ratio <= 2}
		disabled={isGameOver}
		on:click={handleShow} class="main-btn">商店</button>
	{#if showShop && !isGameOver}
		<Shop unitVw={unitVw} money={money} />
	{/if}
	<div class:h={ratio > 2} class:w={ratio <= 2} class="round-number">
		Round
		{#key roundNumber}
			<span in:fly={{ y: -40 }} out:fly={{ y: 80 }}>{roundNumber}</span>
		{/key}
	</div>
	<div class:h={ratio > 2} class:w={ratio <= 2} class="money">${money}</div>
	{#if isGameOver}
		<div class="game-over-box">
			<div class="game-over-item"
				style={`font-size: ${unitVw*12}px;padding-left: ${unitVw*2}px;`}
				in:fly={{ x: -600 }} out:fly={{ x: 1000 }}>
				Game Over
			</div>
			<button style={`margin: ${unitVw*2}px;width: fit-content;`}
				in:fly={{ x: -1200 }} out:fly={{ x: 1000 }}
				on:click={() => {
					heroShop.reset();
					heroManager.reset();
					game.restartGame();
				}}
				class="restart-btn">再来一盘</button>
		</div>
	{/if}
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
		// width: 100%;
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
		left: 0;
		z-index: 1002;
		.delete-hero-btn {
			box-sizing: border-box;
			width: 100%;
			padding: 5px;
			border-top: 1px solid gray;
			.inner {
				height: 100%;
				width: 100%;
				border: 1px dashed crimson;
				border-radius: 10px;
				display: flex;
				justify-content: center;
				align-items: center;
				cursor: default;
			}
			&.hited {
				.inner {
					background-color: crimson;
					color: white;
				}
			}
		}
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
		&.game-over {
			background-color: rgba(255, 255, 255, .8);
		}
	}
    .main-btn {
        position: absolute;
		z-index: 1001;
		border-radius: 5px;
		outline: none;
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
		outline: none;
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
		background-color: rgba(255, 255, 255, .8);
		font-family: Monaco;
		&.h {
			font-size: 6vw;
			top: 8vw;
			right: 8vw;
			padding: 0 4vw;
		}
		&.w {
			font-size: 3vh;
			top: 4vh;
			right: 4vh;
			padding: 0 2vh;
		}
	}
	.game-over-box {
		z-index: 1000000;
		position: absolute;
		right: 0;
		top: 30%;
		font-weight: 100;
		color: darkcyan;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		.game-over-item {
			background-color: ghostwhite;
		}
		.restart-btn {
			border: none;
			background-color: darkcyan;
			color: white;
			border-radius: 3px;
			box-shadow: 3px 4px 5px rgba(0, 0, 0, .2);
		}
	}
</style>
