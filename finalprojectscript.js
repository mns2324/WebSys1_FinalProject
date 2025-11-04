// inputs
let gameinput = document.getElementById("gameinput");
let genreinput = document.getElementById("genreinput");
let summaryinput = document.getElementById("summaryinput");
let taskinput = document.getElementById("taskinput");
// buttons
const addCurrent = document.querySelector(".add-btn");
const addLater = document.querySelector(".later-btn");
const addTasks = document.getElementById("addtasks");
// lists
let currentList = document.getElementById("currentGamesList");
let laterList = document.getElementById("backlogList");
let taskList = document.getElementById("taskList");
// arrays 
let currentGamesArray = [];
let backlogGamesArray = [];
// containers/divs
const entireTasksContainer = document.getElementById("gametaskscontainer");
const gamesContainer = document.querySelector('.currentgames-backlog');
const tasksContainer = document.querySelector('.task-list');
// counters (for numbering items and total count)
let cCount = 0, lCount = 0, tCount = 0;
let currentGamesIndex = -1;

// ADD TO CURRENT GAMES
addCurrent.addEventListener("click", function () {
    let game = gameinput.value.trim();
    let genre = genreinput.value.trim();

    if (game === "" || genre === "") {
        alert("Please enter both a game and its genre.");
        return;
    };

    cCount++;
    let li = document.createElement("li");
    li.innerHTML = `          
        <span>${cCount}. ${game} - ${genre}</span>
        <span class="status not-started">NOT STARTED</span>
        <div class="btn-group">           
            <button class="view">VIEW TASKS</button>
            <button class="remove">X</button>
        </div>  
    `;

    //// should look like this
    // game: Celeste
    // genre: 2D Platformer
    // summary: "A challenging platformer about climbing a mountain."
    // tasksArray: [
    //      {task: "Get Golden Strawberry in 3A", isDone: false}, 
    //      {task: "Get Golden Strawberry in 4A", isDone: false}, 
    //      {task: "Finish all B-Sides", isDone: true}
    // ]
    currentGamesArray.push({
        game: game,
        genre: genre,
        summary: "",
        tasksArray: [], // tasks init'd/stored here
        taskDoneCount: 0
    });

    let gameIndex = currentGamesArray.length - 1; // index of the newly added game

    // X button
    li.querySelector(".remove").addEventListener("click", function () {
        currentList.removeChild(li);
        cCount--;
        currentGamesArray.splice(gameIndex, 1); // remove from array
        alert(`${game} and all of its tasks have been cleared!`)
        updateCounters();
        updatePlaceholderText();
    });

    // VIEW TASKS button
    li.querySelector(".view").addEventListener("click", function () {
        currentGamesIndex = gameIndex;
        showTasksForThisGame(currentGamesIndex);

        // debug stuff
        const tasks = currentGamesArray[currentGamesIndex].tasksArray;
        console.log(`Currently viewing ${game} at index ${currentGamesIndex} with these tasks:`);
        if (tasks.length === 0) {
            console.log("No tasks added yet.");
        } else {
            for (let i = 0; i < tasks.length; i++) {
                let status = "";
                if (tasks[i].isDone) {
                    status = "DONE";
                } else {
                    status = "NOT DONE";
                }
                console.log(`${i + 1}. ${tasks[i].task} - ${status}`);
            }
        }
    });

    currentList.appendChild(li);

    gameinput.value = "";
    genreinput.value = "";
    updateCounters();
    updatePlaceholderText();
    setHoverEffects();
});

// ADD TO GAME BACKLOG
addLater.addEventListener("click", function () {
    let game = gameinput.value.trim();
    let genre = genreinput.value.trim();

    if (game === "" || genre === "") {
        alert("Please enter both a game and its genre.");
        return;
    };

    lCount++;
    let li = document.createElement("li");
    li.innerHTML = `          
        ${lCount}. ${game} - ${genre}
        <div class="btn-group">
          <button class="add-btnBacklog">ADD TO CURRENT GAMES</button>
          <button class="remove">X</button>
        </div>
    `;

    li.querySelector(".remove").addEventListener("click", function () {
        laterList.removeChild(li);
        lCount--;
        updateCounters();
        updatePlaceholderText();
    });

    li.querySelector(".add-btnBacklog").addEventListener("click", function () {
        laterList.removeChild(li);
        lCount--;
        cCount++;
        moveToCurrentGames(game, genre);
        updateCounters();
    });

    laterList.appendChild(li);

    backlogGamesArray.push({ game: game, genre: genre });
    gameinput.value = "";
    genreinput.value = "";
    updateCounters();
    updatePlaceholderText();
    setHoverEffects();
});

let description = document.getElementById("placeholderDesc");
const clearallbtn = document.getElementById("clearalltasks");

// ADD TO TASKS (add desc, task or both at the same time)
addTasks.addEventListener("click", function () {
    let summary = summaryinput.value.trim();
    let task = taskinput.value.trim();
    let currentlyViewedGame = currentGamesArray[currentGamesIndex];

    if (summary === "" && task === "") {
        alert("Please enter something in the summary or task field.");
        return;
    };
    if (currentGamesIndex === -1) {
        alert("Please select a game from CURRENT GAMES to add tasks to.");
        return;
    }
    if (summary !== "") { // add summary
        description.textContent = summary;
        currentlyViewedGame.summary = summary; // actually save it to the array
        let span = document.createElement("span");
        span.innerHTML = `<button class="remove">CLEAR</button>`;
        description.appendChild(span);

        // clear description
        span.querySelector(".remove").addEventListener("click", function () {
            description.textContent = "No description added yet.";
            currentlyViewedGame.summary = ""; // clear from array
            updatePlaceholderText();
        });
    };
    if (task !== "") { // add task
        tCount++;
        let li = document.createElement("li");
        li.innerHTML = `          
            <span>${tCount}. ${task}</span>
            <button id="statusToggleBtn" class="status not-started">NOT DONE</button>
            <button class="remove">X</button>
        `;
        taskList.appendChild(li);

        // toggle task status
        const statusBtn = li.querySelector(".status");
        const newTask = { task: task, isDone: false };
        currentlyViewedGame.tasksArray.push(newTask);
        statusBtn.addEventListener("click", function () {
            let statusSpan = currentList.querySelector(".status");
            newTask.isDone = !newTask.isDone; // flip the bool

            if (newTask.isDone) { // mark as done
                statusBtn.classList.add("complete");
                statusBtn.classList.remove("not-started");
                statusBtn.textContent = "DONE";
                currentlyViewedGame.taskDoneCount++;
                console.log(`Current tasks done for ${currentGamesArray[currentGamesIndex].game}: ${currentlyViewedGame.taskDoneCount}`);
            } else { // mark as not done
                statusBtn.classList.remove("complete");
                statusBtn.classList.add("not-started");
                statusBtn.textContent = "NOT DONE";
                currentlyViewedGame.taskDoneCount--;
                console.log(`Current tasks done for ${currentGamesArray[currentGamesIndex].game}: ${currentlyViewedGame.taskDoneCount}`);
            }

            updateGameStatus(statusSpan, currentlyViewedGame);
            setHoverEffects();
        });


        // remove a task
        li.querySelector(".remove").addEventListener("click", function () {
            for (let j = 0; j < currentlyViewedGame.tasksArray.length; j++) {
                if (currentlyViewedGame.tasksArray[j] === newTask) {
                    currentlyViewedGame.tasksArray.splice(j, 1);
                    currentlyViewedGame.taskDoneCount--;
                    console.log(`Current tasks done for ${currentGamesArray[currentGamesIndex].game}: ${currentlyViewedGame.taskDoneCount}`);
                    break; // stop after removing
                }
            }

            let statusSpan = currentList.querySelector(".status");
            updateGameStatus(statusSpan, currentlyViewedGame);
            taskList.removeChild(li);
            showTasksForThisGame(currentGamesIndex); // refresh the task list display
        });

        // enable clear all button if 2 or more tasks
        if (currentlyViewedGame.tasksArray.length >= 2) {
            clearallbtn.classList.remove("inactive");
            clearallbtn.classList.add("active");
        } else {
            clearallbtn.classList.add("inactive");
            clearallbtn.classList.remove("active");
        }
    };

    summaryinput.value = "";
    taskinput.value = "";
    updatePlaceholderText();
    setHoverEffects();
    updateCounters();
});

clearallbtn.addEventListener("click", function () {
    const tasks = taskList.querySelectorAll("li");

    // clear existing tasks
    for (let i = 0; i < tasks.length; i++) {
        taskList.removeChild(tasks[i]);
    }

    if (currentGamesIndex !== -1) {
        currentGamesArray[currentGamesIndex].tasksArray = [];
    };

    tCount = 0;
    alert("All tasks have been cleared.");
    updatePlaceholderText();
    clearallbtn.classList.add("inactive");
    clearallbtn.classList.remove("active");
});

lightdarktoggle.addEventListener("click", function () {

});

function updateGameStatus(statusSpan, game) {
    if (game.taskDoneCount === 0) {
        statusSpan.classList.remove("complete");
        statusSpan.classList.remove("in-progress");
        statusSpan.classList.add("not-started");
        statusSpan.textContent = "NOT STARTED";
        console.log("pass 1");
    } else if (game.taskDoneCount > 0 && game.taskDoneCount < game.tasksArray.length) {
        statusSpan.classList.remove("complete");
        statusSpan.classList.add("in-progress");
        statusSpan.classList.remove("not-started");
        statusSpan.textContent = "IN PROGRESS";
        console.log("pass 2");
    } else if (game.taskDoneCount === game.tasksArray.length) {
        statusSpan.classList.add("complete");
        statusSpan.classList.remove("in-progress");
        statusSpan.classList.remove("not-started");
        statusSpan.textContent = "ALL COMPLETE!";
        console.log("pass 3");
        alert(`${game.game} - All tasks completed!`);
    } else {
        console.log("lol");
        return;
    }
};

// update the counters and visibility of sections
function updateCounters() {
    const currentHeader = document.getElementById("currentgamestotal");
    const backlogHeader = document.getElementById("backlogtotal");
    currentHeader.textContent = `Currently Playing (Total: ${cCount})`;
    backlogHeader.textContent = `Your Backlog (Total: ${lCount})`;

    if (cCount + lCount > 0) {
        gamesContainer.style.display = ''; // show
    } else {
        gamesContainer.style.display = 'none';
    }
};

// functionality for ADD TO CURRENT GAMES button in the backlog list
function moveToCurrentGames(game, genre) {
    let li = document.createElement("li");
    li.innerHTML = `          
        <span>${cCount}. ${game} - ${genre}</span>
        <span class="status not-started">NOT STARTED</span>
        <div class="btn-group">           
            <button class="view">VIEW TASKS</button>
            <button class="remove">X</button>
        </div>  
    `;

    // push the moved game to the array first
    currentGamesArray.push({
        game: game,
        genre: genre,
        summary: "",
        tasksArray: []
    });

    let gameIndex = currentGamesArray.length - 1; // get the new index

    li.querySelector(".remove").addEventListener("click", function () {
        currentList.removeChild(li);
        cCount--;
        currentGamesArray.splice(gameIndex, 1); // remove from array
        updateCounters();
        updatePlaceholderText();
    });

    li.querySelector(".view").addEventListener("click", function () {
        currentGamesIndex = gameIndex;
        showTasksForThisGame(currentGamesIndex);

        const tasks = currentGamesArray[currentGamesIndex].tasksArray;
        console.log(`Currently viewing ${game} at index ${currentGamesIndex} with these tasks:`);

        if (tasks.length === 0) {
            console.log("No tasks added yet.");
        } else {
            for (let i = 0; i < tasks.length; i++) {
                let status = "";
                if (tasks[i].isDone) {
                    status = "DONE";
                } else {
                    status = "NOT DONE";
                }
                console.log(`${i + 1}. ${tasks[i].task} - ${status}`);
            }
        }
    });

    currentList.appendChild(li);
    updatePlaceholderText();
    setHoverEffects();
};

// save/populate task list container with desc/tasks for the selected game
function showTasksForThisGame(index) {
    entireTasksContainer.classList.remove("inactive");

    const gameItself = currentGamesArray[index]; // shows tasks based on game index
    const gameHeader = document.getElementById("tasksfor");
    const gameDesc = document.getElementById("placeholderDesc");
    const gameTasks = document.getElementById("taskList");

    gameHeader.textContent = `TASKS FOR: ${gameItself.game}`;
    if (gameItself.summary === "") {
        gameDesc.textContent = "No description added yet.";
    } else {
        gameDesc.textContent = gameItself.summary;

        // put this here so that the clear button shows up when viewing existing desc
        let span = document.createElement("span");
        span.innerHTML = `<button class="remove">CLEAR</button>`;
        gameDesc.appendChild(span);

        // clear description
        span.querySelector(".remove").addEventListener("click", function () {
            description.textContent = "No description added yet.";
            gameItself.summary = ""; // clear from array
            updatePlaceholderText();
        });
    }

    // clear existing tasks first
    let tasks = gameTasks.querySelectorAll("li");
    // start at the end to avoid issues 
    for (let i = tasks.length - 1; i >= 0; i--) {
        gameTasks.removeChild(tasks[i]);
    }

    tCount = 0;
    // fill task list with tasks from the selected game (and their buttons + status + functions)
    for (let i = 0; i < gameItself.tasksArray.length; i++) {
        let storedTask = gameItself.tasksArray[i];
        let taskText = storedTask.task;
        tCount++;

        // should correctly display statuses for tasks when switching between games back and forth
        let statusText = "";
        let statusClass = "";
        if (storedTask.isDone) {
            statusText = "DONE";
            statusClass = "complete";
        } else {
            statusText = "NOT DONE";
            statusClass = "not-started";
        }

        let li = document.createElement("li");
        li.innerHTML = `          
            <span>${tCount}. ${taskText}</span>
            <button id="statusToggleBtn" class="status ${statusClass}">${statusText}</button>
            <button class="remove">X</button>
        `;

        const statusBtn = li.querySelector(".status");
        statusBtn.addEventListener("click", function () {
            if (!storedTask.isDone) { // red -> green
                statusBtn.classList.add("complete");
                statusBtn.classList.remove("not-started");
                statusBtn.textContent = "DONE";
                storedTask.isDone = true;
            } else { // green -> red
                statusBtn.classList.remove("complete");
                statusBtn.classList.add("not-started");
                statusBtn.textContent = "NOT DONE";
                storedTask.isDone = false;
            }
            setHoverEffects();
        });

        // remove a task
        li.querySelector(".remove").addEventListener("click", function () {
            for (let j = 0; j < gameItself.tasksArray.length; j++) {
                // remove from the game's tasks array
                if (gameItself.tasksArray[j].task === storedTask.task) {
                    gameItself.tasksArray.splice(j, 1);
                    gameItself.taskDoneCount--;
                    console.log(`Current tasks done for ${currentGamesArray[currentGamesIndex].game}: ${gameItself.taskDoneCount}`);
                    break;
                }
            }

            let statusSpan = currentList.querySelector(".status");
            updateGameStatus(statusSpan, gameItself);
            gameTasks.removeChild(li);

            // reset tCount and renumber the remaining tasks
            tCount = 0;
            const allTasks = taskList.querySelectorAll("li");
            for (let k = 0; k < allTasks.length; k++) {
                tCount++;
                // update numbering
                let span = allTasks[k].querySelector("span");
                span.textContent = `${tCount}. ${gameItself.tasksArray[k].task}`;
            }

            updatePlaceholderText();

            // disable clear if less than 2 tasks after removal
            if (gameItself.tasksArray.length >= 2) {
                clearallbtn.classList.remove("inactive");
                clearallbtn.classList.add("active");
            } else {
                clearallbtn.classList.add("inactive");
                clearallbtn.classList.remove("active");
            }
        });
        gameTasks.appendChild(li);
    }

    // disable clear all button if less than 2 tasks
    if (gameItself.tasksArray.length >= 2) {
        clearallbtn.classList.remove("inactive");
        clearallbtn.classList.add("active");
    } else {
        clearallbtn.classList.add("inactive");
        clearallbtn.classList.remove("active");
    }

    updatePlaceholderText();
    setHoverEffects();
}

// hover effect for the buttons
function setHoverEffects() {
    let btnhoverblue = document.querySelectorAll(".add-btn, .later-btn, .view, .add-btnBacklog");
    let btnhoverred = document.querySelectorAll(".remove");
    let btnhovertasktogglegreen = document.querySelectorAll(".status.complete");
    let btnhovertasktogglered = document.querySelectorAll(".status.not-started");
    btnhoverblue.forEach(function (btn) {
        btn.addEventListener("mouseover", function () {
            btn.style.backgroundColor = "rgba(80, 167, 248, 1)";
            btn.style.color = "rgba(0, 0, 0, 1)";
        });
        btn.addEventListener("mouseout", function () {
            // return to default
            btn.style.backgroundColor = "";
            btn.style.color = "";
        });
    });
    btnhoverred.forEach(function (btn) {
        btn.addEventListener("mouseover", function () {
            btn.style.backgroundColor = "#cc0303ff";
            btn.style.color = "rgba(0, 0, 0, 1)";
        });
        btn.addEventListener("mouseout", function () {
            // return to default
            btn.style.backgroundColor = "";
            btn.style.color = "";
        });
    });
    btnhovertasktogglegreen.forEach(function (btn) {
        btn.addEventListener("mouseover", function () {
            btn.style.border = "2px solid #ff0000ff"
        });
        btn.addEventListener("mouseout", function () {
            // return to default
            btn.style.border = "";
        });
    });
    btnhovertasktogglered.forEach(function (btn) {
        btn.addEventListener("mouseover", function () {
            btn.style.border = "2px solid #00ff22ff"
        });
        btn.addEventListener("mouseout", function () {
            // return to default
            btn.style.border = "";
        });
    });
};

// toggle placeholder text when "li"s are added/removed
function updatePlaceholderText() {
    const placeholderGame = document.getElementById("placeholderGame");
    const placeholderBacklog = document.getElementById("placeholderBacklog");
    const placeholderDesc = document.getElementById("placeholderDesc");
    const descText = placeholderDesc.textContent.trim();
    const placeholderTask = document.getElementById("placeholderTask");

    if (cCount > 0) {
        placeholderGame.style.display = "none";
    } else {
        placeholderGame.style.display = "";
    }

    if (lCount > 0) {
        placeholderBacklog.style.display = "none";
    } else {
        placeholderBacklog.style.display = "";
    }

    if (descText === "") {
        placeholderDesc.style.display = "none";
    } else {
        placeholderDesc.style.display = "";
    }

    if (tCount > 0) {
        placeholderTask.style.display = "none";
    } else {
        placeholderTask.style.display = "";
    }
};

// init
setHoverEffects();
updateCounters();
updatePlaceholderText();
