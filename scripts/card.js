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
        const cardId = this.element.querySelector('.card__id');
        const cardImg = this.element.querySelector('.card__img');
        const cardLike = this.element.querySelector('.card__like'); 
        
        if(this._data.favourite){
            cardLike.classList.add('card__like-active');
        }
        cardName.textContent = this._data.name;
        cardId.textContent = this._data.id;
      
        cardImg.src = this._data.img_link;
        return this.element;
    }
}

class CardInfo extends Card {
    constructor(data, selectorTemp){
        super(data, selectorTemp)
    }
    _getTemplate(){
        return document.querySelector(this._selectorTemp).content.querySelector('.popup__container-info');
    }
    getElement(){
        
        this.element = this._getTemplate().cloneNode(true);
        const cardName = this.element.querySelector('.popup__cat-name');
        const cardId = this.element.querySelector('.popup__cat-id');
        const cardImg = this.element.querySelector('.popup__cat-img');
        const cardLike = this.element.querySelector('.card__like');
        const cardRate = this.element.querySelector('.popup__cat-rate');
        const cardAge = this.element.querySelector('.popup__cat-age');
        const cardDescription = this.element.querySelector('.popup__cat-description');
       

        // if(this._data.favourite){
        //     cardLike.classList.add('card__like-active');
        // }
        cardName.textContent = `Имя: ${this._data.name}`;
        cardId.textContent = `ID: ${this._data.id}`;
        cardAge.textContent = `Возраст: ${this._data.age}`;
        cardDescription.textContent = this._data.description;
        cardImg.src = this._data.img_link;
        let numbRate = this._data.rate;
        const starElem = this.element.querySelectorAll(".fa-star");
        console.log(numbRate, starElem);
        for(let i = 0; i < numbRate; i++){
            starElem[i].classList.add("star-black")
        }
       
        return this.element;
    }
   

}


