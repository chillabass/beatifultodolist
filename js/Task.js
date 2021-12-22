'use strict'

export default class Task {
    constructor(text, id, isDone = false) {
        if (text === '') throw new Error('Текст задания не может быть пустым!');
        this._text = text;      // Условие задачи
        this._id = id;          // Уникальный идентификатор задачи
        this._isDone = isDone;   // Выполнена ли задача
    }
    get isDone() {
        return this._isDone;
    }
    set isDone(value) {
        this._isDone = value;
    }
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value;
    }
    get text() {
        return this._text;
    }
    set text(text) {
        if (text === '') throw new Error('Текст задания не может быть пустым!');
        this._text = text;
    }
    // Для сериализации объекта задачи в JSON
    toJSON() {
        return {
            id: this._id,
            text: this._text,
            isDone: this._isDone,
        }
    }
}