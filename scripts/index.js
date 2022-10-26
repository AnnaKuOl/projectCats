const cardsBox = document.querySelector('.cards');
const btnAddCat = document.querySelector("#add");
const btnLogin = document.querySelector("#login");
const formLogin = document.querySelector('#form__login');
const formNewCat = document.querySelector('#form__add-new-cat');
const popupCardInfo = document.querySelector(".popup__cat-info");


const api = new Api(CONFIG_API);
const LIVE_LOCAL_STORAGE = 60;


function serializeForm(elements) {
    const dataForm = {};
    console.log(elements);
   
    elements.forEach(elem => {
        // console.log(elem);
        if (elem.type === "submit"){
            return;
        }

        if (elem.type !== "checkbox"){
            dataForm[elem.name] = elem.value;
        }
        if (elem.type === "checkbox") {
           
            dataForm[elem.name] = elem.checked;

            
            console.log (elem.checked);

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
    // console.log(dataFromForm );
    // console.log(formNewCat );
    const dataNewCat = serializeForm(dataFromForm); 
    console.log(dataNewCat);
    api.addNewCat(dataNewCat)
        .then(()=> {
            createCat(dataNewCat);
            popupNewCat.close();
            const cats = JSON.parse(localStorage.getItem('cats'));
            cats.push(dataNewCat);
                      
            localStorage.setItem('cats', JSON.stringify(cats));
            setDataRefresh(LIVE_LOCAL_STORAGE);
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


function createCatInfoCard (data) {
    if (!!popupCardInfo.children.length){            
        popupCardInfo.innerHTML = "";
    }
    const newCardInfo = new CardInfo(data, '#info-template')
    const newCard = newCardInfo.getElement();                     
    popupCardInfo.append(newCard); 
    popupCatInfo.open(); 

}

function getCatInfo (id) {
    const dataLocal =  JSON.parse(localStorage.getItem('cats'));
    const getTimeEnd = localStorage.getItem('catsRefresh');
   
    if (dataLocal && dataLocal.length && new Date() < new Date(getTimeEnd)){
        dataLocal.forEach(elem =>{
            if (elem.id == id){
                createCatInfoCard (elem);
            }            
        })  
    }else {
    api.getCatById(id)
    .then (({data}) => {
        const dataInfo = data;
       
        createCatInfoCard (dataInfo) ;       
    })}
}

const popupNewCat = new Popup ("popup-add-cat");
const popupLogin = new Popup ("popup-login");
const popupCatInfo = new Popup ("popup__cat-info");

btnAddCat.addEventListener('click', () => popupNewCat.open());
btnLogin.addEventListener('click', () => popupLogin.open());
formNewCat.addEventListener('submit', addNewCatFromForm);
formLogin.addEventListener('submit', loginFromForm);
popupNewCat.setAddEventListener();
popupLogin.setAddEventListener();
const cardLink = document.querySelectorAll(".card__link");
cardLink.forEach(elem => {
    elem.addEventListener('click',(e) => {
        e.preventDefault();
        const id = e.target.closest('.card__link').querySelector(".card__id");
        getCatInfo(id.textContent); 
     
    
    
    });
})


// cardsBox.addEventListener('click', (e) => {
//     const id = e.target.querySelector('.card__id');
//     getCatInfo(id.textContent); 
        
//      } );
popupCatInfo.setAddEventListener();

const isLogin = Cookies.get('email');
if(!isLogin){
    popupLogin.open();
    
}else {
    btnAddCat.classList.remove('visually-hidden');
}