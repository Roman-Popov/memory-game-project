
// >>>>>> Objects and variables declaration section >>>>>>

const btn = $('.btn');
const btnRatings = $('#ratings');
const btnRestart = $('#restart');
const leaderboard = $('.leaderboard');
const leaderTable = $('.leaderboard table');
const cards = $('.rotate');
const cardsFront = cards.find('i');
const movesCounter = $('#moves');
const displayedStarRating = $('.star-rating');
const displayedTime = $('#time');
const listOfCards = ['fa fa-university', 'fa fa-anchor', 'fa fa-bicycle', 'fa fa-paper-plane-o',
                        'fa fa-bomb', 'fa fa-cube', 'fa fa-bolt', 'fa fa-leaf',
                        'fa fa-cube', 'fa fa-bomb', 'fa fa-university', 'fa fa-anchor',
                        'fa fa-leaf', 'fa fa-bolt', 'fa fa-paper-plane-o', 'fa fa-bicycle'];
const popUpWindow = $('.pop-up');
const finMoves = $('#fin-moves');
const finTime = $('#fin-time');
const finScore = $('#fin-score');
const finStars = $('#fin-stars');
const btnClosePopUp = $('#btn-close');
const btnSubmit = $('#btn-submit');
const nameField = $('#input-name');
const nameForm = $('.print-your-name');
const cup = $('.cup');
const goldenCup = $('.golden-cup');
const silverCup = $('.silver-cup');
const bronzeCup = $('.bronze-cup');



let suffledCards;
let moves = 0;
let time = 0;
let starRating = 'gold';
let starMult = 3;
let timeTick;
let stopwatchStarted = false;
let firsCardIsChecked = false;
let currentCard;
let currentImage;
let stackCard;
let stackImage;
let timerAddFalse;
let timerRemoveFalse;
let wrongChoice = false;
let counterTrue = 0;
let yourName;

// <<<<<< End of objects and variables declaration section <<<<<<



// >>>>>> Function declaration section >>>>>>

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


function changeRating(starRating) {
    switch (starRating) {
        case 'gold':
            displayedStarRating.html('<li><i class="fa fa-star"></i></li>' +
                                     '<li><i class="fa fa-star"></i></li>' +
                                     '<li><i class="fa fa-star"></i></li>');
            displayedStarRating.css('color', 'gold');
            starMult = 3;
            break;

        case 'silver':
            displayedStarRating.html('<li><i class="fa fa-star"></i></li>' +
                                     '<li><i class="fa fa-star"></i></li>' +
                                     '<li><i class="fa fa-star-o"></i></li>');
            displayedStarRating.css('color', 'gainsboro');
            starMult = 2;
            break;

        case 'bronze':
            displayedStarRating.html('<li><i class="fa fa-star"></i></li>' +
                                     '<li><i class="fa fa-star-o"></i></li>' +
                                     '<li><i class="fa fa-star-o"></i></li>');
            displayedStarRating.css('color', 'rgb(205, 127, 50)');
            starMult = 1;
            break;

        default:
            alert('Something went wrong in function changeRating(starRating)')
            break;
    }
}


function stopwatch(state) {
    switch (state) {
        case 'start':
            let seconds = 0;
            let minutes = 0;
            timeTick = setInterval(function() {
                time += 1;
                seconds = time % 60;
                if (seconds < 10) seconds = '0' + seconds;
                minutes = Math.floor(time / 60);
                if (minutes < 10) minutes = '0' + minutes;
                displayedTime.html(minutes + ':' + seconds);
            }, 1000);
            break;

        case 'stop':
            clearInterval(timeTick);
            break;

        default:
            alert('Something went wrong in function timer(state)')
            break;
    }
}


function restart () {
    stopwatch('stop');
    stopwatchStarted = false;
    firsCardIsChecked = false;
    changeRating('gold');
    movesCounter.html(0);
    moves = 0;
    displayedTime.html('00:00');
    time = 0;
    counterTrue = 0;
    cards.removeClass('check');
    cardsFront.attr('class', '');
    suffledCards = shuffle(listOfCards);
    cup.addClass('hidden');
    setTimeout(() => {
        cardsFront.each(function (i) {
            $(this).addClass(suffledCards[i]);
        })
    }, 250);
}


function yourRatingIs(moves, time, starMult) {
    let movesRating = moves;
    let timeRating = time;

    if (moves >  40) movesRating = 40;

    if (time > 125) timeRating = 125;

    return ( (100 - (movesRating - 20) * 5) + (100 - (timeRating - 15)) * 2) * starMult
}


function toggleLeaderboard () {
    (leaderboard.css('display') === 'none') ? btnRatings.html('Hide<br> ratings')
                                            : btnRatings.html('Show<br> ratings');
    leaderboard.slideToggle();
}


function manageLeaderboard() {
    $('.data').sort(function (a, b) {
        return Number($(b).find('.lb-score').html()) - Number($(a).find('.lb-score').html());
    }).appendTo('.leaderboard table');

    $('.lb-pos').each(function (i) {
        $(this).html(i + 1);
        i += 1;
    })
}


function trackKeyboard(e) {

    // Check for TAB keypress
    if (e.keyCode === 9) {
        // SHIFT + TAB
        if (e.shiftKey) {
            if (btnClosePopUp.is(':focus')) {
                e.preventDefault();
                btnSubmit.focus();
            }
            // TAB
        } else {
            if (btnSubmit.is(':focus')) {
                e.preventDefault();
                btnClosePopUp.focus();
            }
        }
    }

    // Check for ESC keypress
    if (e.keyCode === 27) {
        closeConfirm();
    }
}


function closeConfirm() {
    if (confirm("Do you really want to close this window and not add your name to the leaderboard?")) {
        popUpWindow.addClass('hidden');
        restart();
    } else {
        return;
    }
}
// <<<<<< End of function declaration section <<<<<<



// >>>>>> Main section >>>>>>

leaderboard.hide();
restart();


cards.click(function(e) {

    // if clicked by mouse (NOT keyboard) - delete focus
    if (e.originalEvent.x != 0) {
        e.target.blur();
    }

    if (stopwatchStarted === false) {
        stopwatch('start');
        stopwatchStarted = true;
    }

    // To immediately hide wrong checked pair
    // in case they're not hidden by timeout and next pair was clicked
    if (wrongChoice === true) {
        clearTimeout(timerAddFalse);
        clearTimeout(timerRemoveFalse);
        stackCard.removeClass('check');
        currentCard.removeClass('check');
        stackImage.removeClass('false');
        currentImage.removeClass('false');
        wrongChoice = false;
    }

    currentCard = $(this);
    currentImage = currentCard.find('i');

    // To avoid counting moves in case of clicking on already checked card
    if (currentCard.hasClass('check')) {
        return;
    }

    currentCard.addClass('check');
    moves += 1;
    movesCounter.html(moves);

    // For display current star rating
    if (moves > 32) {
        changeRating('bronze');
    } else if (moves > 26) {
        changeRating('silver');
    } else {
        changeRating('gold');
    }

    // Stack current card if it's first of pair
    if (firsCardIsChecked === false) {
        stackCard = currentCard;
        stackImage = currentCard.find('i');
        firsCardIsChecked = true;

    // Second card is correct
    } else if (stackImage.attr('class') === currentImage.attr('class')) {
        stackImage.addClass('true');
        currentImage.addClass('true');
        counterTrue += 1;

        // The game has been finished
        if (counterTrue === 8) {
            stopwatch('stop');
            stopwatchStarted = false;
            finMoves.html(moves);
            finTime.html(displayedTime.html());
            finScore.html(yourRatingIs(moves, time, starMult));
            finStars.html('<i class="fa fa-star"></i>'.repeat(starMult));
            switch (starMult) {
                case 1:
                    bronzeCup.removeClass('hidden');
                    finStars.css('color', 'rgb(205, 127, 50)');
                    break;
                case 2:
                    silverCup.removeClass('hidden');
                    finStars.css('color', 'gainsboro');
                    break;
                case 3:
                    goldenCup.removeClass('hidden');
                    finStars.css('color', 'gold');
                    break;
                default:
                    break;
            }

            setTimeout(() => {
                popUpWindow.removeClass('hidden');
            }, 1000);

            // Additional timeout, because I don't know why .focus() doesn't work in previous timeout
            setTimeout(() => {
                nameField.focus();
            }, 1100);
        }

        firsCardIsChecked = false;

    // Second card is incorrect
    } else {
        timerAddFalse = setTimeout(() => {
            stackImage.addClass('false');
            currentImage.addClass('false');
        }, 250);

        timerRemoveFalse = setTimeout(() => {
            stackCard.removeClass('check');
            currentCard.removeClass('check');
            stackImage.removeClass('false');
            currentImage.removeClass('false');
        }, 2000);

        wrongChoice = true;
        firsCardIsChecked = false;
    }
});


btnRestart.click(function () {
    restart();
});


btnRatings.click(function () {
    toggleLeaderboard();
});


btnClosePopUp.click(function() {
    closeConfirm();
})


nameForm.submit(function(event) {
    event.preventDefault();
    yourName = nameField.val();
    popUpWindow.addClass('hidden');

    let yourData = '<tr class="data">' +
                        '<td class="lb-pos">99</td>' +
                        '<td class="lb-name">' + yourName + '</td>' +
                        '<td class="lb-stars">' + starMult + '</td>' +
                        '<td class="lb-moves">' + moves +'</td>' +
                        '<td class="lb-time">' + finTime.html() + '</td>' +
                        '<td class="lb-score">' + finScore.html() + '</td>' +
                   '</tr>';
    leaderTable.html(leaderTable.html() + yourData);

    manageLeaderboard();
    restart();

    if (leaderboard.css('display') === 'none') {
        toggleLeaderboard();
    }
})


popUpWindow.keydown(trackKeyboard)


btn.click(function (e) {
    // If button was pressed via mouse click
    if (e.originalEvent.x != 0) {
        btn.blur();
    }
})

// <<<<<< End of main section <<<<<<
