const timerDisplay = document.querySelector('.timer');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const addFiveBtn = document.getElementById('addFiveBtn');

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
    if (isRunning) {
        clearInterval(timerId);
        startBtn.textContent = 'Start';
        timerDisplay.contentEditable = 'true';
        isRunning = false;
        return;
    }

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

startBtn.addEventListener('click', startTimer);
resetBtn.addEventListener('click', resetTimer);
handleTimerInput();
addFiveBtn.addEventListener('click', addFiveMinutes); 