const cardsBox = document.querySelector('.cards');
const btnAddCat = document.querySelector("#add");
const formNewCat = document.querySelector('#form__add-new-cat');



function serializeForm(elements) {
    const dataForm = {};
    elements.forEach(elem => {
        if (elem.type === "submit"){
            return;
        }

        if (elem.type !== "checkbox"){
            dataForm[elem.name] = elem.value;
        }
        if (elem.type === "checkbox") {
            dataForm[elem.name] = elem.checked;
        }
    })
    console.log (dataForm);
    return dataForm;
}
function addNewCatFromForm(e) {
    e.preventDefault();
    const dataFromForm = [...formNewCat.elements];
    console.log(dataFromForm );
    const dataNewCat = serializeForm(dataFromForm);
    console.log(dataNewCat);
    const card = new Card(dataNewCat, '#card-template');
    const newCardEl = card.getElement();    
    cardsBox.append(newCardEl);
    popupNewCat.close();
   
}

cats.forEach(function(catInfo) {
    const card = new Card(catInfo, '#card-template');
    const newCardEl = card.getElement();    
    cardsBox.append(newCardEl);
});

const popupNewCat = new Popup ("popup-add-cat");

btnAddCat.addEventListener('click', () => popupNewCat.open());
formNewCat.addEventListener('submit', addNewCatFromForm);
popupNewCat.setAddEventListener();