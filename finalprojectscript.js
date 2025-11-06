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
const tasksInputContainer = document.querySelector(".task-input");
const tasksContainer = document.querySelector(".task-list");
const entireGamesContainer = document.getElementById("gametrackercontainer");
const gamesInputContainer = document.querySelector(".add-game")
const gamesContainer = document.querySelector(".currentgames-backlog");
// counters (for numbering items and total count)
let cCount = 0, lCount = 0, tCount = 0;
// set these as global instead of only setting in some functions so it can be tracked correctly
let currentGamesIndex = -1;
let currentlyViewedGame = null;

// ADD TO CURRENT GAMES
addCurrent.addEventListener("click", function () {
    let game = gameinput.value.trim();
    let genre = genreinput.value.trim();

    // alert if both fields are empty
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

    // light/dark mode toggle for view & remove button
    if (lightModeOn) {
        li.querySelector(".view").style.backgroundColor = "#50A7F8";
        li.querySelector(".view").style.color = "#000000";
        li.querySelector(".view").style.borderColor = "#000000";
        li.querySelector(".remove").style.backgroundColor = "#CC0303";
        li.querySelector(".remove").style.color = "#000000";
        li.querySelector(".remove").style.borderColor = "#000000";
    } else {
        li.querySelector(".view").style.backgroundColor = "";
        li.querySelector(".view").style.color = "";
        li.querySelector(".view").style.borderColor = "";
        li.querySelector(".remove").style.backgroundColor = "";
        li.querySelector(".remove").style.color = "";
        li.querySelector(".remove").style.borderColor = "";
    }

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

        // if the game currently being viewed is deleted, clear its task UI then hide it
        if (currentlyViewedGame && currentlyViewedGame.game === game) {
            taskList.innerHTML = "";
            description.textContent = "No description added yet.";
            clearallbtn.classList.add("inactive");
            clearallbtn.classList.remove("active");
            currentlyViewedGame = null;

            if (entireTasksContainer) {
                entireTasksContainer.style.display = "none";
            }
        }

        currentGamesArray.splice(gameIndex, 1);

        // renumber the index for the remaining games
        for (let i = 0; i < currentGamesArray.length; i++) {
            currentGamesArray[i].gameIndex = i;
        }
        alert(`${game} and all of its tasks have been cleared!`);
        updateCounters();
        updatePlaceholderText();
    });

    // VIEW TASKS button
    li.querySelector(".view").addEventListener("click", function () {
        // find correct game index by name 
        let foundIndex = -1;
        for (let i = 0; i < currentGamesArray.length; i++) {
            if (currentGamesArray[i].game === game) {
                foundIndex = i;
                break;
            }
        }

        if (foundIndex !== -1) {
            currentGamesIndex = foundIndex;
            currentlyViewedGame = currentGamesArray[foundIndex];
            showTasksForThisGame(foundIndex);
        }

        // debug/console stuff
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

    // toggle light/dark mode for add to backlog/remove button
    if (lightModeOn) {
        li.querySelector(".add-btnBacklog").style.backgroundColor = "#50A7F8";
        li.querySelector(".add-btnBacklog").style.color = "#000000";
        li.querySelector(".add-btnBacklog").style.borderColor = "#000000";
        li.querySelector(".remove").style.backgroundColor = "#CC0303";
        li.querySelector(".remove").style.color = "#000000";
        li.querySelector(".remove").style.borderColor = "#000000";
    } else {
        li.querySelector(".add-btnBacklog").style.backgroundColor = "";
        li.querySelector(".add-btnBacklog").style.color = "";
        li.querySelector(".add-btnBacklog").style.borderColor = "";
        li.querySelector(".remove").style.backgroundColor = "";
        li.querySelector(".remove").style.color = "";
        li.querySelector(".remove").style.borderColor = "";
    }

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
    // if (!currentlyViewedGame) {
    //     alert("Please select a game from CURRENT GAMES to add tasks to.");
    //     return;
    // }

    if (summary === "" && task === "") {
        alert("Please enter something in the summary or task field.");
        return;
    };

    if (summary !== "") { // add summary
        description.textContent = summary;
        currentlyViewedGame.summary = summary; // actually save it to the array
        let span = document.createElement("span");
        span.innerHTML = `<button class="remove">CLEAR</button>`;
        description.appendChild(span);

        // toggle light/dark mode for clear button
        if (lightModeOn) {
            span.querySelector(".remove").style.backgroundColor = "#CC0303";
            span.querySelector(".remove").style.color = "#000000";
            span.querySelector(".remove").style.borderColor = "#000000";
        } else {
            span.querySelector(".remove").style.backgroundColor = "";
            span.querySelector(".remove").style.color = "";
            span.querySelector(".remove").style.borderColor = "";
        }

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

        // toggle light/dark mode for remove button
        if (lightModeOn) {
            li.querySelector(".remove").style.backgroundColor = "#CC0303";
            li.querySelector(".remove").style.color = "#000000";
            li.querySelector(".remove").style.borderColor = "#000000";
        } else {
            li.querySelector(".remove").style.backgroundColor = "";
            li.querySelector(".remove").style.color = "";
            li.querySelector(".remove").style.borderColor = "";
        }

        taskList.appendChild(li);

        const statusBtn = li.querySelector(".status");
        const newTask = { task: task, isDone: false };
        currentlyViewedGame.tasksArray.push(newTask);

        // toggle task status
        statusBtn.addEventListener("click", function () {
            newTask.isDone = !newTask.isDone; // flip the bool
            if (newTask.isDone) { // mark as done
                statusBtn.classList.add("complete");
                statusBtn.classList.remove("not-started");
                statusBtn.textContent = "DONE";
                currentlyViewedGame.taskDoneCount++;
                console.log(`Current tasks done for ${currentlyViewedGame.game}: ${currentlyViewedGame.taskDoneCount}`);
            } else { // mark as not done
                statusBtn.classList.remove("complete");
                statusBtn.classList.add("not-started");
                statusBtn.textContent = "NOT DONE";
                currentlyViewedGame.taskDoneCount--;
                console.log(`Current tasks done for ${currentlyViewedGame.game}: ${currentlyViewedGame.taskDoneCount}`);
            }

            updateGameStatus(currentlyViewedGame);
            setHoverEffects();
        });

        // remove a task
        li.querySelector(".remove").addEventListener("click", function () {
            for (let j = 0; j < currentlyViewedGame.tasksArray.length; j++) {
                // decrement only if the task is marked as done, otherwise game status won't be affected
                if (currentlyViewedGame.tasksArray[j] === newTask) {
                    if (currentlyViewedGame.tasksArray[j].isDone) {
                        currentlyViewedGame.taskDoneCount--;
                    }
                    currentlyViewedGame.tasksArray.splice(j, 1);
                    console.log(`Current tasks done for ${currentlyViewedGame.game}: ${currentlyViewedGame.taskDoneCount}`);
                    break; // stop after removing
                }
            }

            taskList.removeChild(li);
            updateGameStatus(currentlyViewedGame);

            // refresh only the task numbering
            tCount = 0;
            const allTasks = taskList.querySelectorAll("li");
            for (let k = 0; k < allTasks.length; k++) {
                tCount++;
                let span = allTasks[k].querySelector("span");
                span.textContent = `${tCount}. ${currentlyViewedGame.tasksArray[k].task}`;
            }
            
            updatePlaceholderText();
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
    if (currentlyViewedGame) {
        // clear all tasks in the UI
        taskList.innerHTML = `<p id="placeholderTask">No tasks added yet.</p>`;

        // clear the stored data
        currentlyViewedGame.tasksArray = [];
        currentlyViewedGame.taskDoneCount = 0;
        tCount = 0;

        clearallbtn.classList.add("inactive");
        clearallbtn.classList.remove("active");
        updatePlaceholderText();

        // update the corresponding game’s status display
        updateGameStatus(currentlyViewedGame);
        alert(`${currentlyViewedGame.game}'s task list has been cleared!`);
    }
});

let lightModeOn = false;
const lonedivider = document.querySelector(".hdivider");

// the MOST efficient dark mode toggle code you've ever seen /s
lightdarktoggle.addEventListener("click", function () {
    if (!lightModeOn) {
        lightdarktoggle.textContent = "🌑";
        lightdarktoggle.style.borderColor = "#000000";
        lightdarktoggle.style.backgroundColor = "#FFFFFF";

        document.body.style.backgroundColor = "#62daffff";
        document.body.style.color = "#000000";
        lonedivider.style.borderColor = "#000000";

        entireGamesContainer.style.backgroundColor = "#9fe7fdff";
        entireGamesContainer.style.borderColor = "#000000";
        gamesInputContainer.style.backgroundColor = "#D1ECF1";
        gamesInputContainer.style.borderColor = "#000000";
        gamesContainer.style.backgroundColor = "#D1ECF1";
        gamesContainer.style.borderColor = "#000000";

        entireTasksContainer.style.backgroundColor = "#9fe7fdff";
        entireTasksContainer.style.borderColor = "#000000";
        tasksInputContainer.style.backgroundColor = "#D1ECF1";
        tasksInputContainer.style.borderColor = "#000000";
        tasksContainer.style.backgroundColor = "#D1ECF1";
        tasksContainer.style.borderColor = "#000000";

        document.querySelectorAll(".add-btn, .add-btnBacklog, .later-btn, .view").forEach(function (btn) {
            btn.style.backgroundColor = "#50A7F8";
            btn.style.color = "#000000";
            btn.style.borderColor = "#000000";
            console.log("blue hovered");
        });
        document.querySelectorAll(".remove").forEach(function (btn) {
            btn.style.backgroundColor = "#CC0303";
            btn.style.color = "#000000";
            btn.style.borderColor = "#000000";
            console.log("red hovered");
        });

        lightModeOn = true;
    } else {
        lightdarktoggle.textContent = "☀️";
        lightdarktoggle.style.borderColor = "";
        lightdarktoggle.style.backgroundColor = "";

        document.body.style.backgroundColor = "";
        document.body.style.color = "";
        lonedivider.style.borderColor = "";

        entireGamesContainer.style.backgroundColor = "";
        entireGamesContainer.style.borderColor = "";
        gamesInputContainer.style.backgroundColor = "";
        gamesInputContainer.style.borderColor = "";
        gamesContainer.style.backgroundColor = "";
        gamesContainer.style.borderColor = "";

        entireTasksContainer.style.backgroundColor = "";
        entireTasksContainer.style.borderColor = "";
        tasksInputContainer.style.backgroundColor = "";
        tasksInputContainer.style.borderColor = "";
        tasksContainer.style.backgroundColor = "";
        tasksContainer.style.borderColor = "";

        document.querySelectorAll(".add-btn, .add-btnBacklog, .later-btn, .view, .remove").forEach(function (btn) {
            btn.style.backgroundColor = "";
            btn.style.color = "";
            btn.style.borderColor = "";
        });

        lightModeOn = false;
    }

    setHoverEffects();
});

function updateGameStatus(game) {
    // this SHOULD find the correct span for every live update
    const statusSpan = findCorrectStatusSpan(game);
    if (!statusSpan) return;

    // ensure taskDoneCount is consistent
    let recomputedDone = 0;
    for (let i = 0; i < game.tasksArray.length; i++) {
        if (game.tasksArray[i].isDone) recomputedDone++;
    }
    game.taskDoneCount = recomputedDone;

    let total = game.tasksArray.length;
    let done = game.taskDoneCount;

    // if 0 tasks done = not started
    // if >0 tasks done & < total = in progress
    // if done === total = complete
    statusSpan.classList.remove("not-started", "in-progress", "complete");
    if (total === 0) {
        statusSpan.textContent = "NOT STARTED";
        statusSpan.classList.add("not-started");
        console.log("pass 1");
    } else if (done === 0) {
        statusSpan.textContent = "NOT STARTED";
        statusSpan.classList.add("not-started");
        console.log("pass 2");
    } else if (done < total) {
        statusSpan.textContent = "IN PROGRESS";
        statusSpan.classList.add("in-progress");
        console.log("pass 3");
    } else if (done === total) {
        statusSpan.textContent = "ALL COMPLETE!";
        statusSpan.classList.add("complete");
        alert(`All tasks for ${game.game} is complete!`);
        console.log("pass 4");
    } else {
        console.log("lol");
        return;
    }
};

// find the correct game's status span to change its status
function findCorrectStatusSpan(gameObject) {
    const allListItems = document.querySelectorAll("#currentGamesList li");

    // find the status span for the currently viewed game
    for (let i = 0; i < allListItems.length; i++) {
        let gamespan = allListItems[i].querySelector("span");
        if (gamespan) {
            let gameSpanText = gamespan.textContent; // text in the span
            let gameNameText = gameObject.game; // text in the array
            let matchFound = false;
            let temp = "";

            // extract game name from "Game - Genre", use a "scope" with its char length
            // then increment the scope until it finds the exact match for the game's name
            // breaks if theres 2 games with the same name
            for (let j = 0; j < gameSpanText.length - gameNameText.length + 1; j++) {
                temp = "";
                for (let k = 0; k < gameNameText.length; k++) {
                    if (gameSpanText[j + k] === gameNameText[k]) {
                        temp += gameSpanText[j + k];
                    } else {
                        break;
                    }
                }
                if (temp === gameNameText) {
                    matchFound = true;
                    break;
                }
            }

            if (matchFound) {
                return allListItems[i].querySelector(".status");
            }
        }
    }
    return null;
}

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

    // toggle light/dark mode for view tasks/x button
    if (lightModeOn) {
        li.querySelector(".view").style.backgroundColor = "#50A7F8";
        li.querySelector(".view").style.color = "#000000";
        li.querySelector(".view").style.borderColor = "#000000";
        li.querySelector(".remove").style.backgroundColor = "#CC0303";
        li.querySelector(".remove").style.color = "#000000";
        li.querySelector(".remove").style.borderColor = "#000000";
    } else {
        li.querySelector(".view").style.backgroundColor = "";
        li.querySelector(".view").style.color = "";
        li.querySelector(".view").style.borderColor = "";
        li.querySelector(".remove").style.backgroundColor = "";
        li.querySelector(".remove").style.color = "";
        li.querySelector(".remove").style.borderColor = "";
    }

    // push the moved game to the array first
    currentGamesArray.push({
        game: game,
        genre: genre,
        summary: "",
        tasksArray: [],
        taskDoneCount: 0
    });

    let gameIndex = currentGamesArray.length - 1; // get the new index

    li.querySelector(".remove").addEventListener("click", function () {
        currentList.removeChild(li);
        cCount--;

        // if currently viewed game is deleted, clear its task UI and hide it
        if (currentlyViewedGame && currentlyViewedGame.game === game) {
            taskList.innerHTML = "";
            description.textContent = "No description added yet.";
            clearallbtn.classList.add("inactive");
            clearallbtn.classList.remove("active");
            currentlyViewedGame = null;
            
            if (entireTasksContainer) {
                entireTasksContainer.style.display = "none";
            }
        }

        currentGamesArray.splice(gameIndex, 1);
        for (let i = 0; i < currentGamesArray.length; i++) {
            currentGamesArray[i].gameIndex = i;
        }
        alert(`${game} and all of its tasks have been cleared!`);
        updateCounters();
        updatePlaceholderText();
    });

    li.querySelector(".view").addEventListener("click", function () {
        // find correct game index by name
        let foundIndex = -1;
        for (let i = 0; i < currentGamesArray.length; i++) {
            if (currentGamesArray[i].game === game) {
                foundIndex = i;
                break;
            }
        }

        if (foundIndex !== -1) {
            currentGamesIndex = foundIndex;
            currentlyViewedGame = currentGamesArray[foundIndex];
            showTasksForThisGame(foundIndex);
        }

        // debug/console stuff
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
    entireTasksContainer.style.display = "";

    const gameItself = currentGamesArray[index]; // shows tasks based on game index
    currentlyViewedGame = gameItself; // ensure global var points to this object
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

        if (lightModeOn) {
            span.querySelector(".remove").style.backgroundColor = "#CC0303";
            span.querySelector(".remove").style.color = "#000000";
            span.querySelector(".remove").style.borderColor = "#000000";
        } else {
            span.querySelector(".remove").style.backgroundColor = "";
            span.querySelector(".remove").style.color = "";
            span.querySelector(".remove").style.borderColor = "";
        }

        // clear description
        span.querySelector(".remove").addEventListener("click", function () {
            description.textContent = "No description added yet.";
            gameItself.summary = ""; // clear from array
            updatePlaceholderText();
        });
    }

    // ensure taskDoneCount is consistent
    let recomputedDone = 0;
    for (let i = 0; i < gameItself.tasksArray.length; i++) {
        if (gameItself.tasksArray[i].isDone) recomputedDone++;
    }
    gameItself.taskDoneCount = recomputedDone;

    // clear existing tasks first
    let tasks = gameTasks.querySelectorAll("li");
    for (let i = tasks.length - 1; i >= 0; i--) {
        gameTasks.removeChild(tasks[i]);
    }

    tCount = 0;
    // fill task list with tasks from the selected game (and their buttons + status + functions)
    for (let i = 0; i < gameItself.tasksArray.length; i++) {
        let storedTask = gameItself.tasksArray[i];
        let taskText = storedTask.task;
        tCount++;

        // status text/class (forgot ternary isn't allowed yet)
        let statusText;
        let statusClass;
        
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

        if (lightModeOn) {
            li.querySelector(".remove").style.backgroundColor = "#CC0303";
            li.querySelector(".remove").style.color = "#000000";
            li.querySelector(".remove").style.borderColor = "#000000";
        } else {
            li.querySelector(".remove").style.backgroundColor = "";
            li.querySelector(".remove").style.color = "";
            li.querySelector(".remove").style.borderColor = "";
        }

        const statusBtn = li.querySelector(".status");
        statusBtn.addEventListener("click", function () {
            if (!storedTask.isDone) { // mark done
                statusBtn.classList.add("complete");
                statusBtn.classList.remove("not-started");
                statusBtn.textContent = "DONE";
                storedTask.isDone = true;
                gameItself.taskDoneCount++;
            } else { // mark not done
                statusBtn.classList.remove("complete");
                statusBtn.classList.add("not-started");
                statusBtn.textContent = "NOT DONE";
                storedTask.isDone = false;
                gameItself.taskDoneCount--;
            }
            updateGameStatus(gameItself);
            setHoverEffects();
        });

        // remove a task
        li.querySelector(".remove").addEventListener("click", function () {
            for (let j = 0; j < gameItself.tasksArray.length; j++) {
                if (gameItself.tasksArray[j].task === storedTask.task) {
                    if (gameItself.tasksArray[j].isDone) {
                        gameItself.taskDoneCount--;
                    }
                    gameItself.tasksArray.splice(j, 1);
                    break; // stop after removing
                }
            }

            updateGameStatus(gameItself);
            gameTasks.removeChild(li);

            // reset tCount and renumber the remaining tasks
            tCount = 0;
            const allTasks = taskList.querySelectorAll("li");
            for (let k = 0; k < allTasks.length; k++) {
                tCount++;
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

function setHoverEffects() {
    let btnhoverblue = document.querySelectorAll(".add-btn, .later-btn, .view, .add-btnBacklog");
    let btnhoverred = document.querySelectorAll(".remove");
    let btnhovertasktogglegreen = document.querySelectorAll(".status.complete");
    let btnhovertasktogglered = document.querySelectorAll(".status.not-started");
    let btnhoverlightdarktoggle = document.getElementById("lightdarktoggle");

    // might be the most inefficient code of all time
    btnhoverblue.forEach(function (btn) {
        btn.addEventListener("mouseover", function () {
            if (!lightModeOn) {
                btn.style.backgroundColor = "#50a7f8ff";
                btn.style.color = "#000000ff";
            } else {
                btn.style.backgroundColor = "#000000ff";
                btn.style.color = "#50a7f8ff";
            }
        });
        btn.addEventListener("mouseout", function () {
            if (lightModeOn) {
                btn.style.backgroundColor = "#50A7F8";
                btn.style.color = "#000000";
            } else {
                btn.style.backgroundColor = "";
                btn.style.color = "";
            }
        });
    });

    btnhoverred.forEach(function (btn) {
        btn.addEventListener("mouseover", function () {
            if (!lightModeOn) {
                btn.style.backgroundColor = "#cc0303ff";
                btn.style.color = "#000000ff";
            } else {
                btn.style.backgroundColor = "#000000ff";
                btn.style.color = "#cc0303ff";
            }
        });
        btn.addEventListener("mouseout", function () {
            if (lightModeOn) {
                btn.style.backgroundColor = "#cc0303ff";
                btn.style.color = "#000000ff";
            } else {
                btn.style.backgroundColor = "";
                btn.style.color = "";
            }
        });
    });
    btnhovertasktogglegreen.forEach(function (btn) {
        btn.addEventListener("mouseover", function () {
            btn.style.border = "2px solid #ff0000ff";
        });
        btn.addEventListener("mouseout", function () {
            btn.style.border = "";
        });
    });
    btnhovertasktogglered.forEach(function (btn) {
        btn.addEventListener("mouseover", function () {
            btn.style.border = "2px solid #00ff22ff";
        });
        btn.addEventListener("mouseout", function () {
            btn.style.border = "";
        });
    });

    btnhoverlightdarktoggle.addEventListener("mouseover", function () {
        if (!lightModeOn) {
            btnhoverlightdarktoggle.style.backgroundColor = "#ffffff";
        } else {
            btnhoverlightdarktoggle.style.backgroundColor = "#000000";
        }
    });
    btnhoverlightdarktoggle.addEventListener("mouseout", function () {
        if (lightModeOn) {
            btnhoverlightdarktoggle.style.backgroundColor = "#ffffff";
        } else {
            btnhoverlightdarktoggle.style.backgroundColor = "";
        }
    });
}

function updatePlaceholderText() {
    const placeholderGame = document.getElementById("placeholderGame");
    const placeholderBacklog = document.getElementById("placeholderBacklog");
    const placeholderDesc = document.getElementById("placeholderDesc");
    const descText = placeholderDesc.textContent.trim();
    const placeholderTask = document.getElementById("placeholderTask");

    if (placeholderGame) {
        if (cCount > 0) placeholderGame.style.display = "none";
        else placeholderGame.style.display = "";
    }

    if (placeholderBacklog) {
        if (lCount > 0) placeholderBacklog.style.display = "none";
        else placeholderBacklog.style.display = "";
    }

    if (descText === "") {
        placeholderDesc.style.display = "none";
    } else {
        placeholderDesc.style.display = "";
    }

    if (placeholderTask) {
        if (tCount > 0) placeholderTask.style.display = "none";
        else placeholderTask.style.display = "";
    }
}

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
}

// init
setHoverEffects();
updateCounters();
updatePlaceholderText();


