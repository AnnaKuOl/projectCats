const cardsBox = document.querySelector(".cards");
const btnAddCat = document.querySelector("#add");
const btnLogin = document.querySelector("#login");
const formLogin = document.querySelector("#form__login");
const formNewCat = document.querySelector("#form__add-new-cat");
const popupCardInfo = document.querySelector(".popup__cat-info");

const api = new Api(CONFIG_API);
const LIVE_LOCAL_STORAGE = 60; //время жизни локального хранилища

/* функция получения объекта с данными из формы*/
function serializeForm(elements) {
  const dataForm = {};
  elements.forEach((elem) => {
    if (elem.type === "submit") {
        return;
    //   if(elem.classList.contains('card__like')){
    //     dataForm[elem.name] = true; 
    //     console.log(elem.name, elem.value)       
      }else {
        dataForm[elem.name] = false;
      }

    
    if (elem.type !== "checkbox") {
      dataForm[elem.name] = elem.value;
    }
    if (elem.type === "checkbox") {
      dataForm[elem.name] = elem.checked;
    }
  });
  console.log(dataForm )
  return dataForm;
}
/*функция открытия карточки по нажатию на кнопку */
function openCatInfo(card) {
  const cardLink = card.querySelector(".card__link");
  cardLink.addEventListener("click", (e) => {
    e.preventDefault();
    const id = e.target.closest(".card__link").querySelector(".card__id");
    getCatInfo(id.textContent);
  });
}



/*ф-ция дезактивации ссылки */
function removeDisable(selector){
    const allCardLink = selector.querySelectorAll('.card__link');
    allCardLink.forEach((link)=>{
    link.classList.remove('disabled')
  });
}

/* наполнение карточками секции*/
function createCat(data) {
  const card = new Card(data, "#card-template"); //создание экземпляра класса карточки
  const newCardEl = card.getElement(); // вызов метода по наполнению карточкой информацией  из БД
  openCatInfo(newCardEl); // вещаю событие для отрытия подробной информации по клику на имя кота

  cardsBox.append(newCardEl); //добавляю карточку в секцию
 
  const allCardLink = cardsBox.querySelectorAll('.card__link');
    allCardLink.forEach((link)=>{
    link.classList.add('disabled')
  });
}
/* функция для авторизации */
function loginFromForm(e) {
  e.preventDefault();
  const dataFromForm = [...formLogin.elements]; //получение элементов формы авторизации
  const dataLogin = serializeForm(dataFromForm); //получаем данные из формы
  Cookies.set("email", `${dataLogin.email}`); // вносим данные из формы в куки
  popupLogin.close();
  btnAddCat.classList.remove("visually-hidden"); //открывает кнопку добавления котиков
  removeDisable(cardsBox);
  
}
/* функция создания новой карточки и отправки данных в хранилища*/
function addNewCatFromForm(e) {
  e.preventDefault();
  const dataFromForm = [...formNewCat.elements]; //получение элементов формы добавлния котика
  const dataNewCat = serializeForm(dataFromForm); //получаем данные из формы

  api.addNewCat(dataNewCat) // отправляем данные на сервер
    .then(() => {
      createCat(dataNewCat); //создаем новую карточку в секции с новыми данными
      popupNewCat.close();  // закрываем попап добавления котика
      removeDisable(cardsBox);
    
      const cats = JSON.parse(localStorage.getItem("cats")); //получаем данный из локального хранилища
      cats.push(dataNewCat); //добавляем туда информацию о новм коте

      localStorage.setItem("cats", JSON.stringify(cats)); //отправляем обновленныу информацию на локальное хранилище
      setDataRefresh(LIVE_LOCAL_STORAGE); //устаналиваем новую дату жизни локального храниища
    });
}
/*функция установки времени жизни локального хранилища */
function setDataRefresh(min) {
  const setTime = new Date(new Date().getTime() + min * 60000); //получаем дату просрочки локального хранилища
  localStorage.setItem("catsRefresh", setTime); //добавляем эту информацию в локальне хранилище
  return setTime;
}

/* функция проверки нужно ли создавать карточку кота из локального хранилища или из БД и обновить локальное хранилище */
function checkLocalStorage() {
  const dataLocal = JSON.parse(localStorage.getItem("cats"));
  const getTimeEnd = localStorage.getItem("catsRefresh");

  if (dataLocal && dataLocal.length && new Date() < new Date(getTimeEnd)) {
    dataLocal.forEach(function (catInfo) {
      createCat(catInfo);
    });
  } else {
    api.getAllCats().then(({ data }) => {
      data.forEach(function (catInfo) {
        createCat(catInfo);
      });
      
      localStorage.setItem("cats", JSON.stringify(data));
      setDataRefresh(LIVE_LOCAL_STORAGE);
      removeDisable(cardsBox);
    });
  }
}
checkLocalStorage();
/* функция создания карточки с подробной информацией о коте в попапе */
function createCatInfoCard(data) {
  if (!!popupCardInfo.children.length) {
    //проверка была ли уже создана каточка в попапе и очистка попапа если карточка была
    popupCardInfo.innerHTML = "";
  }
  const newCardInfo = new CardInfo(data, "#info-template"); //создаем экземпляр карточки подробной информации
  const newCard = newCardInfo.getElement(); //добавляем туда информацию

  popupCardInfo.append(newCard); //добавляем карточку в попап
  popupCatInfo.open(); //открываем попап с получившейся карточкой
}

/*Получение данных о коте по id из БД или локального хранилища и создание на их осноекарточки */
function getCatInfo(id) {
  const dataLocal = JSON.parse(localStorage.getItem("cats"));
  const getTimeEnd = localStorage.getItem("catsRefresh");

  if (dataLocal && dataLocal.length && new Date() < new Date(getTimeEnd)) {
    //создание карточки из локального храниища если дата жизни не прошла
    dataLocal.forEach((elem) => {
      if (elem.id == id) {
        createCatInfoCard(elem);
       
      }
    });
  } else {
    //создание карточки из БД
    api.getCatById(id).then(({ data }) => {
      const dataInfo = data;
      createCatInfoCard(dataInfo);
     
    });
  }
}

/* С этой функцией хочу поработать, перенести ее действия в класс или в отдельные функции */
popupCardInfo.addEventListener("click", (e) => {
  e.preventDefault();
  const discript = popupCardInfo.querySelector(".form__cat-description");
  const age = popupCardInfo.querySelector(".form__input-cat-age");
  const like = popupCardInfo.querySelector(".form__cat-like");
  const btnSave = popupCardInfo.querySelector(".btn-save");
  const btnChange = popupCardInfo.querySelector(".btn-change");

  if (e.target.classList.contains("btn-delete") || e.target.closest(".fa-trash")) {
    let answer = confirm ('Вы уверены, что хотите удалить кота???');
      if(answer){
        const idCard = popupCardInfo.querySelector(".form__input-cat-id").value;
    { api.deleteCatById(idCard).then(() => {
        localStorage.removeItem("cats");
        location.reload();
      });
    
    }
  } else{
    popupCatInfo.close();
  }
      }

  
    
  if (
    e.target.classList.contains("card__like") ||
    e.target.closest(".fa-heart")
  ) {
    like.classList.toggle("card__like-active");
  }

  if (
    e.target.classList.contains("btn-change") ||
    e.target.closest(".fa-pen-to-square")
  ) {
    discript.toggleAttribute("disabled");
    like.toggleAttribute("disabled");
    age.classList.add("focus");
    discript.classList.add("focus");
    age.toggleAttribute("disabled");
    
    btnSave.classList.toggle("unvisible");
    btnChange.classList.toggle("unvisible");
  
  }

  if (
    e.target.classList.contains("btn-save") ||
    e.target.closest(".fa-download")
  ) {
    discript.toggleAttribute("disabled");
    age.toggleAttribute("disabled");
    like.toggleAttribute("disabled");
    age.classList.remove("focus");
    discript.classList.remove("focus");
    btnSave.classList.toggle("unvisible");
    btnChange.classList.toggle("unvisible");
  
    const formAboutCat = document.querySelector(".popup__form-cat-info");
    const CatInfo = [...formAboutCat.elements];
    const newCatInfo = serializeForm(CatInfo);    
    const idCard = newCatInfo.id;
    if (like.classList.contains("card__like-active")){
        newCatInfo.favourite = true;        
    }else {        
        newCatInfo.favourite = false;
    }
    console.log(newCatInfo);
    api.updateCatById(idCard, newCatInfo).then(() => {
      const dataLocalCats = JSON.parse(localStorage.getItem("cats"));
      const newDataLocal = dataLocalCats.map((localInfo) => {
        if (localInfo.id == idCard) {
          localInfo = { ...localInfo, ...newCatInfo };

          return localInfo;
        } else {
          return localInfo;
        }
      }, []);

      localStorage.setItem("cats", JSON.stringify(newDataLocal));
      setDataRefresh(LIVE_LOCAL_STORAGE);
    });
  }
});

const popupNewCat = new Popup("popup-add-cat");
const popupLogin = new Popup("popup-login");
const popupCatInfo = new Popup("popup__cat-info");

btnAddCat.addEventListener("click", () => popupNewCat.open()); // вешаем событие клик на кнопку Добавить кота => открытие попапа с инфой
btnLogin.addEventListener("click", () => popupLogin.open()); // вешаем событие клик открытия окна авторизации
formNewCat.addEventListener("submit", addNewCatFromForm); // событие получения данных формы и создание новой карточки кота по нажатию кнопки в попапе добавления кота
formLogin.addEventListener("submit", loginFromForm); // событие получения данных формы авторизации и открытие возможностей для авторизованного пользователя

popupNewCat.setAddEventListener(); //включаем возможности закрытия попапа по нажатия на крестик и вне поля попапа
popupLogin.setAddEventListener(); //включаем возможности закрытия попапа по нажатия на крестик и вне поля попапа
popupCatInfo.setAddEventListener(); //включаем возможности закрытия попапа по нажатия на крестик и вне поля попапа

/* Проверка авторизован ли пользователь */
const isLogin = Cookies.get("email");
if (!isLogin) {
   
  popupLogin.open();
} else {
  btnAddCat.classList.remove("visually-hidden");
  removeDisable(cardsBox);

}
