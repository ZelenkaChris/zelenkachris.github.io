let moveSpeed = 3;

class Enemy extends GameObject {
    constructor(position, size) {
        super(position, size);
    }

    draw(ctx) {
        this.drawShadow(ctx);
        ctx.fillStyle = 'blue';
        ctx.fillRect(
            this.position.x - this.size.width/2, this.position.y - this.size.height/2,
            this.size.width, this.size.height
        );
    }

    move(timeDelta) {
        this.position.y += pps * timeDelta / 1000;;
    }

}