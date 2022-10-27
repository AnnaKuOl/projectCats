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

function deleteCardCat() {
  popupCardInfo.addEventListener('click', (e)=>{    
    const popup = popupCardInfo.children;
    
    const popupChild = popup[0].children;
    const idCard = parseInt(popupChild[3].textContent.slice(3));
        if (e.target.classList.contains("btn-delete")) {
            
            api.deleteCatById(idCard)
                .then(()=>{
                    console.log(idCard);
                    localStorage.removeItem('cats');
                    location.reload();
                    
                })         

                popupCatInfo.close();            
        }       
        
    }
    )
}
    
// popupCardInfo.addEventListener('click', (e)=> {
//     let dataNew = '';
//     if (e.target.classList.contains("btn-change")) {
//         const discript = popupCardInfo.querySelector(".popup__cat-description");            
//         discript.disabled = false;
//         discript.focus();
//         discript.textContent = "";
//         console.log(e.target);            
//         popupCardInfo.querySelector(".btn-save").classList.remove("visually-hidden"); 
//         discript.addEventListener('keyup', (e)=>{
//         console.log(e.key);
//             dataNew = `${dataNew}${e.key}`;
//             console.log(dataNew);
            
//         })  
          
//     }
//     popupCardInfo.querySelector(".btn-save").addEventListener('click', (e) => { 
//         e.target.classList.add("visually-hidden"); 
//         discript.disabled = true;
//     })
        

// })
  

// function saveInfo() {
//   const newInfo ={};

// }
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