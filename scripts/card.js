class Card {
    constructor(data, selectorTemp){
        this._data = data;
        this._selectorTemp = selectorTemp;
    }
    _getTemplate(){
        return document.querySelector(this._selectorTemp).content.querySelector('.card');
    }
    getElement(){
        this.element = this._getTemplate().cloneNode(true);
        const cardName = this.element.querySelector('.card__title');
        const cardImg = this.element.querySelector('.card__img');
        const cardLike = this.element.querySelector('.card__like');
        if(!this._data.favourite){
            cardLike.remove();
        }
        cardName.textContent = this._data.name;
        cardImg.src = this._data.img_link;
        return this.element;
    }
}




