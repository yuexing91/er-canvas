import ErBase from './ErBase';
import { createElement } from './Util';

class ErTableField extends ErBase {
  constructor(options, table) {
    super();
    this.type = 'ErTableField';
    this.id = options.id;
    this.tableId = table.id;
    this.table = table;
    this.options = options;
    this.createEl();
  }

  createEl() {
    this.el = createElement('div', {
      'data-id': this.id,
      class: 'er-table-field',
    });
    this.el.innerText = this.options.name;
  }

  getPoint() {
    let rect = this.rect;
    let tableRect = this.table.rect;
    let rootRect = this.table.er.rect;

    let y = rect.y + rect.height / 2;
    y = Math.max(y, tableRect.y + 30);
    y = Math.min(y, tableRect.y + tableRect.height-1);
    y = y - rootRect.y;

    let x = tableRect.x - rootRect.x;

    return {
      left: {
        x,
        y,
      },
      right: {
        x: x + tableRect.width,
        y,
      },
    };

  }

  toJSON() {
    return Object.assign({}, this.options);
  }

}

export default ErTableField;
