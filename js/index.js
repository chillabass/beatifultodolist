'use strict'
import Task from './Task.js';

let tasksContainer = document.getElementById('tasks_container');
let tasksList = document.querySelector('.list__tasks');
let filters = document.querySelector('.list__buttons-filters');
let clearDone = document.querySelector('#clear_done');
let counter = document.querySelector('.list__buttons-count');
let taskInput = document.querySelector('#inputTask');
filters.filterType = 'filterAll';   // Тип фильтрации по умолчанию

// Массив объектов задач
let tasks = new Map();

function showError(target, text, duration) {
    let errorObj = document.querySelector('.error__window');
    let className = 'error__window-anim';
    let size = target.getBoundingClientRect();
    let x = size.left + size.width;
    let y = size.top;
    errorObj.style.cssText = `top: ${y}px; left: ${x}px`;
    errorObj.firstChild.textContent = text;
    errorObj.classList.add(className);
    setTimeout(() => {
        errorObj.classList.remove(className);
    }, duration);
}

// Добавление задачи
taskInput.addEventListener('keydown', function (event) {
    if ((event.code === 'Enter' || event.code === 'NumpadEnter') && event.target.tagName === 'INPUT') {
        // Если поле в иnput пустое - выводим окошко с ошибкой
        if (taskInput.value === '') {
            showError(taskInput, 'Текст задания не может быть пустым!', 4000);
            return;
        }
        let id = Date.now();
        let labelText = taskInput.value;
        taskInput.value = '';
        // Добавляем div в список задач
        tasksList.append(createTask(id, labelText));
        // Добавляем задачу в массив
        let task = new Task(labelText, id);
        tasks.set(String(id), task);
        tasks.onChange();
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
        tasks.onChange();
        filterElementList(null);
    });
    div.append(checkbox);

    // Создаем label для текста задания
    let label = document.createElement('label');
    label.textContent = text;
    label.title = 'Двойной клик - редактировать';
    label.classList.add('list__tasks-label');
    label.addEventListener('dblclick', function (event) {
        let oldChild = div.children[1];
        let newChild = document.createElement('input');
        newChild.value = oldChild.textContent;
        newChild.classList.add('edit');
        checkbox.hidden = true;
        newChild.addEventListener('keydown', function(event) {
            if (event.type !== 'blur' && event.code !== 'Enter' && event.code !== 'NumpadEnter') return;
            if (newChild.value === '') {
                showError(newChild, 'Текст задания не может быть пустым!', 4000);
                return;
            }
            oldChild.textContent = newChild.value;
            tasks.get(String(id)).text = newChild.value;
            div.replaceChild(oldChild, newChild);
            checkbox.hidden = false;
        });
        div.replaceChild(newChild, oldChild);
        newChild.focus();
    });
    div.append(label);

    // Создаем кнопку удаления
    let button = document.createElement('button');
    button.classList.add('task__close');
    button.hidden = true;
    button.addEventListener('click', () => {
        button.parentElement.remove();
        tasks.delete(String(id));
        tasks.onChange();
    });
    div.append(button);
    return div;
}

function filterElementList(type) {
    // Если вызываем фильтрацию из метода checkbox'а
    if (type == null) {
        type = filters.filterType;  // то фильтруем по последнему использованному типу
    }
    let arr = Array.from(tasks);
    tasksList.innerHTML = '';
    switch (type) {
        case 'filterDone':
            arr.filter(item => item[1].isDone === true).forEach(item => tasksList.append(createTask(item[1].id, item[1].text, item[1].isDone)));
            break;
        case 'filterWork':
            arr.filter(item => item[1].isDone === false).forEach(item => tasksList.append(createTask(item[1].id, item[1].text, item[1].isDone)));
            break;
        case 'filterAll':
        default:
            arr.forEach(item => tasksList.append(createTask(item[1].id, item[1].text, item[1].isDone)));
            break;
    }
}

filters.addEventListener('click', function (event) {
    let className = 'filter-selected';
    let target = event.target;
    if (target.tagName === 'LABEL') {
        let selectedFilter = document.querySelector(`.${className}`);
        target.classList.toggle(className);
        selectedFilter.classList.toggle(className);
        let value = target.id;
        filters.filterType = value;
        console.log(value)
        filterElementList(value);
    }
});

clearDone.addEventListener('click', function () {
    tasks = new Map(Array.from(tasks).filter(item => !item[1].isDone));
    filterElementList(null);
    tasks.onChange = () => {
        counter.textContent = `${tasks.size} ${declOfNum(tasks.size, ['задача', 'задачи', 'задач'])}`;
        if (Array.from(tasks).filter(item => item[1].isDone).length > 0) {
            clearDone.style.display = 'block';
        } else {
            clearDone.style.display = 'none';
        }
    }
    tasks.onChange();
});

tasksList.addEventListener('pointerover', function (event) {
    let target = event.target;
    target = target.closest('div');
    // let index = target.children.length - 1;
    if (target.children.length > 0 && target.lastChild.tagName === 'BUTTON') {
        target.lastChild.hidden = false;
    }
});

tasksList.addEventListener('pointerout', function (event) {
    let target = event.target;
    target = target.closest('div');
    if (target.children.length > 0 && target.lastChild.tagName === 'BUTTON') {
        target.lastChild.hidden = true;
    }
});

// Возвращает правильное окончание взависимости от числа
function declOfNum(n, textForms) {
    n = Math.abs(n) % 100;
    let n1 = n % 10;
    if (n > 10 && n < 20) { return textForms[2]; }
    if (n1 > 1 && n1 < 5) { return textForms[1]; }
    if (n1 == 1) { return textForms[0]; }
    return textForms[2];
}

// После построения ДОМ-дерева читаем из локального хранилища данные о задачах
document.addEventListener('DOMContentLoaded', function () {
    let restoreData = localStorage.getItem('tasks');
    tasks = new Map(Object.entries(JSON.parse(restoreData)));
    tasks.onChange = () => {
        counter.textContent = `${tasks.size} ${declOfNum(tasks.size, ['задача', 'задачи', 'задач'])}`;
        if (Array.from(tasks).filter(item => item[1].isDone).length > 0) {
            clearDone.style.display = 'block';
        } else {
            clearDone.style.display = 'none';
        }
    }
    tasks.onChange();
    console.log(tasks);
    tasks.forEach(element => {
        console.log(element);
        tasksList.append(createTask(element.id, element.text, element.isDone));
    });
});

// Перед уходом со страницы сохраняем задачи в локальное хранилище
window.addEventListener('beforeunload', function () {
    let saveData = JSON.stringify(Object.fromEntries(tasks));
    localStorage.setItem('tasks', saveData);
});

