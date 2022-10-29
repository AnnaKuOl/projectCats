class Popup {
    constructor(className){
        this._className = className;
        this.popup = document.querySelector(`.${className}`);
        this._closeEsc = this._closeEsc.bind(this);
    }
    _closeEsc(evt) {        
        if(evt.key === 'Escape') {
            this.close();
        }
    }
    open(){
        this.popup.classList.add('popup_active');
        document.addEventListener('keyup', this._closeEsc);
    }
    close(){
        this.popup.classList.remove('popup_active');
        document.removeEventListener('keyup', this._closeEsc);
    }
    setAddEventListener(){
        this.popup.addEventListener('click', (evt) => {           
            if(evt.target.classList.contains(this._className) || !!evt.target.closest('.popup__close-btn')){
               this.close();
            }
        })

    }
}