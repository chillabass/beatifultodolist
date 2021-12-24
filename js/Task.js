'use strict'

export default class Task {
    constructor(text, id, isDone = false) {
        if (text === '') throw new Error('Текст задания не может быть пустым!');
        this._text = text;      // Условие задачи
        this._id = id;          // Уникальный идентификатор задачи
<<<<<<< HEAD
        this._isDone = isDone;  // Выполнена ли задача
        this.onChange = null;   // событие при изменении поля
=======
        this._isDone = isDone;   // Выполнена ли задача
        this.onChange = null;
>>>>>>> 6dff784e35023b451f0c5fc4d8d5492fcf363a1e
    }
    get isDone() {
        return this._isDone;
    }
    set isDone(value) {
        this._isDone = value;
        if (this.onChange) this.onChange();
    }
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value;
        if (this.onChange) this.onChange();
    }
    get text() {
        return this._text;
    }
    set text(text) {
        if (text === '') throw new Error('Текст задания не может быть пустым!');
        this._text = text;
        if (this.onChange) this.onChange();
    }
    // Метод сериализации объекта задачи в JSON
    toJSON() {
        return {
            id: this._id,
            text: this._text,
            isDone: this._isDone,
        }
    }
}