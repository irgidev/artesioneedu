// Central export for all quiz data (BAB 8-12 only)
export { default as bab8Questions } from './bab-8-nonlinear.js';
export { default as bab9Questions } from './bab-9-ml-intro.js';
export { default as bab10Questions } from './bab-10-ml-lanjut.js';
export { default as bab11Questions } from './bab-11-shrinkage.js';
export { default as bab12Questions } from './bab-12-storytelling.js';
export { quizUAS, getUASQuestions } from './quiz-uas.js';

import { default as bab8Questions } from './bab-8-nonlinear.js';
import { default as bab9Questions } from './bab-9-ml-intro.js';
import { default as bab10Questions } from './bab-10-ml-lanjut.js';
import { default as bab11Questions } from './bab-11-shrinkage.js';
import { default as bab12Questions } from './bab-12-storytelling.js';

// Map chapter number to questions
export const chapterQuestionMap = {
  8: bab8Questions,
  9: bab9Questions,
  10: bab10Questions,
  11: bab11Questions,
  12: bab12Questions,
};

// Get questions for a specific chapter
export function getChapterQuestions(chapterNumber) {
  return chapterQuestionMap[chapterNumber] || [];
}
