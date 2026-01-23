
// src/utils/storage.js
// import { supabase } from './supabaseClient';

// === НАСТРОЙКИ ===
export const STORAGE_PREFIX = "opredelenie_"; // просто поменяешь здесь для нового проекта
const USE_SUPABASE = false;

// === ЛОКАЛЬНАЯ РЕАЛИЗАЦИЯ ===
const localStorageImpl = {
  // --- Очистить всё, что относится к этому приложению ---
  clearAllAnswers: () => {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  },

  // --- Сохранение и получение введённых пользователем данных ---
  saveUserInputs: (taskId, inputs) => {
    localStorage.setItem(`${STORAGE_PREFIX}task_inputs_${taskId}`, JSON.stringify(inputs));
  },

  getUserInputs: (taskId) => {
    const stored = localStorage.getItem(`${STORAGE_PREFIX}task_inputs_${taskId}`);
    return stored ? JSON.parse(stored) : [];
  },

  // --- Сохранение и получение правильных ответов (индексов) ---
  saveCorrectInputs: (taskId, indexes) => {
    localStorage.setItem(`${STORAGE_PREFIX}correct_inputs_${taskId}`, JSON.stringify(indexes));
  },

  getCorrectInputs: (taskId) => {
    const stored = localStorage.getItem(`${STORAGE_PREFIX}correct_inputs_${taskId}`);
    return stored ? JSON.parse(stored) : [];
  },

  // --- Получить все правильные ответы (для прогресса) ---
  getAllCorrectInputs: () => {
    return Object.keys(localStorage).filter((key) =>
      key.startsWith(`${STORAGE_PREFIX}correct_inputs_`)
    );
  },

  // --- Очистить данные по конкретной задаче ---
  clearTaskProgress: (taskId, totalInputs) => {
    // удаляем введённые пользователем ответы
    localStorage.removeItem(`${STORAGE_PREFIX}task_inputs_${taskId}`);

    // удаляем индексы правильных ответов (новая система)
    localStorage.removeItem(`${STORAGE_PREFIX}correct_inputs_${taskId}`);

    // удаляем старые ключи, если вдруг они остались от старых версий
    for (let i = 0; i < totalInputs; i++) {
      localStorage.removeItem(`${STORAGE_PREFIX}input_correct_${taskId}_${i}`);
    }
  },

  // --- Очистить данные по списку задач ---
  clearAnswersByIds: (ids, tasks = []) => {
    ids.forEach((id) => {
      const task = tasks.find((t) => t.id === id);
      const totalInputs = task ? task.answers.length : 10; // запасной вариант
      localStorageImpl.clearTaskProgress(id, totalInputs);
    });
  },
};

// === (Опционально) Реализация через Supabase ===
const supabaseImpl = {
  // оставляем на будущее, если будет нужно
};

// === ВЫБОР ХРАНИЛИЩА ===
const storage = USE_SUPABASE ? supabaseImpl : localStorageImpl;

// === ЭКСПОРТЫ ===
export const clearAllAnswers = () => storage.clearAllAnswers();
export const saveUserInputs = (id, inputs) => storage.saveUserInputs(id, inputs);
export const getUserInputs = (id) => storage.getUserInputs(id);
export const saveCorrectInputs = (id, indexes) => storage.saveCorrectInputs(id, indexes);
export const getCorrectInputs = (id) => storage.getCorrectInputs(id);
export const getAllCorrectInputs = () => storage.getAllCorrectInputs();
export const clearTaskProgress = (id, totalInputs) => storage.clearTaskProgress(id, totalInputs);
export const clearAnswersByIds = (ids, tasks) => storage.clearAnswersByIds(ids, tasks);
