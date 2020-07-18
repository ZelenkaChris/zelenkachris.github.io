let bulletSpeed = 5;
let bulletPPS = 720;

class Bullet extends GameObject {
    constructor(position, size, mode, direction) {
        super(position, size);
        this.mode = mode;
        this.direction = direction;
    }

    draw(ctx) {
        ctx.fillStyle = 'red';
        
        ctx.beginPath();
        ctx.arc(
            this.position.x, this.position.y,
            this.size,
            0, 2 * Math.PI
        );
        ctx.stroke();
        ctx.fill();
    }

    move() {
        this.position.y -= bulletPPS * timeDelta / 1000;
        this.position.x += bulletPPS * timeDelta / 1000 * (this.direction * 3 / 5);
    }
}