import './loginPage.css';
import { createElement } from '../../helpers/createElement';
import { regexChecker } from '../../helpers/regexCheckerValidation';
import { getLocalStorage, saveToLocalStorage } from '../../store/store';
import classSwitcher from '../../helpers/classSwitcher';
import { startPage } from '../startPage/startPage';
import elementAppender from '../../helpers/elementAppender';
import { addClassTimeout } from '../gamePage/gamePageHelpers';

type Input = HTMLInputElement;
type Label = HTMLLabelElement;
type Form = HTMLFormElement;

const loginForm = createElement('form', 'login-form') as Form;
const inputName = createElement('input', 'input-login', ['autofocus'], ['true'], null, 'name') as Input;
const labelName = createElement('label', 'input-labels', ['for'], ['name'], 'Name') as Label;
const inputSurname = createElement('input', 'input-login', null, null, null, 'surname') as Input;
const labelSurname = createElement('label', 'input-labels', ['for'], ['surname'], 'Surname') as Label;
export const btnSubmit = createElement('button', 'btn', null, null, 'Login');
const inputsArr: Array<Input> = [inputName, inputSurname];
const noticeName: string = 'Min 3 english characters, can include "-", first letter should be uppercased';
const noticeSurname: string = 'Min 4 english characters, can include "-", first letter should be uppercased';
const invalidNoticeName = createElement('div', 'input-notice', null, null, noticeName);
const invalidNoticeSurname = createElement('div', 'input-notice', null, null, noticeSurname);
export const logoutBtn = createElement('button', 'btn logout-btn', null, null, 'Logout');
export const main = createElement('main', 'main');
let isNameValid = false;
let isSurnameValid = false;

function desableElement(): void {
    if (inputName.value !== '' && isNameValid && inputSurname.value !== '' && isSurnameValid) {
        btnSubmit.classList.remove('btn-disabled');
    } else {
        btnSubmit.classList.add('btn-disabled');
    }
}

desableElement();

function validation(e: Event): void {
    const event = e.target as Input;
    const regexName: RegExp = /^[A-Z][a-zA-Z-]{2,}$/;
    const regexSurname: RegExp = /^[A-Z][a-zA-Z-]{3,}$/;

    if (event.id === 'name') {
        if (regexChecker(event.value, regexName)) {
            isNameValid = true;
            classSwitcher(event, 'input-valid', true);
            classSwitcher(event, 'input-invalid', false);
            classSwitcher(invalidNoticeName, 'input-notice-active', false);
        } else {
            isNameValid = false;
            classSwitcher(event, 'input-invalid', true);
            classSwitcher(event, 'input-valid', false);
            classSwitcher(invalidNoticeName, 'input-notice-active', true);
        }
    }
    if (event.id === 'surname') {
        if (regexChecker(event.value, regexSurname)) {
            isSurnameValid = true;
            classSwitcher(event, 'input-valid', true);
            classSwitcher(event, 'input-invalid', false);
            classSwitcher(invalidNoticeSurname, 'input-notice-active', false);
        } else {
            isSurnameValid = false;
            classSwitcher(event, 'input-invalid', true);
            classSwitcher(event, 'input-valid', false);
            classSwitcher(invalidNoticeSurname, 'input-notice-active', true);
        }
    }
    desableElement();
}

for (let i = 0; i < inputsArr.length; i += 1) {
    inputsArr[i].autocomplete = 'off';
    inputsArr[i].type = 'text';
    inputsArr[i].required = true;
    inputsArr[i].addEventListener('input', validation);
}

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (isNameValid && isSurnameValid) {
        const user = {
            name: inputName.value,
            surname: inputSurname.value,
            stat: {
                1: [],
                2: [],
                3: [],
                4: [],
                5: [],
                6: [],
            },
            level: [],
            passedRound: 0,
            passedLevel: 1,
        };
        saveToLocalStorage(user);
        classSwitcher(logoutBtn, 'logout-btn-active', true);
        elementAppender(main, [startPage, logoutBtn]);
        const greetingsStr: string = `Hello, ${getLocalStorage().name} ${getLocalStorage().surname} glad to see you!`;
        let greetUser = startPage.querySelector('.greeting');
        if (greetUser) {
            greetUser.textContent = greetingsStr;
        } else {
            greetUser = createElement('h2', 'greeting', null, null, greetingsStr);
            startPage.insertBefore(greetUser, startPage.children[1]);
        }
        addClassTimeout(startPage, 'loader-disabled', 100);
    }
});

loginForm.append(labelName, inputName, invalidNoticeName, labelSurname, inputSurname, invalidNoticeSurname, btnSubmit);

export const form: Form = loginForm;

logoutBtn.addEventListener('click', () => {
    elementAppender(main, [form]);
    inputName.value = '';
    inputName.focus();
    inputSurname.value = '';
    localStorage.clear();
    classSwitcher(inputName, 'input-valid', false);
    classSwitcher(inputSurname, 'input-valid', false);
    classSwitcher(btnSubmit, 'btn-disabled', true);
});
