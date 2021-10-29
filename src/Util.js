function createElement(tag, attrs) {
  let el = document.createElement(tag);
  Object.keys(attrs).forEach(k => {
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
  var tmp = ( len1 + len2 ) - len3; //Math.round((len1 + len2)) - Math.round(len3);
  if (tmp < 0.1) {
    return true;
  }
  return false;
}

function toUpperCaseFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export {
  createElement,
  onSegment,
  toUpperCaseFirst,
  hasClass,
  getElementData,
};
