import { createElement } from './Util';
import ErTableField from './ErTableField';
import ErBase from './ErBase';

class ErTable extends ErBase {
  constructor(options, er) {
    super();
    this.type = 'ErTable';
    this.er = er;
    this.id = options.id;
    this.fields = [];
    this.options = options;
    this.createEl();
    this.updateName();
    this.updatePos(options.top, options.left);
    options.fields.forEach(f => this.addField(f));
  }

  createEl() {
    this.el = createElement('div', {
      'data-id': this.id,
      class: 'er-table',
    });
    this.elHeader = createElement('div', {
      class: 'er-table-header',
    });

    this.elBody = createElement('div', {
      class: 'er-table-body',
    });

    this.el.appendChild(this.elHeader);
    this.el.appendChild(this.elBody);

    this.el.querySelector('.er-table-body').addEventListener('scroll', (e) => {
      this.er.repaint();
    });

  }

  updateName() {
    this.elHeader.innerText = this.options.name;
  }

  updatePos(top, left) {
    this.top = top;
    this.left = left;
    this.el.style.top = top + 'px';
    this.el.style.left = left + 'px';
  }

  addField(field) {
    let erField = new ErTableField(field, this);
    this.fields.push(erField);
    this.elBody.appendChild(erField.el);
  }

  findField(id) {
    return this.fields.find(f => f.id == id);
  }

  remove() {
    this.er.removeTableLines(this.id);
    this.el.parentElement.removeChild(this.el);
  }

  toJSON() {
    return Object.assign({}, this.options, {
      fields: this.fields.map(f => f.toJSON()),
    });
  }

}

export default ErTable;
