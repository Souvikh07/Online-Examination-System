/** Maps exam title to a CSS modifier for subject accent colors (display only). */
export function subjectClass(title) {
  const map = {
    mathematics: 'mathematics',
    science: 'science',
    english: 'english',
    history: 'history',
    'computer science': 'computer-science',
  };
  const key = (title || '').trim().toLowerCase();
  return map[key] ? `exam-card--${map[key]}` : 'exam-card--default';
}

const SUBJECT_ICONS = {
  mathematics: '∑',
  science: '⚗',
  english: '✎',
  history: '🏛',
  'computer science': '⌘',
};

export function subjectIcon(title) {
  const key = (title || '').trim().toLowerCase();
  return SUBJECT_ICONS[key] || '📋';
}
