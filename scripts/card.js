class Card {
  constructor(data, selectorTemp) {
    this._data = data;
    this._selectorTemp = selectorTemp;
  }
  _getTemplate() {
    return document
      .querySelector(this._selectorTemp)
      .content.querySelector(".card");
  }
  getElement() {
    this.element = this._getTemplate().cloneNode(true);
    const cardName = this.element.querySelector(".card__title");
    const cardId = this.element.querySelector(".card__id");
    const cardImg = this.element.querySelector(".card__img");
    const cardLike = this.element.querySelector(".card__like");

    if (this._data.favourite) {
      cardLike.classList.add("card__like-active");
    }
    cardName.textContent = this._data.name;
    cardId.textContent = this._data.id;

    cardImg.src = this._data.img_link;
    return this.element;
  }
}

class CardInfo extends Card {
  constructor(data, selectorTemp) {
    super(data, selectorTemp);
  }
  _getTemplate() {
    return document
      .querySelector(this._selectorTemp)
      .content.querySelector(".popup__container-info");
  }
  getElement() {
    this.element = this._getTemplate().cloneNode(true);
    const cardName = this.element.querySelector(".form__input-cat-name");
    const cardId = this.element.querySelector(".form__input-cat-id");
    const cardImg = this.element.querySelector(".form__cat-img");
    const cardLike = this.element.querySelector(".card__like");

    const cardAge = this.element.querySelector(".form__input-cat-age");
    const cardDescription = this.element.querySelector(
      ".form__cat-description"
    );

    if (this._data.favourite) {
      cardLike.classList.add("card__like-active");
    }
    cardName.value = this._data.name;
    cardId.value = this._data.id;
    cardAge.value = this._data.age;
    cardDescription.textContent = this._data.description;
    cardImg.src = this._data.img_link;
    let numbRate = this._data.rate;
    const starElem = this.element.querySelectorAll(".fa-star");

    for (let i = 0; i < numbRate; i++) {
      starElem[i].classList.add("star-black");
    }

    return this.element;
  }
}
