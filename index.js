/**
 * declare global variables
 */
var isPaused = false;
var isResting = false;
var currentInterval = null;
var countdownBeep = new Audio('sounds/ping.mp3');
var finalBeep = new Audio('sounds/beep-final.mp3');

/**
 * creates new workout and begins
 */
var startNewWorkout;

/**
 * pauses current workout
 */
var pauseWorkout;

/**
 * resumes current workout
 */
var resumeWorkout;

/**
 * cancels current workout
 */
var cancelWorkout;

// define startNewWorkout
startNewWorkout = () => {
    let countdown = 10;
    
    // handle resume from pause
    if(isPaused){
        _toggleAll();
        resumeWorkout();
        return 0;
    }

    // reset previous values
    clearInterval(currentInterval);
    isPaused = false;
    isResting = false;
    _setTime(countdown);
    _setIntervalNumber('N/A');

    // gather variables
    let workoutList = document.getElementById('workout-list');
    if(!workoutList.value || !workoutList.value.length){
        alert('Please supply at least one exercise.');
        return 0;
    }
    let intervalLength = document.getElementById('interval-length').value;
    if(!intervalLength || parseInt(intervalLength) < 1){
        alert('Please define an interval length greater than zero seconds.');
        return 0;
    }
    let intervalFrequency = document.getElementById('interval-frequency').value;
    if(!intervalFrequency || parseInt(intervalFrequency) < 1){
        alert('Please define an interval frequency greater than 1.');
        return 0;
    }
    let restTime = document.getElementById('rest-time').value;
    if(!restTime || parseInt(restTime) < 0){
        alert('Rest time cannot be a negative number!');
        return 0;
    }

    // indicate
    _toggleAll();
    _setActivity('Starting Workout...');
    
    // initialize data / make transformations
    intervalLength = parseInt(intervalLength);
    intervalFrequency = parseInt(intervalFrequency);
    console.log(intervalFrequency);
    restTime = parseInt(restTime);
    console.log([intervalLength,intervalFrequency,restTime]);
    workoutList = workoutList.value
        .replace(/\r\n/g, '\n')
        .replace(/\n\n+/g, '\n')
        .replace(/\r/g, '\n');
    const exercises = workoutList
        .split('\n')
        .filter((exercise) => exercise.length > 0 && exercise.search(/[^\s\\]/) > -1);
    const numExercises = exercises.length;
    let currentExercise=0, currentIntervalNumber=1, currentSeconds=intervalLength, restCount=restTime;

    // begin workout
    currentInterval = setInterval(() => {
        if(isPaused){
            _setActivity('PAUSED');
        }
        else if(countdown >= 0){
            _setActivity('GET READY!');
            _setTime(countdown);
            countdown--;
        }
        else if(isResting){
            _setActivity('REST');
            _setTime(restCount);
            isResting = restCount <= 0 ? false : true;
            restCount = restCount <= 0 ? restTime : restCount;
            restCount--;
        }
        else {
            // display state
            _setActivity(exercises[currentExercise]);
            _setIntervalNumber(currentIntervalNumber);
            _setTime(currentSeconds);

            // cycle intervals
            if(currentSeconds == 0) {
                currentIntervalNumber++;
                isResting = true;
                currentSeconds = intervalLength+1;
            };

            // cycle exercises
            if(currentIntervalNumber > intervalFrequency) {
                currentExercise++;
                currentIntervalNumber = 1;
            };

            // end workout
            if(currentExercise == numExercises) cancelWorkout();

            // cycle seconds
            currentSeconds--;
        }
    }, 1000);
}

// define pauseWorkout
pauseWorkout = () => {
    _toggleAll();
    isPaused = true;
}

// define resumeWorkout
resumeWorkout = () => {
    isPaused = false;
}

// define cancelWorkout
cancelWorkout = () => {
    if(isPaused) _toggleDisabled(document.getElementById('pause-button'));
    _toggleAll();
    clearInterval(currentInterval);
    isPaused = false;
    isResting = false;
    _setActivity('Workout Complete!');
    _setTime(0);
    _setIntervalNumber('N/A');
}

/**
 * helpers
 */
const _setActivity = (activity) => {
    document.getElementById('current-activity').innerHTML = activity;
}
const _setTime = (seconds) => {
    if(seconds > 0 && seconds < 10) countdownBeep.play();
    if(seconds == 0) finalBeep.play();
    document.getElementById('time-number').style = seconds < 10 ? 'color: red;' : 'color: black;';
    let minutes = 0;
    minutes += Math.floor(seconds/60);
    seconds = seconds % 60;
    document.getElementById('time-number').innerHTML = `${minutes}:${seconds>9?'':'0'}${seconds}`;
}
const _setIntervalNumber = (interval) => {
    document.getElementById('interval-number').innerHTML = interval;
}
const _toggleDisabled = (element) => {
    element.style = element.disabled ? 'opacity: 1;' : 'opacity: 0.5';
    element.disabled = !element.disabled;
}
const _toggleAll = () => {
    _toggleDisabled(document.getElementById('start-button'));
    _toggleDisabled(document.getElementById('pause-button'));
    _toggleDisabled(document.getElementById('stop-button'));
}