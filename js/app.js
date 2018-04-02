
// >>>>>> Objects and variables declaration section >>>>>>

const btnRatings = $('#ratings');
const btnRestart = $('#restart');
const leaderboard = $('.leaderboard');
const cards = $('.rotate');
const cardsFront = cards.find('i');
const movesCounter = $('#moves');
const displayedStarRating = $('.star-rating');
const displayedTime = $('#time');
const listOfCards = ['fa fa-university', 'fa fa-anchor', 'fa fa-bicycle', 'fa fa-paper-plane-o',
                        'fa fa-bomb', 'fa fa-cube', 'fa fa-bolt', 'fa fa-leaf',
                        'fa fa-cube', 'fa fa-bomb', 'fa fa-university', 'fa fa-anchor',
                        'fa fa-leaf', 'fa fa-bolt', 'fa fa-paper-plane-o', 'fa fa-bicycle']


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
    (leaderboard.css('display') === 'none') ? $(this).html('Hide<br> ratings')
                                            : $(this).html('Show<br> ratings');
    leaderboard.slideToggle();
}

// <<<<<< End of function declaration section <<<<<<



// >>>>>> Main section >>>>>>

leaderboard.hide();
restart();


cards.click(function() {
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
            yourRatingIs(moves, time, starMult)
            setTimeout(() => {
                alert('You have won!');
            }, 1700);
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

// <<<<<< End of main section <<<<<<
