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
    return dataForm;
}
function openCatInfo(card){
    const cardLink = card.querySelector(".card__link");
    cardLink.addEventListener('click',(e) => {
            e.preventDefault();
            const id = e.target.closest('.card__link').querySelector(".card__id");
            getCatInfo(id.textContent); 
        });    

}

function createCat (data){
    const card = new Card(data, '#card-template');
    const newCardEl = card.getElement(); 
    openCatInfo(newCardEl)  ;
       
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
    deleteCardCat();

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


    
popupCardInfo.addEventListener('click', (e)=> {
    e.preventDefault();
    const discript = popupCardInfo.querySelector(".form__cat-description"); 
    const age =  popupCardInfo.querySelector(".form__input-cat-age");
    const like =  popupCardInfo.querySelector(".form__cat-like");
    const btnSave =   popupCardInfo.querySelector(".btn-save");  
    const btnChange =   popupCardInfo.querySelector(".btn-change");  

    if(e.target.classList.contains("btn-delete") || e.target.closest(".fa-trash")){
        const idCard = popupCardInfo.querySelector(".form__input-cat-id").value;  
        {            
            api.deleteCatById(idCard)
                .then(()=>{                   
                    localStorage.removeItem('cats');
                    location.reload();                    
                })  
                popupCatInfo.close();           
        }  

    }

    if (e.target.classList.contains("btn-change") || e.target.closest(".fa-pen-to-square")) {       
        discript.toggleAttribute("disabled");
        age.classList.add("focus");
        discript.classList.add("focus");
        age.toggleAttribute("disabled");
        // like.toggleAttribute("disabled");
        
        
        // console.log(e.target);            
        btnSave.classList.toggle("unvisible"); 
        btnChange.classList.toggle("unvisible");

          
    }

    if (e.target.classList.contains("btn-save") || e.target.closest(".fa-download")){ 
        discript.toggleAttribute("disabled");
        age.toggleAttribute("disabled");
        like.toggleAttribute("disabled");
        age.classList.remove("focus")
        discript.classList.remove("focus");
        btnSave.classList.toggle("unvisible"); 
        btnChange.classList.toggle("unvisible");
        const formAboutCat = document.querySelector(".popup__form-cat-info");
        const CatInfo = [...formAboutCat.elements];
        // console.log(CatInfo);

        const newCatInfo = serializeForm(CatInfo);
        
        const idCard = newCatInfo.id;
        console.log(idCard);
            api.updateCatById(idCard, newCatInfo )
                .then(()=> {
                    const dataLocalCats = JSON.parse(localStorage.getItem('cats'));
                    // console.log (dataLocalCats);
                    const newDataLocal = dataLocalCats.map((localInfo) => {
                        // console.log( localInfo.id);
                        if(localInfo.id == idCard ){
                            console.log(localInfo, newCatInfo);
                            localInfo = {...localInfo, ...newCatInfo}; 
                            console.log (localInfo);
                            return localInfo;
                        } else {
                            return localInfo;
                } 
        
        },[] )
        console.log (newDataLocal);
        localStorage.setItem('cats', JSON.stringify(newDataLocal));
            setDataRefresh(LIVE_LOCAL_STORAGE);
                })      
        
    } 

})


const popupNewCat = new Popup ("popup-add-cat");
const popupLogin = new Popup ("popup-login");
const popupCatInfo = new Popup ("popup__cat-info");

btnAddCat.addEventListener('click', () => popupNewCat.open());
btnLogin.addEventListener('click', () => popupLogin.open());
formNewCat.addEventListener('submit', addNewCatFromForm);
formLogin.addEventListener('submit', loginFromForm);
popupNewCat.setAddEventListener();
popupLogin.setAddEventListener();
popupCatInfo.setAddEventListener(); 


const isLogin = Cookies.get('email');
if(!isLogin){
    popupLogin.open();
    
}else {
    btnAddCat.classList.remove('visually-hidden');
}