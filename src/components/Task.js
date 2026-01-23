

// // export default Task;
// import React, { useEffect, useState } from 'react';
// import {
//   saveUserInputs,
//   getUserInputs,
//   saveCorrectInputs,
//   getCorrectInputs,
// } from '../utils/storage';
// import '../styles/taskItem.css';

// function Task({ task }) {
//   const [inputs, setInputs] = useState([]);
//   const [checked, setChecked] = useState(false);
//   const [correctInputs, setCorrectInputs] = useState([]);
//   const [shuffledAnswers, setShuffledAnswers] = useState([]);

//   // === Новые состояния ===
//   const [attempts, setAttempts] = useState([]); // попытки по каждому полю
//   const [locked, setLocked] = useState([]);     // заблокировано ли поле

//   const placeholders = task.exercise.split('|_|');
//   const correctAnswers = task.answers;

//   // === Перемешивание массива ===
//   const shuffleArray = (array) => {
//     const arr = [...array];
//     for (let i = arr.length - 1; i > 0; i--) {
//       const j = Math.floor(Math.random() * (i + 1));
//       [arr[i], arr[j]] = [arr[j], arr[i]];
//     }
//     return arr;
//   };

//   useEffect(() => {
//     const preventDefault = (e) => e.preventDefault();
//     document.addEventListener('dragstart', preventDefault);
//     document.addEventListener('drop', preventDefault);

//     const savedInputs = getUserInputs(task.id);
//     const savedCorrectIndexes = getCorrectInputs(task.id);

//     setShuffledAnswers(shuffleArray(correctAnswers));

//     const len = correctAnswers.length;

//     setInputs(savedInputs.length === len ? savedInputs : Array(len).fill(''));
//     setCorrectInputs(savedCorrectIndexes);
//     setChecked(savedCorrectIndexes.length > 0);

//     // инициализируем попытки и блокировки
//     setAttempts(Array(len).fill(0));
//     setLocked(Array(len).fill(false));

//     return () => {
//       document.removeEventListener('dragstart', preventDefault);
//       document.removeEventListener('drop', preventDefault);
//     };
//   }, [task]);

//   const handleChange = (index, value) => {
//     if (locked[index]) return; // нельзя вводить, если заблокировано
//     const updated = [...inputs];
//     updated[index] = value;
//     setInputs(updated);
//     saveUserInputs(task.id, updated);
//   };

//   // === Проверка ===
//   const handleCheck = () => {
//     const newCorrect = [];
//     const newAttempts = [...attempts];
//     const newLocked = [...locked];

//     inputs.forEach((input, i) => {
//       const correct =
//         input.trim().toLowerCase() === correctAnswers[i].trim().toLowerCase();

//       if (correct) {
//         newCorrect.push(i);
//       } else {
//         // --- важное правило: пустая строка не считается попыткой ---
//         if (input.trim() !== '' && !locked[i]) {
//           newAttempts[i] += 1;

//           if (newAttempts[i] >= 2) {
//             newLocked[i] = true; // блокируем поле
//           }
//         }
//       }
//     });

//     setCorrectInputs(newCorrect);
//     saveCorrectInputs(task.id, newCorrect);

//     setAttempts(newAttempts);
//     setLocked(newLocked);
//     setChecked(true);
//   };

//   const handleResetCheck = () => {
//     setChecked(false);
//   };

//   return (
//     <div className="task-container">
//       {/* === БАНК СЛОВ === */}
//       <div className="word-bank">
//         {shuffledAnswers.map((word, index) => (
//           <span key={index} className="word-bank-item no-select">
//             {word}
//           </span>
//         ))}
//       </div>
//         <hr/>
//       {/* === ТЕКСТ === */}
//       <div className="task-button">
//         <div className="text-block" onClick={handleResetCheck}>
//           {placeholders.map((text, i) => (
//             <React.Fragment key={i}>
//               <span>{text}</span>

//               {i < correctAnswers.length && (
//                 <input
//                   type="text"
//                   value={inputs[i] || ''}
//                   disabled={locked[i]}    // ← поле блокируется!
//                   onChange={(e) => handleChange(i, e.target.value)}

//                   onDrop={(e) => e.preventDefault()}
//                   onDragStart={(e) => e.preventDefault()}
//                   onPaste={(e) => e.preventDefault()}
//                   onCopy={(e) => e.preventDefault()}
//                   onCut={(e) => e.preventDefault()}

//                   className={
//                     locked[i]
//                       ? 'input-locked'       // красное, заблокированное
//                       : correctInputs.includes(i)
//                       ? 'input-correct'      // зелёное
//                       : checked && inputs[i].trim() !== ''
//                       ? 'input-wrong'        // красное, если ошибка
//                       : ''
//                   }
//                 />
//               )}
//             </React.Fragment>
//           ))}
//         </div>

//         <div className="reset-button-contaner">
//           <button className="button-proverit" onClick={handleCheck}>
//             ✓
//           </button>
//         </div>
//       </div>

//       {/* <div className="word-bank">
//         {shuffledAnswers.map((word, index) => (
//           <span key={index} className="word-bank-item no-select">
//             {word}
//           </span>
//         ))}
//       </div> */}



//     </div>
//   );
// }

// export default Task;

import React, { useEffect, useState } from 'react';
import {
  saveUserInputs,
  getUserInputs,
  saveCorrectInputs,
  getCorrectInputs,
} from '../utils/storage';
import '../styles/taskItem.css';

function Task({ task }) {
  const [inputs, setInputs] = useState([]);
  const [checked, setChecked] = useState(false);
  const [correctInputs, setCorrectInputs] = useState([]);
  const [shuffledAnswers, setShuffledAnswers] = useState([]);

  const [attempts, setAttempts] = useState([]);
  const [locked, setLocked] = useState([]);

  const placeholders = task.exercise.split('|_|');
  const correctAnswers = task.answers;

  const shuffleArray = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  useEffect(() => {
    const preventDefault = (e) => e.preventDefault();
    document.addEventListener('dragstart', preventDefault);
    document.addEventListener('drop', preventDefault);

    const savedInputs = getUserInputs(task.id);
    const savedCorrectIndexes = getCorrectInputs(task.id);

    setShuffledAnswers(shuffleArray(correctAnswers));

    const len = correctAnswers.length;

    setInputs(savedInputs.length === len ? savedInputs : Array(len).fill(''));
    setCorrectInputs(savedCorrectIndexes);
    setChecked(savedCorrectIndexes.length > 0);

    setAttempts(Array(len).fill(0));
    setLocked(Array(len).fill(false));

    return () => {
      document.removeEventListener('dragstart', preventDefault);
      document.removeEventListener('drop', preventDefault);
    };
  }, [task, correctAnswers]);

  const handleChange = (index, value) => {
    if (locked[index]) return;

    const updated = [...inputs];
    updated[index] = value;
    setInputs(updated);
    saveUserInputs(task.id, updated);
  };

  const handleCheck = () => {
    const newCorrect = [];
    const newAttempts = [...attempts];
    const newLocked = [...locked];

    inputs.forEach((input, i) => {
      const isCorrect =
        input.trim().toLowerCase() ===
        correctAnswers[i].trim().toLowerCase();

      if (isCorrect) {
        newCorrect.push(i);
      } else if (input.trim() !== '' && !locked[i]) {
        newAttempts[i] += 1;
        if (newAttempts[i] >= 2) {
          newLocked[i] = true;
        }
      }
    });

    setCorrectInputs(newCorrect);
    saveCorrectInputs(task.id, newCorrect);

    setAttempts(newAttempts);
    setLocked(newLocked);
    setChecked(true);
  };

  const handleResetCheck = () => {
    setChecked(false);
  };

  return (
    <div className="task-container">
      <div className="word-bank">
        {shuffledAnswers.map((word, index) => (
          <span key={index} className="word-bank-item no-select">
            {word}
          </span>
        ))}
      </div>

      <hr />

      <div className="task-button">
        <div className="text-block" onClick={handleResetCheck}>
          {placeholders.map((text, i) => (
            <React.Fragment key={i}>
              <span>{text}</span>

              {i < correctAnswers.length && (
                <input
                  type="text"
                  value={inputs[i] || ''}
                  disabled={locked[i]}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onDrop={(e) => e.preventDefault()}
                  onDragStart={(e) => e.preventDefault()}
                  onPaste={(e) => e.preventDefault()}
                  onCopy={(e) => e.preventDefault()}
                  onCut={(e) => e.preventDefault()}
                  className={
                    locked[i]
                      ? 'input-locked'
                      : correctInputs.includes(i)
                      ? 'input-correct'
                      : checked && inputs[i].trim() !== ''
                      ? 'input-wrong'
                      : ''
                  }
                />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="reset-button-contaner">
          <button className="button-proverit" onClick={handleCheck}>
            ✓
          </button>
        </div>
      </div>
    </div>
  );
}

export default Task;
