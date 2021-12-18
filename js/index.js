'use strict'
import Task from './Task.js'

let tasksContainer = document.getElementById('tasks_container');
let tasksList = document.querySelector('.list__tasks');

// Массив объектов задач
let tasks = [];

// Добавление задачи
tasksContainer.addEventListener('keydown', function(event) {
    if ((event.code === 'Enter' || event.code === 'NumpadEnter') && event.target.tagName === 'INPUT') {
        // Создаем пустой div
        let div = document.createElement('div');
        div.classList.add('list__tasks-wrapper');
        // Создаем checkbox
        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('checkbox');
        checkbox.addEventListener('change', () => {
            div.classList.toggle('completed');
        });
        div.append(checkbox);
        // Создаем label для текста задания и получаем текст из input
        let input = document.querySelector('#inputTask');
        let label = document.createElement('label');
        label.textContent = input.value;
        input.value = '';
        label.classList.add('list__tasks-label');
        div.append(label);
        // Создаем кнопку закрытия
        let button = document.createElement('button');
        button.classList.add('task__close');
        button.hidden = true;
        button.addEventListener('click', () => {
            button.parentElement.remove();
            tasks.pop(div);
        });
        div.append(button);
        // Добавляем div в список задач
        tasksList.append(div);
        // Добавляем задачу в массив
        tasks.push(div);
        console.log(tasks)
    }
});

tasksList.addEventListener('pointerover', function(event) {
    let target = event.target;
    target = target.closest('div');
    let index = target.children.length - 1;
    if (target.children.length > 0 && target.children[index].tagName === 'BUTTON') {
        target.children[target.children.length - 1].hidden = false;
    }
});

tasksList.addEventListener('pointerout', function(event) {
    let target = event.target;
    target = target.closest('div');
    let index = target.children.length - 1;
    if (target.children.length > 0 && target.children[index].tagName === 'BUTTON') {
        target.children[target.children.length - 1].hidden = true;
    }
});

