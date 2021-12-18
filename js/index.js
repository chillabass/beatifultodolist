'use strict'
import Task from './Task.js';

let tasksContainer = document.getElementById('tasks_container');
let tasksList = document.querySelector('.list__tasks');

// Массив объектов задач
let tasks = new Map();

function showError(text, x, y, duration) {
    let d = document.querySelector('.error__window');
    let className = 'error__window-anim';
    d.style.cssText = `top: ${y}px; left: ${x}px`;
    d.firstChild.textContent = text;
    d.classList.add(className);
    setTimeout(() => {
        d.classList.remove(className);
    }, duration);
}

// Добавление задачи
tasksContainer.addEventListener('keydown', function(event) {
    if ((event.code === 'Enter' || event.code === 'NumpadEnter') && event.target.tagName === 'INPUT') {
        let input = document.querySelector('#inputTask');
        // Если поле в иnput пустое - выводим окошко с ошибкой
        if (input.value === '') {
            let size = input.getBoundingClientRect();
            let x = size.left + size.width;
            let y = size.top;
            showError('Текст задания не может быть пустым!', x, y, 4000);
            return;
        }
        let id = Date.now();
        let labelText = input.value;
        input.value = '';
        // Добавляем div в список задач
        tasksList.append(createTask(id, labelText));
        // Добавляем задачу в массив
        let task = new Task(labelText, id);
        // console.log(task)
        tasks.set(id, task);
        // console.log(task)
    }
});

function createTask(id, text, isDone = false) {
    // Создаем пустой div
    let div = document.createElement('div');
    div.classList.add('list__tasks-wrapper');
    div.dataset.id = id;

    // Создаем checkbox
    let checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = isDone;
    if (isDone) div.classList.toggle('completed');
    checkbox.classList.add('checkbox');
    checkbox.addEventListener('change', () => {
        div.classList.toggle('completed');
        tasks.get(div.dataset.id).isDone = checkbox.checked;
    });
    div.append(checkbox);

    // Создаем label для текста задания
    let label = document.createElement('label');
    label.textContent = text;
    label.classList.add('list__tasks-label');
    div.append(label);

    // Создаем кнопку удаления
    let button = document.createElement('button');
    button.classList.add('task__close');
    button.hidden = true;
    button.addEventListener('click', () => {
        button.parentElement.remove();
        tasks.delete(String(id));
    });
    div.append(button);
    return div;
}


tasksList.addEventListener('pointerover', function(event) {
    let target = event.target;
    target = target.closest('div');
    // let index = target.children.length - 1;
    if (target.children.length > 0 && target.lastChild.tagName === 'BUTTON') {
        target.lastChild.hidden = false;
    }
});

tasksList.addEventListener('pointerout', function(event) {
    let target = event.target;
    target = target.closest('div');
    // let index = target.children.length - 1;
    if (target.children.length > 0 && target.lastChild.tagName === 'BUTTON') {
        target.lastChild.hidden = true;
    }
});

document.addEventListener('DOMContentLoaded', function() {
    let restoreData = localStorage.getItem('tasks');
    tasks = new Map(Object.entries(JSON.parse(restoreData)));
    console.log(tasks);
    tasks.forEach(element => {
        console.log(element);
        // console.log(element.text);
        // console.log(element.isDone);
        tasksList.append(createTask(element.id, element.text, element.isDone));
    });
});

window.addEventListener('beforeunload', function() {
    let saveData = JSON.stringify(Object.fromEntries(tasks));
    // debugger
    localStorage.setItem('tasks', saveData);
});

