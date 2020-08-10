let canvas = document.getElementById('game');
let ctx = canvas.getContext('2d');

const gameVersion = '0.1b';

let gameHeight = 1280;
let gameWidth = 720;

let gameState = 'menu';

let player = new Player(
    {
        x: 360,
        y: 1200
    },
    {
        width: 50,
        height: 50
    }  
);

let keysHeld = {
    ArrowUp: 0,
    ArrowDown: 0,
    ArrowLeft: 0,
    ArrowRight: 0,
    c: 0,
    z: 0,
    r: 0
};
let modeToggle = false;

let enemies = [];
let clouds = [];

let lastSpawn, cLastSpawn;
lastSpawn = cLastSpawn = new Date();

let currentTime = new Date;
let nextTime;
let timeDelta = 0;

let menuVars = {
    current: 'main',
    selected: 0,
    main: {
        start: 'Start',
        options: 'Options'
    }
}

let menuToggle = false;

this.addEventListener('keydown', (event) => {
    if( event.key == 'ArrowUp' ||
        event.key == 'ArrowDown' ||
        event.key == 'ArrowLeft' ||
        event.key == 'ArrowRight' ||
        event.key == 'c' ||
        event.key == 'z' || 
        event.key == 'r'
    )
        keysHeld[event.key] = 1;
})

this.addEventListener('keyup', (event) => {
    if( event.key == 'ArrowUp' ||
        event.key == 'ArrowDown' ||
        event.key == 'ArrowLeft' ||
        event.key == 'ArrowRight' ||
        event.key == 'c' ||
        event.key == 'z' || 
        event.key == 'r'
    )
        keysHeld[event.key] = 0;
})

initialize = () => {
    requestAnimationFrame(animate);
}

drawPosition = () => {
    ctx.fillStyle = '#fff';
    ctx.filter = "opacity(50%)";
    ctx.fillRect(0,0, 125, 175);
    ctx.fillStyle = '#333';
    ctx.filter = "opacity(50%)";
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(Math.floor(player.position.x) + ', ' + Math.floor(player.position.y), 10, 20);
    ctx.fillText(keysHeld.ArrowUp + ', ' + keysHeld.ArrowDown + ', ' + keysHeld.ArrowLeft + ', ' + keysHeld.ArrowRight, 10, 45);
    ctx.fillText(keysHeld.c + ', ' + keysHeld.z + ', ' + keysHeld.r, 10, 65);
    ctx.fillText('Bullets: ' + player.bullets.length, 10, 90);
    ctx.fillText('Mode: ' + player.mode, 10, 115);
    ctx.fillText('Enemies: ' + enemies.length, 10, 140);
    ctx.fillText('ver: ' + gameVersion, 10, 165);
    ctx.filter = "opacity(100%)";
}

keys2bits = () => {
    let a = [];
    a.push(keysHeld.ArrowUp);
    a.push(keysHeld.ArrowDown);
    a.push(keysHeld.ArrowLeft);
    a.push(keysHeld.ArrowRight);
    a.push(keysHeld.c);
    a.push(keysHeld.z);
    a.push(keysHeld.r);
    return a;
}

playerStuff = (isOver) => {
    if(!isOver) {
        let keys = keys2bits();
        player.movement(keys, timeDelta);

        if(!modeToggle && keys[5]) {
            modeToggle = true;
            player.switchMode();
        } else if (modeToggle && !keys[5]) {
            modeToggle = false;
        }

        player.shoot(
            {
                x: player.position.x,
                y: player.position.y - player.size.height/2
            },
            keys[4]
        );


        
        player.drawBullets(ctx);
    }
    player.draw(ctx);
}

spawnEnemy = () => {
    let timeDelta = Math.abs(nextTime - lastSpawn);
    if(timeDelta > 640) {
        enemies.push(
            new Enemy(
                {
                    x: Math.floor(Math.random() * 670) + 25,
                    y: -25
                },
                {
                    width: 50,
                    height: 50
                }
            )
        );
        
        lastSpawn = new Date();
    }
}

checkEnemyHit = (enemy) => {
    let left = enemy.position.x - enemy.size.width/2;
    let right = enemy.position.x + enemy.size.width/2;

    let top = enemy.position.y - enemy.size.height/2;
    let bottom = enemy.position.y + enemy.size.height/2;

    let {bullets} = player;

    for(let i=0; i<bullets.length; i++) {
        let {x, y} = bullets[i].position;
        let {size} = bullets[i];

        let preCheck = Math.sqrt( Math.pow( x - enemy.position.x , 2) + Math.pow( y - enemy.position.y, 2))

        if(preCheck > 50) {
            continue;
        }


        let hor = Math.max(left, Math.min(x, right));
        let ver = Math.max(top, Math.min(y, bottom));

        let distX = x - hor;
        let distY = y - ver;

        let distance = Math.sqrt( (distX * distX) + (distY * distY));

        if(distance <= size) {
            //remove bullet
            player.bullets.splice(i, 1);
            return true;
        }

    }
    return false;
}

enemyStuff = () => {
    for(let i=0; i<enemies.length; i++){
        enemies[i].move(timeDelta);
        if(player.checkHit(enemies[i])) {
            player.getHit(gameOver);
        }

        if(enemies[i].position.y > 1305) {
            enemies.splice(i, 1);
            i--;
        } else {
            if(checkEnemyHit(enemies[i])) {
                enemies.splice(i, 1);
                i--;
            } else {
                enemies[i].draw(ctx);
            }
        }
    
    }
}


spawnCloud = () => {    
    let spawnDelta = Math.abs(currentTime - cLastSpawn);
    if(spawnDelta > 3200) {
        clouds.push(
            new Cloud(
                {
                    x: Math.floor(Math.random() * 670) + 25,
                    y: -125
                },
                {
                    width: 400,
                    height: 250
                }
            )
        );
        
        cLastSpawn = new Date();
    }
}

drawBackground = () => {
    ctx.fillStyle = 'lightgreen';
    ctx.fillRect(0, 0, 720, 1280);

    for(let i=0; i<clouds.length; i++) {
        let {y} = clouds[i].position;

        if(y > 1405) {
            clouds.splice(i, 1);
            i--;
        } else {
            clouds[i].move(timeDelta);
            clouds[i].draw(ctx);
        }

    }
}

drawGameOver = () => {
    ctx.fillStyle = '#fff';
    ctx.filter = "opacity(66%)";
    ctx.font = '66px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', gameWidth/2, gameHeight/2);
    ctx.filter = 'opactiy(100%)';
    
}

gameOver = () => {
    gameState = 'gameover';
}

drawLogo = () => {
    ctx.fillStyle = '#000';
    ctx.font = '80px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Danmaku Z', gameWidth/2, gameHeight/4);
}

drawMade = () => {
    ctx.fillStyle = '#000';
    ctx.font = '20px Arial';
    ctx.textAlign = 'right';
    ctx.fillText('ChrisZ 2020', gameWidth - 10, gameHeight - 10);
}

drawMenu = (cur) => {
    let items = menuVars[cur];
    let {selected} = menuVars;

    let startHeight = gameHeight * 3/4;

    ctx.fillStyle = '#666';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';

    let i = 0;
    for(key in items){
        if(selected === i) 
            ctx.fillStyle = '#000';
        else
            ctx.fillStyle = '#666';
        ctx.fillText(items[key], gameWidth/2, startHeight + 60 * i);
        i++;
    }
}

menuInput = (cur) => {
    let keys = keys2bits();

    let size = Object.keys(menuVars[cur]).length;

    if(keys[5]){
        console.log('Selected: ' + menuVars.selected);
        if(menuVars.selected === 0)
            gameState = 'play';
        return;
    }

    if(!keys[0] && !keys[1])
        menuToggle = false;

    if (keys[0] && !menuToggle) {
        menuVars.selected = (menuVars.selected - 1) % size;
        if(menuVars.selected < 0 ) menuVars.selected = size - 1;
        menuToggle = true;
    } else if (keys[1] && !menuToggle) {
        menuVars.selected = (menuVars.selected + 1) % size;
        menuToggle = true;
    }
}

menuState = () => {
    spawnCloud();
    drawBackground();

    menuInput(menuVars.current);

    drawLogo();
    drawMenu(menuVars.current);

    drawMade();
    drawPosition();
}

playState = () => {
    spawnCloud();
    drawBackground();

    spawnEnemy();

    playerStuff();
    enemyStuff();
    
    drawPosition();
}

overState = () => {
    if(enemies.length > 0) enemies = [];
    spawnCloud();
    drawBackground();

    playerStuff(true);

    drawGameOver();

    drawPosition();
}

animate = () => {
    ctx.clearRect(0, 0, 720, 1280);
    nextTime = new Date();
    timeDelta = Math.abs(nextTime - currentTime);

    switch(gameState) {
        case 'menu':
            menuState();
            break;
        case 'play': 
            playState();
            break;
        case 'gameover':
            overState();
            break;
        default:
            break;
    }

    currentTime = nextTime;

    requestAnimationFrame(animate);
}

initialize();