const cardsBox = document.querySelector('.cards');
const btnAddCat = document.querySelector("#add");
const btnLogin = document.querySelector("#login");

const formLogin = document.querySelector('#form__login');
const formNewCat = document.querySelector('#form__add-new-cat');
const api = new Api(CONFIG_API);
const LIVE_LOCAL_STORAGE = 60;


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
function loginFromForm(e) {
    e.preventDefault();
    const dataFromForm = [...formLogin.elements];  
    const dataLogin = serializeForm(dataFromForm); 
    Cookies.set('email',`${dataLogin.email}`)
    popupLogin.close();
    btnAddCat.classList.remove('visually-hidden');
   
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
function setDataRefresh(min) {
    const setTime = new Date(new Date().getTime() + min * 60000);
    localStorage.setItem('catsRefresh', setTime);
    return setTime;

}
    

function checkLocalStorage() {
    const dataLocal =  JSON.parse(localStorage.getItem('cats'));
    const getTimeEnd = localStorage.getItem('catsRefresh');
   
    if (dataLocal && dataLocal.length && new Date() < new Date(getTimeEnd)){
        dataLocal.forEach(function(catInfo) {
                createCat(catInfo);
        })
    } else {
        api.getAllCats()
        .then(({data}) => {
            data.forEach(function(catInfo) {
                createCat(catInfo);
            });
            localStorage.setItem('cats', JSON.stringify(data));
            setDataRefresh(LIVE_LOCAL_STORAGE);
        });
       

    }
}

checkLocalStorage();

const popupNewCat = new Popup ("popup-add-cat");
const popupLogin = new Popup ("popup-login");
btnAddCat.addEventListener('click', () => popupNewCat.open());
btnLogin.addEventListener('click', () => popupLogin.open());
formNewCat.addEventListener('submit', addNewCatFromForm);
formLogin.addEventListener('submit', loginFromForm);
popupNewCat.setAddEventListener();
popupLogin.setAddEventListener();

const isLogin = Cookies.get('email');
if(!isLogin){
    popupLogin.open();
    
}else {
    btnAddCat.classList.remove('visually-hidden');
}