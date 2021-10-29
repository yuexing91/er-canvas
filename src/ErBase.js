class ErBase {
  computedRect() {
    this.rect = this.el.getBoundingClientRect();
  }

  removeClass(cls) {
    this.el.classList.remove(cls)
  }

  addClass(cls){
    this.el.classList.add(cls)
  }

}

export default ErBase;
