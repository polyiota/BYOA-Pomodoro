const timerDisplay = document.querySelector('.timer');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const addFiveBtn = document.getElementById('addFiveBtn');
const focusModal = document.getElementById('focusModal');
const focusInput = document.getElementById('focusInput');
const saveFocusBtn = document.getElementById('saveFocus');
const cancelFocusBtn = document.getElementById('cancelFocus');
const focusDisplay = document.createElement('div');
focusDisplay.className = 'focus-display';
const container = document.querySelector('.container');
const h1Element = container.querySelector('h1');
container.insertBefore(focusDisplay, h1Element.nextSibling);
const closeModalBtn = document.getElementById('closeModalBtn');

let timeLeft = 25 * 60; // 25 minutes in seconds
let timerId = null;
let isRunning = false;

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function updateDisplay() {
    const timeString = formatTime(timeLeft);
    timerDisplay.textContent = timeString;
    document.title = isRunning ? `(${timeString}) Pomodoro Timer` : 'Pomodoro Timer';
}

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        startBtn.textContent = 'Pause';
        timerDisplay.contentEditable = 'false';

        timerId = setInterval(() => {
            timeLeft--;
            updateDisplay();

            if (timeLeft <= 0) {
                clearInterval(timerId);
                alert('Time is up!');
                resetTimer();
            }
        }, 1000);
    } else {
        clearInterval(timerId);
        startBtn.textContent = 'Start';
        timerDisplay.contentEditable = 'true';
        isRunning = false;
    }
}

function resetTimer() {
    clearInterval(timerId);
    timeLeft = 25 * 60;
    isRunning = false;
    startBtn.textContent = 'Start';
    timerDisplay.contentEditable = 'true';
    updateDisplay();
}

function handleTimerInput() {
    timerDisplay.addEventListener('blur', () => {
        const timeString = timerDisplay.textContent;
        const [minutes, seconds] = timeString.split(':').map(num => parseInt(num));
        
        if (isNaN(minutes) || isNaN(seconds) || minutes < 0 || seconds < 0 || seconds > 59) {
            resetTimer();
            return;
        }

        timeLeft = (minutes * 60) + seconds;
        updateDisplay();
    });

    timerDisplay.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            timerDisplay.blur();
        }
    });
}

function addFiveMinutes() {
    timeLeft += 5 * 60; // Add 5 minutes (300 seconds)
    updateDisplay();
}

function showFocusModal() {
    console.log('Opening modal');
    focusModal.classList.add('show');
    focusInput.focus();
}

function hideFocusModal() {
    focusModal.classList.remove('show');
    focusInput.value = '';
}

function handleFocusButton() {
    console.log('Focus button clicked');
    showFocusModal();
}

function saveFocus() {
    const focusText = focusInput.value.trim();
    if (focusText) {
        focusDisplay.innerHTML = `
            <span class="focus-text">${focusText}</span>
            <button class="clear-focus-btn" title="Clear focus">×</button>
        `;
        focusDisplay.style.display = 'block';
        hideFocusModal();
        
        const clearBtn = focusDisplay.querySelector('.clear-focus-btn');
        if (clearBtn) {
            clearBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                clearFocus();
            });
        }
        
        localStorage.setItem('pomodoroFocus', focusText);
    }
}

function loadSavedFocus() {
    const savedFocus = localStorage.getItem('pomodoroFocus');
    if (savedFocus) {
        focusDisplay.innerHTML = `
            <span class="focus-text">${savedFocus}</span>
            <button class="clear-focus-btn" title="Clear focus">×</button>
        `;
        focusDisplay.style.display = 'block';
        
        const clearBtn = focusDisplay.querySelector('.clear-focus-btn');
        if (clearBtn) {
            clearBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                clearFocus();
            });
        }
    }
}

function clearFocus() {
    focusDisplay.style.display = 'none';
    localStorage.removeItem('pomodoroFocus');
    resetTimer();
}

focusDisplay.addEventListener('click', (e) => {
    if (e.target.closest('.clear-focus-btn')) {
        e.preventDefault();
        e.stopPropagation();
        clearFocus();
        return;
    }
    
    focusInput.value = localStorage.getItem('pomodoroFocus') || '';
    showFocusModal();
});

loadSavedFocus();

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        hideFocusModal();
    }
});

closeModalBtn.addEventListener('click', hideFocusModal);
saveFocusBtn.addEventListener('click', saveFocus);
cancelFocusBtn.addEventListener('click', hideFocusModal);

const setFocusBtn = document.createElement('button');
setFocusBtn.textContent = '📝 Set Focus';
setFocusBtn.style.backgroundColor = '#28a745';
setFocusBtn.addEventListener('click', handleFocusButton);
document.querySelector('.buttons').appendChild(setFocusBtn);

focusModal.addEventListener('click', (e) => {
    if (e.target === focusModal) {
        hideFocusModal();
    }
});

startBtn.addEventListener('click', startTimer);
resetBtn.addEventListener('click', resetTimer);
addFiveBtn.addEventListener('click', addFiveMinutes);
handleTimerInput(); 