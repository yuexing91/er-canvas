import { onSegment } from './Util';

class ErLine {
  constructor(form, to, options) {
    this.type = 'ErLine';
    this.form = form;
    this.to = to;
    this.options = options;
  }

  draw(ctx, color) {
    this.drawLine(ctx, color);
  }

  drawLine(ctx, color) {
    let form = this.form.getPoint();
    let to = this.to.getPoint();
    let x1, y1, x2, y2;
    let sLine = 10;
    let eArrow = 10;

    let start = 'right';
    let end = 'left';

    if (form.right.x <= to.left.x) {

    } else if (form.left.x > to.right.x) {
      start = 'left';
      end = 'right';
      sLine = -10;
      eArrow = -10;
    } else if (form.left.x >= to.left.x && form.left.x <= to.right.x) {
      start = 'left';
      end = 'left';
      eArrow = -10;
      sLine = 10;
    }

    x1 = form[start].x;
    y1 = form[start].y;

    x2 = to[end].x;
    y2 = to[end].y;

    ctx.beginPath();
    ctx.lineWidth = '2';
    ctx.moveTo(x1, y1);
    ctx.lineTo(x1 + eArrow, y1);
    ctx.lineTo(x2 - sLine * 1.5, y2);
    ctx.lineTo(x2 - sLine, y2);
    ctx.strokeStyle = color || '#000';
    ctx.stroke();

    ctx.beginPath();
    ctx.lineTo(x2 - sLine, y2 - 4);
    ctx.lineTo(x2 - sLine, y2 + 4);
    ctx.lineTo(x2, y2);
    ctx.closePath();
    ctx.fillStyle = color || '#000';
    ctx.fill();

    this.formPoint = {
      x: x1 + eArrow, y: y1,
    };
    this.toPoint = {
      x: x2 - sLine * 1.5, y: y2,
    };
  }

  inLine(p) {
    return onSegment(this.formPoint, this.toPoint, p);
  }

  toJSON() {
    return Object.assign({}, this.options, {
      form: this.form.id,
      to: this.to.id,
    });
  }

}

export default ErLine;
