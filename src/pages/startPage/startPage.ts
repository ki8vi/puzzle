import './startPage.css';
import { createElement } from '../../helpers/createElement';

import { getLocalStorage } from '../../store/store';

export const startPage = createElement('section', 'start-page');

const descriptionText: string =
    '"English Puzzle Game" is an engaging game where each word is a puzzle piece. By assembling words into sentences in the correct order, you not only complete a beautiful picture but also enhance your English language skills. The game features multiple levels, each with several rounds to challenge your linguistic prowess.In case of difficulties, you can utilize hints to help you progress. Once you’ve fully assembled the picture, you can view your game statistics to track your improvement. This game offers a fun and interactive way to learn and practice English while enjoying the satisfaction of solving puzzles. Enjoy the journey of language learning with this game!';
const startWrapper = createElement('div', 'start-wrapper');
const title = createElement('h1', 'start-title', null, null, 'English puzzle game');
const description = createElement('p', 'start-description', null, null, descriptionText);
export const startBtn = createElement('button', 'btn', null, null, 'Start');
const greetingsStr: string =
    `Hello, ${getLocalStorage() ? getLocalStorage().name : ''} ${getLocalStorage() ? getLocalStorage().surname : ''} glad to see you!` ||
    '';
const greetUser = createElement('h2', 'greeting', null, null, greetingsStr) || null;

startPage.append(title, greetUser, startWrapper, startBtn);
startWrapper.append(description);
