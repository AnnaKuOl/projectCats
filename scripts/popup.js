class Popup {
    constructor(className){
        this.className = className;
        this.popup = document.querySelector(`.${className}`)
    }

    open(){
        this.popup.classList.add('popup_active');
    }
    close(){
        this.popup.classList.remove('popup_active');
    }
    setAddEventListener(){

    }
}