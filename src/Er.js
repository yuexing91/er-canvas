import { createElement, getElementData, hasClass, toUpperCaseFirst } from './Util';
import ErBase from './ErBase';
import ErTable from './ErTable';
import ErLine from './ErLine';

class Er extends ErBase {
  constructor(el, options) {
    super();
    this.el = el;
    this.options = options;
    this.tables = [];
    this.lines = [];
    this._curSelect = null;
    this.tempLine = null;
    this.createCanvas();
    el.appendChild(this.canvas);
    options?.tables.forEach(t => this.addTable(t));
    options?.lines.forEach(l => this.addLine(l));
    this.ctx = this.canvas.getContext('2d');
    this.bindEvent();
    this.repaint();
  }

  computedRect() {
    super.computedRect();
    this.rect.x -= this.el.scrollLeft;
    this.rect.y -= this.el.scrollTop;
  }

  createCanvas() {
    this.canvas = createElement('canvas', {
      width: this.options.width || 900,
      height: this.options.height || 600,
    });
  }

  resizeCanvas(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
  }

  addTable(table) {
    let erTable = new ErTable(table, this);
    this.tables.push(erTable);
    this.el.appendChild(erTable.el);
  }

  addLine(line) {
    let form = this.findField(line.form);
    let to = this.findField(line.to);

    if (form.tableId == to.tableId) {
      return;
    }

    let t = new ErLine(form, to, line);

    if (this.findLine(t)) return;

    this.lines.push(t);
    this.repaint();
  }

  findTable(id) {
    return this.tables.find(t => t.id == id);
  }

  findField(id) {
    let field;
    this.tables.find(t => field = t.findField(id));
    return field;
  }

  findLineByPoint(p) {
    return this.lines.find(line => line.inLine(p));
  }

  findLine(line) {
    return this.lines.find(l => line === l || ( line.form.id == l.form.id && line.to.id == l.to.id ));
  }

  findLineById(form, to) {
    return this.lines.find(l => form == l.form.id && to == l.to.id);
  }

  findLineByTableId(tableId) {
    return this.lines.filter(l => l.form.tableId == tableId || l.to.tableId == tableId);
  }

  clearAll() {
    this.lines = [];
    this.tables.forEach(t => t.remove());
    this.tables = [];
    this.repaint();
  }

  removeTable(tableId) {
    let table = this.findTable(tableId);
    let i = this.tables.indexOf(table);
    if (i > -1) {
      this.tables.splice(i, 1);
      table.remove();
    }

  }

  removeTableLines(tableId) {
    this.findLineByTableId(tableId).forEach(l => this.removeLine(l));
  }

  removeLine(line) {
    let l = this.findLine(line);
    let index = this.lines.indexOf(l);
    if (index > -1) {
      this.lines.splice(index, 1);
      this.repaint();
    }
  }

  trigger(name, ...args) {
    let event = this.options['on' + toUpperCaseFirst(name)];
    if (event) {
      event.apply(null, args);
    }
  }

  bindEvent() {
    this.bindKeyborad();
    this.bindSelectTableEvent();
    this.bindMoveTableEvent();
    this.bindDrawLineEvent();
    this.bindLineEvent();
    this.bindContextMenuEvent();
  }

  bindContextMenuEvent() {
    this.el.addEventListener('contextmenu', (e) => {
      this.trigger('contextmenu', e, this._curSelect);
      e.preventDefault();
    });
  }

  bindKeyborad() {
    this.el.addEventListener('keyup', (e) => {
      if (e.keyCode == 46) {
        let eventName = '';
        if (this._curSelect instanceof ErTable) {
          this.removeTable(this._curSelect.id);
          eventName = 'removeTable';
        } else if (this._curSelect instanceof ErLine) {
          this.removeLine(this._curSelect);
          eventName = 'removeLine';
        }
        let curSelect = this._curSelect;
        this.curSelect = null;
        this.repaint();
        this.trigger(eventName, curSelect);
      }
    });
  }

  bindSelectTableEvent() {
    const selectFn = (e) => {
      if (hasClass(e.target, 'er-table-header')) {
        let table = this.findTable(getElementData(e.target.parentElement, 'id'));
        this.curSelect = table;
        this.repaint();
        this.trigger('selectTable', table);
      }
    };
    this.el.addEventListener('contextmenu', selectFn);
    this.el.addEventListener('click', selectFn);
  }

  bindMoveTableEvent() {
    let point = {};
    let tableOrigin = {};
    let table = null;

    this.el.addEventListener('mousedown', (e) => {
      if (hasClass(e.target, 'er-table-header')) {
        table = this.findTable(getElementData(e.target.parentElement, 'id'));
        point = { x: e.pageX, y: e.pageY };
        tableOrigin = { x: table.left, y: table.top };
      }
    });

    this.el.addEventListener('mousemove', e => {
      if (!table) return;
      let x = e.pageX - point.x;
      let y = e.pageY - point.y;
      table.updatePos(Math.max(tableOrigin.y + y, 0), Math.max(tableOrigin.x + x, 0));
      this.repaint();
    });

    this.el.addEventListener('mouseup', e => {
      if (!table) return;
      table = null;
      tableOrigin = {};
      point = {};
      this.repaint();
    });

  }

  bindDrawLineEvent() {
    let formField = null;

    this.el.addEventListener('mousedown', (e) => {
      if (hasClass(e.target, 'er-table-field')) {
        formField = this.findField(getElementData(e.target, 'id'));
      }
    });

    this.el.addEventListener('mousemove', e => {
      if (!formField) return;
      this.tempLine = new ErLine(formField, {
        getPoint: () => {
          let p = { x: e.clientX - this.rect.x, y: e.clientY - this.rect.y };
          return {
            left: p,
            right: p,
          };
        },
      });
      this.repaint();
    });

    this.el.addEventListener('mouseup', e => {
      if (!formField) return;
      if (hasClass(e.target, 'er-table-field')) {
        let toField = this.findField(getElementData(e.target, 'id'));
        this.addLine({
          form: formField.id,
          to: toField.id,
        });
      }
      formField = null;
      this.tempLine = null;
      this.repaint();
    });
  }

  bindLineEvent() {
    this.canvas.addEventListener('mousemove', e => {
      let l = this.findLineByPoint({ x: e.offsetX, y: e.offsetY });
      if (this.hoverLine != l) {
        this.hoverLine = l;
        this.repaint();
      }
    });

    const selectLineFn = e => {
      let l = this.findLineByPoint({ x: e.offsetX, y: e.offsetY });
      this.curSelect = l;
      this.repaint();
      this.trigger('selectLine', l);
    };

    this.canvas.addEventListener('click', selectLineFn);
    this.canvas.addEventListener('contextmenu', selectLineFn);
  }

  repaint() {
    if (this._paint) return;
    this._paint = true;
    setTimeout(() => {
      this._paint = false;
      this.reComputedAllRect();
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.lines.forEach(line => this.drawLine(line));
      if (this.tempLine) {
        this.tempLine.draw(this.ctx);
      }
    }, 0);
  }

  reComputedAllRect() {
    this.computedRect();
    this.tables.forEach(t => {
      t.computedRect();
      t.fields.forEach(f => f.computedRect());
    });
  }

  drawLine(line) {
    let color = '#000';
    if (this.curSelect == line) {
      color = 'red';
    }
    if (this.hoverLine == line) {
      color = '#dc2323';
    }

    line.draw(this.ctx, color);
  }

  get curSelect() {
    return this._curSelect;
  }

  set curSelect(v) {
    if (this._curSelect?.type == 'ErTable') {
      this._curSelect.removeClass('er-table-selected');
    }
    if (v?.type == 'ErTable') {
      v.addClass('er-table-selected');
    }
    this._curSelect = v;
  }

  toJSON() {
    return {
      width: this.options.width,
      height: this.options.height,
      tables: this.tables.map(t => t.toJSON()),
      lines: this.lines.map(l => l.toJSON()),
    };
  }

}

export default Er;
