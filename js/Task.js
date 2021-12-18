'use strict'

export default class Task {
    constructor(text) {
        if (text === '') throw new Error('Текст задания не может быть пустым!');
        this._text = text;
        this._isDone = false;
    }
    get isDone() {
        return this._isDone;
    }
    set isDone(value) {
        this._isDone = value;
    }
    get text() {
        return this._text;
    }
    set text(text) {
        if (text === '') throw new Error('Текст задания не может быть пустым!');
        this._text = text;
    }
}