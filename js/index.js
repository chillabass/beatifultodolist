'use strict'
import Task from './Task.js';
import Mapex from './MapEx.js';

let tasksList = document.querySelector('.list__tasks');
let filters = document.querySelector('.list__buttons-filters');
let clearDone = document.querySelector('#clear_done');
let counter = document.querySelector('.list__buttons-count');
let taskInput = document.querySelector('#inputTask');
filters.filterType = 'filterAll';   // Тип фильтрации по умолчанию

// Коллекция объектов задач
let tasks = new Mapex();

// Инициализируем новую коллекцию задач
function initTasksMap(array) {
    let tasks = new Mapex();
    // Обработчик события изменения Map (добавление задачи и удаление задачи)
    tasks.onChange = () => {
        counter.textContent = `${tasks.size} ${declOfNum(tasks.size, ['задача', 'задачи', 'задач'])}`;
        if (Array.from(tasks).filter(item => item[1].isDone).length > 0) {
            clearDone.style.display = 'block';
        } else {
            clearDone.style.display = 'none';
        }
    };
    if (array) {
        array.forEach(item => {
            let task = new Task(item[1].text, item[1].id, item[1].isDone);
            /* Присваиваем каждой задаче обработчик, обновляющее количество задач и показывает/скрывают кнопку удаления задач,
             который будет вызываться при изменении любого поля у задачи */
            task.onChange = tasks.onChange;
            tasks.set(String(item[1].id), task);
        });
    }
    return tasks;
}

function showError(target, text, duration) {
    // Создаем div и внутри p для сообщения об ошибке
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
    }, duration);
}

// Добавление задачи
taskInput.addEventListener('keydown', function (event) {
    if (event.code === 'Enter' || event.code === 'NumpadEnter') {
        // Если поле в input пустое - выводим окошко с ошибкой
        if (taskInput.value === '') {
            showError(taskInput, 'Текст задания не может быть пустым!', 4000);
            return;
        }
        let id = Date.now();
        let labelText = taskInput.value;
        taskInput.value = '';
        tasksList.append(createTask(id, labelText));
        let task = new Task(labelText, id);
        task.onChange = tasks.onChange;
        tasks.set(String(id), task);
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
        filterElementList(null);
    });
    div.append(checkbox);

    // Создаем label для текста задания
    let label = document.createElement('label');
    label.textContent = text;
    label.title = 'Двойной клик - редактировать';
    label.classList.add('list__tasks-label');
    // По дабл-клику заменяем label на input, для изменения условия задачи
    label.addEventListener('dblclick', function (event) {
        let oldChild = div.children[1];
        let newChild = document.createElement('input');
        newChild.value = oldChild.textContent;
        newChild.classList.add('edit');
        checkbox.hidden = true;
        // По нажатию на Enter возвращаем все обратно
        newChild.addEventListener('keydown', function (event) {
            if (event.code !== 'Enter' && event.code !== 'NumpadEnter') return;
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
        filterElementList(value);
    }
});

// Удаляем выполненные задачи из коллекции и с интерфейса
clearDone.addEventListener('click', function () {
    tasks = initTasksMap(Array.from(tasks).filter(item => !item[1].isDone));
    filterElementList(null);
});

// Показываем крестик на задаче
tasksList.addEventListener('pointerover', function (event) {
    let target = event.target;
    target = target.closest('div');
    if (target.children.length > 0 && target.lastChild.tagName === 'BUTTON') {
        target.lastChild.hidden = false;
    }
});

// Скрываем крестик на задаче
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
    tasks = restoreData ? initTasksMap(Array.from(Object.entries(JSON.parse(restoreData)))) : initTasksMap(null);
    tasks.forEach(element => {
        tasksList.append(createTask(element.id, element.text, element.isDone));
    });
});

// Перед уходом со страницы сохраняем задачи в локальное хранилище
window.addEventListener('beforeunload', function () {
    let obj = Object.fromEntries(tasks);
    let saveData = JSON.stringify(obj);
    localStorage.setItem('tasks', saveData);
});