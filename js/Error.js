'use strict'

export default class Error {
    constructor(target) {
        if (!Error._instance) {
            this._isShowed = false;
            Error._instance = this;
        }
        return Error._instance;
    }
    showError(target, text, duration) {
        if (!this._isShowed) {
            this._isShowed = true;
            let errorObj = document.createElement('div');
            let p = document.createElement('p');
            errorObj.append(p);
            errorObj.classList.add('error__window');

            // Устанавливаем необходимые стили
            let size = target.getBoundingClientRect();
            let x = size.left + size.width;
            let y = size.top;
            errorObj.style.cssText = `top: ${y}px; left: ${x}px`;
            errorObj.firstChild.textContent = text;
            let className = 'error__window-anim';
            errorObj.classList.add(className);
            document.querySelector('.container').append(errorObj);
            
            // Через определенное количество времени удаляем ошибку
            setTimeout(() => {
                errorObj.remove();
                this._isShowed = false;
            }, duration);
        }
    }
}