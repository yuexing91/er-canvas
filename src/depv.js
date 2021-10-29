import Er from './main';

window.er = new Er(document.querySelector('#app'), {
  width: 1600,
  height: 1200,
  onContextmenu(e, target) {
    console.log(target);
  },
  onSelectLine(line) {
//    alert(line.form.id);
  },
  tables: [{
    id: 'frb',
    name: '法人表',
    fields: Array(20).fill(1).map((t, i) => {
      return {
        id: 'frbfield' + i,
        name: '字段' + i,
      };
    }),
    top: 0,
    left: 0,
    width: 100,
    height: 100,
  }, {
    id: 'cyb',
    name: '从业人员表',
    fields: [
      {
        id: 'cybfield1',
        name: '字段1',
      },
      {
        id: 'cybfield2',
        name: '字段2',
      },
    ],
    top: 0,
    left: 300,
    width: 100,
    height: 100,
  }],
  lines: [{
    form: 'frbfield1',
    to: 'cybfield1',
  }],
});

export default Er
