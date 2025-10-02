// DOM Elements
const timeDisplay = document.getElementById('time');
const dateDisplay = document.getElementById('date');
const alarmIndicator = document.getElementById('alarmIndicator');
const alarmHour = document.getElementById('alarmHour');
const alarmMinute = document.getElementById('alarmMinute');
const setAlarmBtn = document.getElementById('setAlarm');
const stopAlarmBtn = document.getElementById('stopAlarm');
const snoozeBtn = document.getElementById('snooze');
const alarmSound = document.getElementById('alarmSound');

// State variables
let alarmTime = null;
let isAlarmActive = false;
let isAlarmPlaying = false;
let snoozeTimeout = null;

// Update time display
function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    timeDisplay.textContent = `${hours}:${minutes}:${seconds}`;
    
    // Update date
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    dateDisplay.textContent = now.toLocaleDateString('en-US', options);
    
    // Check if alarm should trigger
    if (alarmTime && !isAlarmPlaying) {
        const currentTime = `${hours}:${minutes}`;
        if (currentTime === alarmTime && isAlarmActive) {
            triggerAlarm();
        }
    }
    
    // Add flash effect every second
    timeDisplay.classList.toggle('flash');
}

// Set alarm
function setAlarm() {
    const hour = alarmHour.value.padStart(2, '0');
    const minute = alarmMinute.value.padStart(2, '0');
    
    // Validate inputs
    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
        alert('Please enter valid time values (Hour: 0-23, Minute: 0-59)');
        return;
    }
    
    alarmTime = `${hour}:${minute}`;
    isAlarmActive = true;
    
    // Update alarm indicator
    alarmIndicator.innerHTML = `<i class="fas fa-bell"></i> Alarm Set: ${alarmTime}`;
    alarmIndicator.classList.remove('alarm-active');
    
    // Visual feedback
    setAlarmBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        setAlarmBtn.style.transform = 'scale(1)';
    }, 200);
    
    console.log(`Alarm set for ${alarmTime}`);
}

// Trigger alarm
function triggerAlarm() {
    isAlarmPlaying = true;
    
    // Update alarm indicator
    alarmIndicator.innerHTML = `<i class="fas fa-bell"></i> ALARM!`;
    alarmIndicator.classList.add('alarm-active');
    
    // Play alarm sound
    alarmSound.play().catch(e => {
        console.log('Audio play failed:', e);
        // Fallback: Use browser notification if audio fails
        if (Notification.permission === 'granted') {
            new Notification('Alarm!', {
                body: `It's ${alarmTime}!`,
                icon: '/favicon.ico'
            });
        }
    });
    
    // Flash the time display
    const flashInterval = setInterval(() => {
        timeDisplay.style.color = timeDisplay.style.color === '#ff3333' ? '#00ff9d' : '#ff3333';
    }, 500);
    
    // Store interval ID to clear later
    alarmSound.dataset.flashInterval = flashInterval;
    
    console.log('Alarm triggered!');
}

// Stop alarm
function stopAlarm() {
    if (!isAlarmPlaying) return;
    
    isAlarmPlaying = false;
    isAlarmActive = false;
    
    // Stop alarm sound
    alarmSound.pause();
    alarmSound.currentTime = 0;
    
    // Clear flashing effect
    clearInterval(alarmSound.dataset.flashInterval);
    timeDisplay.style.color = '#00ff9d';
    
    // Update alarm indicator
    alarmIndicator.innerHTML = `<i class="fas fa-bell-slash"></i> No Alarm Set`;
    alarmIndicator.classList.remove('alarm-active');
    
    // Clear any snooze timeout
    if (snoozeTimeout) {
        clearTimeout(snoozeTimeout);
        snoozeTimeout = null;
    }
    
    console.log('Alarm stopped');
}

// Snooze alarm
function snoozeAlarm() {
    if (!isAlarmPlaying) return;
    
    // Stop current alarm
    stopAlarm();
    
    // Calculate snooze time (5 minutes from now)
    const now = new Date();
    now.setMinutes(now.getMinutes() + 5);
    
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    
    // Set new alarm time
    alarmTime = `${hour}:${minute}`;
    isAlarmActive = true;
    
    // Update alarm indicator
    alarmIndicator.innerHTML = `<i class="fas fa-bed"></i> Snoozed Until: ${alarmTime}`;
    
    // Set timeout to reactivate alarm
    snoozeTimeout = setTimeout(() => {
        isAlarmActive = true;
        console.log('Snooze period ended');
    }, 5 * 60 * 1000);
    
    console.log(`Alarm snoozed until ${alarmTime}`);
}

// Input validation
alarmHour.addEventListener('change', function() {
    let val = parseInt(this.value);
    if (isNaN(val) || val < 0) this.value = 0;
    if (val > 23) this.value = 23;
});

alarmMinute.addEventListener('change', function() {
    let val = parseInt(this.value);
    if (isNaN(val) || val < 0) this.value = 0;
    if (val > 59) this.value = 59;
});

// Request notification permission
if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
}

// Event listeners
setAlarmBtn.addEventListener('click', setAlarm);
stopAlarmBtn.addEventListener('click', stopAlarm);
snoozeBtn.addEventListener('click', snoozeAlarm);

// Initialize
updateTime();
setInterval(updateTime, 1000);

// Add 3D rotation effect on mouse move
document.addEventListener('mousemove', (e) => {
    const clockFrame = document.querySelector('.clock-frame');
    const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
    const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
    clockFrame.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
});