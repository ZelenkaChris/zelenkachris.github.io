let movespeed = 3;
let bulletSize = 6;
let lastShot = new Date();
let modes = 3;
let isHit = false;

let health = 1;

let pps = 430;

class Player extends GameObject {
    constructor(position, size) {
        super(position, size);
        this.bullets = [];
        this.mode = 0;
    }

    drawBullets(ctx) {
        for(let i=0; i<this.bullets.length; i++) {
            this.bullets[i].move();
            if(this.bullets[i].position.y < -10) {
                this.bullets.splice(i, i+1);
                i--;
            } else {
                this.bullets[i].draw(ctx);
            }
        }
    }

    movement(move, timeDelta) {
        let hori = 0;
        let vert = 0;

        if(move[0] && !move[1]) {
            vert = -pps * timeDelta / 1000;
        } else if (!move[0] && move[1]) {
            vert = pps * timeDelta / 1000;
        }

        if (move[2] && !move[3]) {
            hori = -pps * timeDelta / 1000;
        } else if (!move[2] && move[3]) {
            hori = pps * timeDelta / 1000;
        }

        this.position.x += hori;
        this.position.y += vert;

        let {x, y} = this.position;
        let {width, height} = this.size;

        if(x - width/2 < 0) {
            this.position.x = 0 + width/2;
        } else if (x + width/2 > 720) {
            this.position.x = 720 - width/2;
        }

        if(y - height/2 < 0) {
            this.position.y = 0 + height/2;
        } else if (y + height/2 > 1280) {
            this.position.y = 1280 - height/2;
        }
    }

    shoot(position, key) {
        if(key == 1) {
            let currentShot = new Date();

            let timeDelta = Math.abs(currentShot - lastShot);

            if(timeDelta > 75) {
                if(this.mode == 0) {
                    let a = new Bullet(
                        {
                            x: position.x, 
                            y: position.y
                        }, 
                        bulletSize,
                        this.mode,
                        0
                    );
                    this.bullets.push(a);
                } else if (this.mode == 1) {
                    let a = new Bullet(
                        {
                            x: position.x - 15, 
                            y: position.y
                        }, 
                        bulletSize,
                        this.mode,
                        0
                    );
                    let b = new Bullet(
                        {
                            x: position.x + 15, 
                            y: position.y
                        }, 
                        bulletSize,
                        this.mode,
                        0
                    );
                    this.bullets.push(a);
                    this.bullets.push(b);
                } else if (this.mode == 2) {
                    let a = new Bullet(
                        {
                            x: position.x, 
                            y: position.y
                        }, 
                        bulletSize,
                        this.mode,
                        -1
                    );
                    let b = new Bullet(
                        {
                            x: position.x, 
                            y: position.y
                        }, 
                        bulletSize,
                        this.mode,
                        0
                    );
                    let c = new Bullet(
                        {
                            x: position.x, 
                            y: position.y
                        }, 
                        bulletSize,
                        this.mode,
                        1
                    );
                    this.bullets.push(a);
                    this.bullets.push(b);
                    this.bullets.push(c);
                } else {
                    let a = new Bullet(
                        {
                            x: position.x, 
                            y: position.y
                        }, 
                        bulletSize,
                        this.mode,
                        0
                    );
                    this.bullets.push(a);
                }

                lastShot = new Date();
            }
        }
    }

    checkHit(enemy) {
        let left = enemy.position.x - enemy.size.width/2;
        let right = enemy.position.x + enemy.size.width/2;

        let top = enemy.position.y - enemy.size.height/2;
        let bottom = enemy.position.y + enemy.size.height/2;

        let {x, y} = this.position;
        let {width, height} = this.size;

        let preCheck = Math.sqrt( Math.pow( x - enemy.position.x, 2) + Math.pow( y - enemy.position.y, 2));

        if(preCheck > 500) {
            return;
        }

        if ( x - width/2 < right &&
            x + width/2 > left &&
            y - height/2 < bottom &&
            y + height/2 > top) {
                return true;
        }
    }

    getHit(callback) {
        this.isHit = true;
        health--;

        console.log(health);

        if(health <= 0) {
            callback();
        }
    }

    switchMode() {
        this.mode = (this.mode + 1) % modes;
    }
}