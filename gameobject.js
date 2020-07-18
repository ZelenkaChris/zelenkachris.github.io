class GameObject {
    constructor(position, size) {
        this.position = position;
        this.size = size;
    }

    draw(ctx) {
        this.drawShadow(ctx);

        ctx.fillStyle = 'gray';
        ctx.fillRect(
            this.position.x - this.size.width/2, this.position.y - this.size.height/2,
            this.size.width, this.size.height
        );
    }

    drawShadow(ctx) {
        ctx.fillStyle = 'black';
        ctx.filter = 'opacity(50%)';
        ctx.fillRect(
            this.position.x - this.size.width/4, this.position.y - this.size.height/4,
            this.size.width, this.size.height
        );
        ctx.filter = 'opacity(100%)';
    }
}