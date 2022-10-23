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
function createCat (data){
    const card = new Card(data, '#card-template');
    const newCardEl = card.getElement();    
    cardsBox.append(newCardEl);

}
function addNewCatFromForm(e) {
    e.preventDefault();
    const dataFromForm = [...formNewCat.elements];  
    const dataNewCat = serializeForm(dataFromForm); 
    api.addNewCat(dataNewCat)
        .then(()=> {
            createCat(dataNewCat);
            popupNewCat.close();
        })      
 
   
}
const popupNewCat = new Popup ("popup-add-cat");
btnAddCat.addEventListener('click', () => popupNewCat.open());
formNewCat.addEventListener('submit', addNewCatFromForm);
popupNewCat.setAddEventListener();

const api = new Api(CONFIG_API);
api.getAllCats()
    .then(({data}) => {
        data.forEach(function(catInfo) {
            createCat(catInfo);
        });
    });

