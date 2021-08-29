import { battleGroundDistance, battleGroundWidth, enemyColumn, enemySize, enemyYSpace } from '../const';

const BATTLE_TURN = Symbol('BATTLE_TURN');
const STRATEGY_TURN = Symbol('STRATEGY_TURN');

let HP = 1000;

let currentTurn = STRATEGY_TURN;
let currentRound = 0;

type Enemy = {
    value: number;
    index: number;
}
type EnemyQueue = {
    enemy: Enemy;
    next: EnemyQueue|null;
}

type EnemySet = {
    enemys: Enemy[];
    lengthTraveled: number;
}

let currentEnemySet: EnemySet = {
    enemys: [],
    lengthTraveled: 0,
};
let currentEnemySpeed = 5;
let currentAliveEnemyQueue: EnemyQueue|null = null;

let consumedFrameNumber = 0;
let producedFrameNumber = 0;
let isWorkLoopRunning = false;

function prepareBattleTurn(turnRound: number) {
    let enemySet: EnemySet = {
        enemys: [],
        lengthTraveled: 0,
    };

    let enemys: Enemy[] = [];
    for (let i = 0; i < 450; i++) {
        enemys.push({
            value: Math.ceil(Math.random() * 10),
            index: i,
        });
    }

    enemySet.enemys = enemys;

    let aliveEnemyQueue: EnemyQueue = {
        enemy: enemys[0],
        next: null
    };
    currentAliveEnemyQueue = aliveEnemyQueue;
    for (let i = 1; i < 450; i++) {
        aliveEnemyQueue = aliveEnemyQueue.next = {
            enemy: enemys[i],
            next: null
        };
    }

    currentEnemySet = enemySet;
}

function enemyCrossEndLine() {
    let lengthTraveled = currentEnemySet.lengthTraveled;
    if (lengthTraveled < battleGroundDistance) {
        return;
    }

    let targetIndex = Math.ceil(
        (lengthTraveled - battleGroundDistance) / (enemySize + enemyYSpace)
    ) * enemyColumn;

    while (currentAliveEnemyQueue && currentAliveEnemyQueue.enemy.index < targetIndex) {
        let value = currentAliveEnemyQueue.enemy.value;
        HP -= value;
        HP = HP < 0 ? 0 : HP;
        currentAliveEnemyQueue.enemy.value = 0;
        currentAliveEnemyQueue = currentAliveEnemyQueue.next;
    }
}

function isBattleToTheEnd() {
    return currentAliveEnemyQueue === null
        || HP <= 0;
}

async function battleTurnWorkLoop() {
    isWorkLoopRunning = true;
    while (!isBattleToTheEnd()) {
        currentEnemySet.lengthTraveled += currentEnemySpeed;
        enemyCrossEndLine();
        produceFrame();
        await Promise.resolve();
        if (producedFrameNumber - consumedFrameNumber > 100) {
            isWorkLoopRunning = false;
            return;
        }
    }

    toggleToStrategyTurn();
    isWorkLoopRunning = false;
}

function toggleToBattleTurn() {
    currentTurn = BATTLE_TURN;
    prepareBattleTurn(currentRound);
    battleTurnWorkLoop();
}

function toggleToStrategyTurn() {
    currentRound++;
    currentTurn = STRATEGY_TURN;
}

const produceFrame = () => {
    self.postMessage({
      type: 'PUSH_FRAME',
      frame: {
          enemys: currentEnemySet,
          HP,
      },
    });
    producedFrameNumber++;
}

export const startFighting = async () => {
    toggleToBattleTurn();
}

export const addConsumedFrameNumber = async () => {
    consumedFrameNumber++;
    if (!isWorkLoopRunning) {
        battleTurnWorkLoop();
    }
}


export default () => ({
    startFighting,
    addConsumedFrameNumber,
    addEventListener: self.addEventListener,
});
