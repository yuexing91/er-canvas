
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;

  _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function createElement(tag, attrs) {
  var el = document.createElement(tag);
  Object.keys(attrs).forEach(function (k) {
    el.setAttribute(k, attrs[k]);
  });
  return el;
}

function hasClass(el, cls) {
  return el.classList.contains(cls);
}

function getElementData(el, dataName) {
  return el.dataset[dataName];
}

function onSegment(sp, ep, p) {
  var xlen = 0;
  var ylen = 0;
  var len1 = 0; //sp到p的距离

  var len2 = 0; //ep到p的距离

  var len3 = 0; //sp到ep的距离

  xlen = Math.abs(Math.pow(sp.x - p.x, 2));
  ylen = Math.abs(Math.pow(sp.y - p.y, 2));
  len1 = Math.sqrt(xlen + ylen);
  xlen = Math.abs(Math.pow(ep.x - p.x, 2));
  ylen = Math.abs(Math.pow(ep.y - p.y, 2));
  len2 = Math.sqrt(xlen + ylen);
  xlen = Math.abs(Math.pow(ep.x - sp.x, 2));
  ylen = Math.abs(Math.pow(ep.y - sp.y, 2));
  len3 = Math.sqrt(xlen + ylen);
  var tmp = len1 + len2 - len3; //Math.round((len1 + len2)) - Math.round(len3);

  if (tmp < 0.1) {
    return true;
  }

  return false;
}

function toUpperCaseFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

var ErBase = /*#__PURE__*/function () {
  function ErBase() {}

  var _proto = ErBase.prototype;

  _proto.computedRect = function computedRect() {
    this.rect = this.el.getBoundingClientRect();
  };

  _proto.removeClass = function removeClass(cls) {
    this.el.classList.remove(cls);
  };

  _proto.addClass = function addClass(cls) {
    this.el.classList.add(cls);
  };

  return ErBase;
}();

var ErTableField = /*#__PURE__*/function (_ErBase) {
  _inheritsLoose(ErTableField, _ErBase);

  function ErTableField(options, table) {
    var _this;

    _this = _ErBase.call(this) || this;
    _this.type = 'ErTableField';
    _this.id = options.id;
    _this.tableId = table.id;
    _this.table = table;
    _this.options = options;

    _this.createEl();

    return _this;
  }

  var _proto = ErTableField.prototype;

  _proto.createEl = function createEl() {
    this.el = createElement('div', {
      'data-id': this.id,
      "class": 'er-table-field'
    });
    this.el.innerText = this.options.name;
  };

  _proto.getPoint = function getPoint() {
    var rect = this.rect;
    var tableRect = this.table.rect;
    var rootRect = this.table.er.rect;
    var y = rect.y + rect.height / 2;
    y = Math.max(y, tableRect.y + 30);
    y = Math.min(y, tableRect.y + tableRect.height - 1);
    y = y - rootRect.y;
    var x = tableRect.x - rootRect.x;
    return {
      left: {
        x: x,
        y: y
      },
      right: {
        x: x + tableRect.width,
        y: y
      }
    };
  };

  _proto.toJSON = function toJSON() {
    return Object.assign({}, this.options);
  };

  return ErTableField;
}(ErBase);

var ErTable = /*#__PURE__*/function (_ErBase) {
  _inheritsLoose(ErTable, _ErBase);

  function ErTable(options, er) {
    var _this;

    _this = _ErBase.call(this) || this;
    _this.type = 'ErTable';
    _this.er = er;
    _this.id = options.id;
    _this.fields = [];
    _this.options = options;

    _this.createEl();

    _this.updateName();

    _this.updatePos(options.top, options.left);

    options.fields.forEach(function (f) {
      return _this.addField(f);
    });
    return _this;
  }

  var _proto = ErTable.prototype;

  _proto.createEl = function createEl() {
    var _this2 = this;

    this.el = createElement('div', {
      'data-id': this.id,
      "class": 'er-table'
    });
    this.elHeader = createElement('div', {
      "class": 'er-table-header'
    });
    this.elBody = createElement('div', {
      "class": 'er-table-body'
    });
    this.el.appendChild(this.elHeader);
    this.el.appendChild(this.elBody);
    this.el.querySelector('.er-table-body').addEventListener('scroll', function (e) {
      _this2.er.repaint();
    });
  };

  _proto.updateName = function updateName() {
    this.elHeader.innerText = this.options.name;
  };

  _proto.updatePos = function updatePos(top, left) {
    this.top = top;
    this.left = left;
    this.el.style.top = top + 'px';
    this.el.style.left = left + 'px';
  };

  _proto.addField = function addField(field) {
    var erField = new ErTableField(field, this);
    this.fields.push(erField);
    this.elBody.appendChild(erField.el);
  };

  _proto.findField = function findField(id) {
    return this.fields.find(function (f) {
      return f.id == id;
    });
  };

  _proto.remove = function remove() {
    this.er.removeTableLines(this.id);
    this.el.parentElement.removeChild(this.el);
  };

  _proto.toJSON = function toJSON() {
    return Object.assign({}, this.options, {
      fields: this.fields.map(function (f) {
        return f.toJSON();
      })
    });
  };

  return ErTable;
}(ErBase);

var ErLine = /*#__PURE__*/function () {
  function ErLine(form, to, options) {
    this.type = 'ErLine';
    this.form = form;
    this.to = to;
    this.options = options;
  }

  var _proto = ErLine.prototype;

  _proto.draw = function draw(ctx, color) {
    this.drawLine(ctx, color);
  };

  _proto.drawLine = function drawLine(ctx, color) {
    var form = this.form.getPoint();
    var to = this.to.getPoint();
    var x1, y1, x2, y2;
    var sLine = 10;
    var eArrow = 10;
    var start = 'right';
    var end = 'left';

    if (form.right.x <= to.left.x) ; else if (form.left.x > to.right.x) {
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
      x: x1 + eArrow,
      y: y1
    };
    this.toPoint = {
      x: x2 - sLine * 1.5,
      y: y2
    };
  };

  _proto.inLine = function inLine(p) {
    return onSegment(this.formPoint, this.toPoint, p);
  };

  _proto.toJSON = function toJSON() {
    return Object.assign({}, this.options, {
      form: this.form.id,
      to: this.to.id
    });
  };

  return ErLine;
}();

var Er = /*#__PURE__*/function (_ErBase) {
  _inheritsLoose(Er, _ErBase);

  function Er(el, options) {
    var _this;

    _this = _ErBase.call(this) || this;
    _this.el = el;
    _this.options = options;
    _this.tables = [];
    _this.lines = [];
    _this._curSelect = null;
    _this.tempLine = null;

    _this.createCanvas();

    el.appendChild(_this.canvas);
    options === null || options === void 0 ? void 0 : options.tables.forEach(function (t) {
      return _this.addTable(t);
    });
    options === null || options === void 0 ? void 0 : options.lines.forEach(function (l) {
      return _this.addLine(l);
    });
    _this.ctx = _this.canvas.getContext('2d');

    _this.bindEvent();

    _this.repaint();

    return _this;
  }

  var _proto = Er.prototype;

  _proto.computedRect = function computedRect() {
    _ErBase.prototype.computedRect.call(this);

    this.rect.x -= this.el.scrollLeft;
    this.rect.y -= this.el.scrollTop;
  };

  _proto.createCanvas = function createCanvas() {
    this.canvas = createElement('canvas', {
      width: this.options.width || 900,
      height: this.options.height || 600
    });
  };

  _proto.resizeCanvas = function resizeCanvas(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
  };

  _proto.addTable = function addTable(table) {
    var erTable = new ErTable(table, this);
    this.tables.push(erTable);
    this.el.appendChild(erTable.el);
  };

  _proto.addLine = function addLine(line) {
    var form = this.findField(line.form);
    var to = this.findField(line.to);

    if (form.tableId == to.tableId) {
      return;
    }

    var t = new ErLine(form, to, line);
    if (this.findLine(t)) return;
    this.lines.push(t);
    this.repaint();
  };

  _proto.findTable = function findTable(id) {
    return this.tables.find(function (t) {
      return t.id == id;
    });
  };

  _proto.findField = function findField(id) {
    var field;
    this.tables.find(function (t) {
      return field = t.findField(id);
    });
    return field;
  };

  _proto.findLineByPoint = function findLineByPoint(p) {
    return this.lines.find(function (line) {
      return line.inLine(p);
    });
  };

  _proto.findLine = function findLine(line) {
    return this.lines.find(function (l) {
      return line === l || line.form.id == l.form.id && line.to.id == l.to.id;
    });
  };

  _proto.findLineById = function findLineById(form, to) {
    return this.lines.find(function (l) {
      return form == l.form.id && to == l.to.id;
    });
  };

  _proto.findLineByTableId = function findLineByTableId(tableId) {
    return this.lines.filter(function (l) {
      return l.form.tableId == tableId || l.to.tableId == tableId;
    });
  };

  _proto.clearAll = function clearAll() {
    this.lines = [];
    this.tables.forEach(function (t) {
      return t.remove();
    });
    this.tables = [];
    this.repaint();
  };

  _proto.removeTable = function removeTable(tableId) {
    var table = this.findTable(tableId);
    var i = this.tables.indexOf(table);

    if (i > -1) {
      this.tables.splice(i, 1);
      table.remove();
    }
  };

  _proto.removeTableLines = function removeTableLines(tableId) {
    var _this2 = this;

    this.findLineByTableId(tableId).forEach(function (l) {
      return _this2.removeLine(l);
    });
  };

  _proto.removeLine = function removeLine(line) {
    var l = this.findLine(line);
    var index = this.lines.indexOf(l);

    if (index > -1) {
      this.lines.splice(index, 1);
      this.repaint();
    }
  };

  _proto.trigger = function trigger(name) {
    var event = this.options['on' + toUpperCaseFirst(name)];

    if (event) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      event.apply(null, args);
    }
  };

  _proto.bindEvent = function bindEvent() {
    this.bindKeyborad();
    this.bindSelectTableEvent();
    this.bindMoveTableEvent();
    this.bindDrawLineEvent();
    this.bindLineEvent();
    this.bindContextMenuEvent();
  };

  _proto.bindContextMenuEvent = function bindContextMenuEvent() {
    var _this3 = this;

    this.el.addEventListener('contextmenu', function (e) {
      _this3.trigger('contextmenu', e, _this3._curSelect);

      e.preventDefault();
    });
  };

  _proto.bindKeyborad = function bindKeyborad() {
    var _this4 = this;

    this.el.addEventListener('keyup', function (e) {
      if (e.keyCode == 46) {
        var eventName = '';

        if (_this4._curSelect instanceof ErTable) {
          _this4.removeTable(_this4._curSelect.id);

          eventName = 'removeTable';
        } else if (_this4._curSelect instanceof ErLine) {
          _this4.removeLine(_this4._curSelect);

          eventName = 'removeLine';
        }

        var curSelect = _this4._curSelect;
        _this4.curSelect = null;

        _this4.repaint();

        _this4.trigger(eventName, curSelect);
      }
    });
  };

  _proto.bindSelectTableEvent = function bindSelectTableEvent() {
    var _this5 = this;

    var selectFn = function selectFn(e) {
      if (hasClass(e.target, 'er-table-header')) {
        var table = _this5.findTable(getElementData(e.target.parentElement, 'id'));

        _this5.curSelect = table;

        _this5.repaint();

        _this5.trigger('selectTable', table);
      }
    };

    this.el.addEventListener('contextmenu', selectFn);
    this.el.addEventListener('click', selectFn);
  };

  _proto.bindMoveTableEvent = function bindMoveTableEvent() {
    var _this6 = this;

    var point = {};
    var tableOrigin = {};
    var table = null;
    this.el.addEventListener('mousedown', function (e) {
      if (hasClass(e.target, 'er-table-header')) {
        table = _this6.findTable(getElementData(e.target.parentElement, 'id'));
        point = {
          x: e.pageX,
          y: e.pageY
        };
        tableOrigin = {
          x: table.left,
          y: table.top
        };
      }
    });
    this.el.addEventListener('mousemove', function (e) {
      if (!table) return;
      var x = e.pageX - point.x;
      var y = e.pageY - point.y;
      table.updatePos(Math.max(tableOrigin.y + y, 0), Math.max(tableOrigin.x + x, 0));

      _this6.repaint();
    });
    this.el.addEventListener('mouseup', function (e) {
      if (!table) return;
      table = null;
      tableOrigin = {};
      point = {};

      _this6.repaint();
    });
  };

  _proto.bindDrawLineEvent = function bindDrawLineEvent() {
    var _this7 = this;

    var formField = null;
    this.el.addEventListener('mousedown', function (e) {
      if (hasClass(e.target, 'er-table-field')) {
        formField = _this7.findField(getElementData(e.target, 'id'));
      }
    });
    this.el.addEventListener('mousemove', function (e) {
      if (!formField) return;
      _this7.tempLine = new ErLine(formField, {
        getPoint: function getPoint() {
          var p = {
            x: e.clientX - _this7.rect.x,
            y: e.clientY - _this7.rect.y
          };
          return {
            left: p,
            right: p
          };
        }
      });

      _this7.repaint();
    });
    this.el.addEventListener('mouseup', function (e) {
      if (!formField) return;

      if (hasClass(e.target, 'er-table-field')) {
        var toField = _this7.findField(getElementData(e.target, 'id'));

        _this7.addLine({
          form: formField.id,
          to: toField.id
        });
      }

      formField = null;
      _this7.tempLine = null;

      _this7.repaint();
    });
  };

  _proto.bindLineEvent = function bindLineEvent() {
    var _this8 = this;

    this.canvas.addEventListener('mousemove', function (e) {
      var l = _this8.findLineByPoint({
        x: e.offsetX,
        y: e.offsetY
      });

      if (_this8.hoverLine != l) {
        _this8.hoverLine = l;

        _this8.repaint();
      }
    });

    var selectLineFn = function selectLineFn(e) {
      var l = _this8.findLineByPoint({
        x: e.offsetX,
        y: e.offsetY
      });

      _this8.curSelect = l;

      _this8.repaint();

      _this8.trigger('selectLine', l);
    };

    this.canvas.addEventListener('click', selectLineFn);
    this.canvas.addEventListener('contextmenu', selectLineFn);
  };

  _proto.repaint = function repaint() {
    var _this9 = this;

    if (this._paint) return;
    this._paint = true;
    setTimeout(function () {
      _this9._paint = false;

      _this9.reComputedAllRect();

      _this9.ctx.clearRect(0, 0, _this9.canvas.width, _this9.canvas.height);

      _this9.lines.forEach(function (line) {
        return _this9.drawLine(line);
      });

      if (_this9.tempLine) {
        _this9.tempLine.draw(_this9.ctx);
      }
    }, 0);
  };

  _proto.reComputedAllRect = function reComputedAllRect() {
    this.computedRect();
    this.tables.forEach(function (t) {
      t.computedRect();
      t.fields.forEach(function (f) {
        return f.computedRect();
      });
    });
  };

  _proto.drawLine = function drawLine(line) {
    var color = '#000';

    if (this.curSelect == line) {
      color = 'red';
    }

    if (this.hoverLine == line) {
      color = '#dc2323';
    }

    line.draw(this.ctx, color);
  };

  _proto.toJSON = function toJSON() {
    return {
      width: this.options.width,
      height: this.options.height,
      tables: this.tables.map(function (t) {
        return t.toJSON();
      }),
      lines: this.lines.map(function (l) {
        return l.toJSON();
      })
    };
  };

  _createClass(Er, [{
    key: "curSelect",
    get: function get() {
      return this._curSelect;
    },
    set: function set(v) {
      var _this$_curSelect;

      if (((_this$_curSelect = this._curSelect) === null || _this$_curSelect === void 0 ? void 0 : _this$_curSelect.type) == 'ErTable') {
        this._curSelect.removeClass('er-table-selected');
      }

      if ((v === null || v === void 0 ? void 0 : v.type) == 'ErTable') {
        v.addClass('er-table-selected');
      }

      this._curSelect = v;
    }
  }]);

  return Er;
}(ErBase);

export { Er as default };
//# sourceMappingURL=index.es.js.map
