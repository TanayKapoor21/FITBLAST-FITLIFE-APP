// DOM Elements
const addGoalBtn = document.getElementById('add-goal-btn');
const currentGoalsList = document.getElementById('current-goals');
const workoutForm = document.getElementById('workout-form');
const workoutList = document.getElementById('workout-list');
const historyFilter = document.getElementById('history-filter');
const monthlyWorkouts = document.getElementById('monthly-workouts');
const totalTime = document.getElementById('total-time');
const caloriesBurned = document.getElementById('calories-burned');

// State Management
let goals = JSON.parse(localStorage.getItem('fitnessGoals')) || [];
let workouts = JSON.parse(localStorage.getItem('workoutHistory')) || [];

// Initialize the page
function init() {
    renderGoals();
    renderWorkouts();
    updateStatistics();
}

// Goals Management
function addGoal() {
    const goal = prompt('Enter your new fitness goal:');
    if (goal) {
        goals.push({
            id: Date.now(),
            text: goal,
            progress: 0,
            progressHistory: [],
            createdAt: new Date().toISOString()
        });
        saveGoals();
        renderGoals();
    }
}

function addProgress(goalId) {
    const goal = goals.find(g => g.id === goalId);
    const progressInput = document.getElementById(`progress-input-${goalId}`).value;
    const progress = parseInt(progressInput);
    
    if (goal && !isNaN(progress) && progress >= 0 && progress <= 100) {
        const progressEntry = {
            id: Date.now(),
            value: progress,
            date: new Date().toISOString()
        };
        goal.progressHistory.push(progressEntry);
        goal.progress = progress;
        saveGoals();
        renderGoals();
    }
}

function deleteProgress(goalId, progressId) {
    const goal = goals.find(g => g.id === goalId);
    if (goal) {
        goal.progressHistory = goal.progressHistory.filter(p => p.id !== progressId);
        if (goal.progressHistory.length > 0) {
            goal.progress = goal.progressHistory[goal.progressHistory.length - 1].value;
        } else {
            goal.progress = 0;
        }
        saveGoals();
        renderGoals();
    }
}

function deleteGoal(goalId) {
    goals = goals.filter(g => g.id !== goalId);
    saveGoals();
    renderGoals();
}

function renderGoals() {
    currentGoalsList.innerHTML = '';
    goals.forEach(goal => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${goal.text}</span>
            <div class="goal__progress-input">
                <input type="number" id="progress-input-${goal.id}" min="0" max="100" value="${goal.progress}" placeholder="Progress %" />
                <button onclick="addProgress(${goal.id})" class="btn btn__secondary">Update Progress</button>
                <button onclick="deleteGoal(${goal.id})" class="btn btn__secondary">Delete Goal</button>
            </div>
            <div class="progress__history">
                <h5>Progress History</h5>
                <ul class="progress__entries">
                    ${goal.progressHistory.map(entry => `
                        <li>
                            <span>${new Date(entry.date).toLocaleDateString()}: ${entry.value}%</span>
                            <button onclick="deleteProgress(${goal.id}, ${entry.id})" class="btn btn__secondary btn__small">Delete</button>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
        currentGoalsList.appendChild(li);
    });

    // Update progress bars
    const progressBars = document.querySelector('.progress__bars');
    progressBars.innerHTML = '';
    goals.forEach(goal => {
        const progressBar = document.createElement('div');
        progressBar.innerHTML = `
            <div class="progress__bar">
                <div class="progress__bar__fill" style="width: ${goal.progress}%"></div>
            </div>
            <p>${goal.text} - ${goal.progress}%</p>
        `;
        progressBars.appendChild(progressBar);
    });
}

// Workout History Management
function addWorkout(event) {
    event.preventDefault();
    
    const workout = {
        id: Date.now(),
        date: document.getElementById('workout-date').value,
        type: document.getElementById('workout-type').value,
        duration: parseInt(document.getElementById('workout-duration').value),
        notes: document.getElementById('workout-notes').value,
        createdAt: new Date().toISOString()
    };

    workouts.unshift(workout);
    saveWorkouts();
    renderWorkouts();
    updateStatistics();
    workoutForm.reset();
}

function deleteWorkout(workoutId) {
    workouts = workouts.filter(w => w.id !== workoutId);
    saveWorkouts();
    renderWorkouts();
    updateStatistics();
}

function renderWorkouts() {
    const filter = historyFilter.value;
    const filteredWorkouts = filter === 'all' 
        ? workouts 
        : workouts.filter(w => w.type === filter);

    workoutList.innerHTML = '';
    filteredWorkouts.forEach(workout => {
        const workoutItem = document.createElement('div');
        workoutItem.className = 'workout__item';
        workoutItem.innerHTML = `
            <div class="workout__info">
                <span class="workout__type">${workout.type}</span>
                <span class="workout__date">${new Date(workout.date).toLocaleDateString()}</span>
                <span class="workout__duration">${workout.duration} minutes</span>
                ${workout.notes ? `<p>${workout.notes}</p>` : ''}
            </div>
            <button onclick="deleteWorkout(${workout.id})" class="btn btn__secondary">Delete</button>
        `;
        workoutList.appendChild(workoutItem);
    });
}

// Statistics
function updateStatistics() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const monthlyWorkoutsCount = workouts.filter(w => new Date(w.date) >= startOfMonth).length;
    const totalWorkoutTime = workouts.reduce((sum, w) => sum + w.duration, 0);
    const estimatedCalories = Math.round(totalWorkoutTime * 7); // Rough estimate: 7 calories per minute

    monthlyWorkouts.textContent = monthlyWorkoutsCount;
    totalTime.textContent = `${Math.round(totalWorkoutTime / 60)} hours`;
    caloriesBurned.textContent = estimatedCalories;
}

// Local Storage Management
function saveGoals() {
    localStorage.setItem('fitnessGoals', JSON.stringify(goals));
}

function saveWorkouts() {
    localStorage.setItem('workoutHistory', JSON.stringify(workouts));
}

// Event Listeners
addGoalBtn.addEventListener('click', addGoal);
workoutForm.addEventListener('submit', addWorkout);
historyFilter.addEventListener('change', renderWorkouts);

// Initialize the page
init(); 