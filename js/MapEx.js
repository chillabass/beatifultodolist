'use strict'

export default class MapEx extends Map {
    // Конструктор расширенного мапа, принимает массив объектов
    constructor(value) {
        super(value);
        this.onChange = null; // ссылка на метод события изменения массива задач
    }
    get(key) {
        return super.get(key);
    }
    set(key, value) {
        super.set(key, value);
        if (this.onChange) this.onChange(); // вызываем метод события изменения
    }
    delete(key) {
        super.delete(key);
        if (this.onChange) this.onChange();
    }
}