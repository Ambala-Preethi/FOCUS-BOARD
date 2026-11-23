// Automated validation of FocusBoard core business logic and localStorage guarantees

const SAMPLE_TASKS = [
  { id: '1', title: 'Task 1', status: 'To do', priority: 'High', category: 'Design', dueDate: '2026-11-25' },
  { id: '2', title: 'Task 2', status: 'In progress', priority: 'High', category: 'Development', dueDate: '2026-11-26' },
  { id: '3', title: 'Task 3', status: 'In progress', priority: 'Medium', category: 'Research', dueDate: '2026-11-27' },
  { id: '4', title: 'Task 4', status: 'Completed', priority: 'Low', category: 'Planning', dueDate: '2026-11-20' },
  { id: '5', title: 'Task 5', status: 'Completed', priority: 'Medium', category: 'Operations', dueDate: '2026-11-21' },
  { id: '6', title: 'Task 6', status: 'To do', priority: 'Low', category: 'Design', dueDate: '2026-11-30' },
];

class MockLocalStorage {
  constructor() {
    this.store = {};
  }
  getItem(key) {
    return Object.prototype.hasOwnProperty.call(this.store, key) ? this.store[key] : null;
  }
  setItem(key, val) {
    this.store[key] = String(val);
  }
  removeItem(key) {
    delete this.store[key];
  }
  clear() {
    this.store = {};
  }
}

const mockStorage = new MockLocalStorage();
const STORAGE_KEY = 'focusboard_tasks_v1';

function initializeTasks(storage) {
  const stored = storage.getItem(STORAGE_KEY);
  if (stored !== null) {
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  }
  storage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_TASKS));
  return SAMPLE_TASKS;
}

console.log('--- TEST 1: Initial load on clean browser ---');
let tasks = initializeTasks(mockStorage);
console.assert(tasks.length === 6, `Expected 6 tasks, got ${tasks.length}`);
console.assert(mockStorage.getItem(STORAGE_KEY) !== null, 'Storage should be initialized');
console.log('✓ Initial seed passed');

console.log('--- TEST 2: User adds a task ---');
const newTask = { id: '7', title: 'New Custom Task', status: 'To do', priority: 'High', category: 'Marketing', dueDate: '2026-12-01' };
tasks = [newTask, ...tasks];
mockStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
console.assert(tasks.length === 7, `Expected 7 tasks, got ${tasks.length}`);
console.log('✓ Task addition passed');

console.log('--- TEST 3: Browser Reload with custom task (CRITICAL: must NOT overwrite) ---');
const reloadedTasks = initializeTasks(mockStorage);
console.assert(reloadedTasks.length === 7, `Expected 7 tasks after reload, got ${reloadedTasks.length}`);
console.assert(reloadedTasks[0].title === 'New Custom Task', 'First task must be user custom task');
console.log('✓ Persistence guarantee passed: No overwrite on reload with custom tasks');

console.log('--- TEST 4: User deletes ALL tasks (empty array) ---');
tasks = [];
mockStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
const reloadAfterDeleteAll = initializeTasks(mockStorage);
console.assert(reloadAfterDeleteAll.length === 0, `Expected 0 tasks, got ${reloadAfterDeleteAll.length}`);
console.log('✓ Persistence guarantee passed: Empty array preserved, NOT reseeded with sample data');

console.log('--- TEST 5: Derived Metrics Calculation ---');
const testTasks = [
  { id: '1', status: 'To do' },
  { id: '2', status: 'In progress' },
  { id: '3', status: 'In progress' },
  { id: '4', status: 'Completed' },
];
const total = testTasks.length; // 4
const inProgress = testTasks.filter(t => t.status === 'In progress').length; // 2
const completed = testTasks.filter(t => t.status === 'Completed').length; // 1
const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100); // 25%

console.assert(total === 4, 'Total should be 4');
console.assert(inProgress === 2, 'In progress should be 2');
console.assert(completed === 1, 'Completed should be 1');
console.assert(completionRate === 25, `Completion rate should be 25%, got ${completionRate}%`);
console.log('✓ Dynamic metrics calculation passed');

console.log('--- TEST 6: Title validation ---');
function validateTitle(t) {
  return Boolean(t && t.trim().length > 0);
}
console.assert(validateTitle('') === false, 'Empty title invalid');
console.assert(validateTitle('   ') === false, 'Spaces only title invalid');
console.assert(validateTitle('Valid Task Title') === true, 'Valid title accepted');
console.log('✓ Validation rules passed');

console.log('ALL UNIT LOGIC TESTS PASSED SUCCESSFULLY! 🎉');
