const cardsBox = document.querySelector('.cards');
cats.forEach(function(catInfo) {
    const card = new Card(catInfo, '#card-template');
    const newCardEl = card.getElement();    
    cardsBox.append(newCardEl);
});

const popupNewCat = new Popup ("popup-add-cat");
// popupNewCat.open();s
