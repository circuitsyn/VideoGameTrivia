let rate;
let index;
let clockRunning = false;
let gameVariables = {
    wrongMsg: "You got it wrong. You gotta be faster next time! The correct answer is ",
    correctMsg: "You got it right! Well done. The answer is ",
    correct: 0,
    incorrect: 0,
    missed: 0,
    timeLeft: 30,
    qCounter: 0,
    muted: false,
    endImage: '<img class="images mb-3" src="./assets/images/End.gif" alt="End of Game">',

    //method to push and track time left to make a choice
    startTimer: () => {
        if(!clockRunning){
        rate = setInterval(gameVariables.count, 1000);
        }
    },

    count: () => {
        gameVariables.timeLeft--;
        $('#time').html('Time Remaining: ' + gameVariables.timeLeft + ' Seconds!');

        // check if value is 0 to end turn
        if (gameVariables.timeLeft == 0) {
            gameVariables.stopTimer();
            gameVariables.clearDivs();
            gameVariables.pushMissed();
            gameVariables.qCounter++;
        }
    },    

    // stop timer function
    stopTimer: () => {
        clearInterval(rate);
    },

    // logic for game
    decide: (chosenAns, index) => {

        // Checking of answer is correct
        if (chosenAns == gamePlayArray[index].answer) {
            gameVariables.correct++;
            gameVariables.updateScore();
            gameVariables.animateCSS("#remainingBox", "bounce");
            gameVariables.animateCSS("#winBox", "bounce");
            gameVariables.clearDivs();
            gameVariables.stopTimer();
            gameVariables.pushCorrect();
            gameVariables.qCounter++;   
        }
    
        // Actions to take if wrong
        else {
            gameVariables.incorrect++;
            gameVariables.animateCSS("#remainingBox", "bounce");
            gameVariables.animateCSS("#lossBox", "bounce");
            gameVariables.updateScore();
            gameVariables.stopTimer();
            gameVariables.clearDivs();
            gameVariables.pushWrong();
            gameVariables.qCounter++;
        }
    },

    //Method to play audio when choice is made or missed 
    playAudio: () => {
        let soundClip = $("#audioGameClip");
        $(soundClip).attr("src", "./assets/audio/" + gamePlayArray[gameVariables.qCounter].audio)
        console.log('muted status', gameVariables.muted);
        if (gameVariables.muted == true) {
            console.log('Already muted so no clip for you!')
        }
        else {
            soundClip.play();
        }  
    },
    
    // TODO:
    // ***** check the concatination of the audio string added
    // ***** check and see the clip that is being stored ins ound clip and triggered
    // ***** check the same attributures fo rmute flow
    // place muted method on all continue click buttons
    // place audio play on all 3 missed, wrong, and correct popup modal triggers
    

    // Muting the volume of the playing clip if any continue type button is clicked
    muteOnNextClick: () => {
        let soundClip = gamePlayArray[gameVariables.qCounter].audio;
        console.log('muted status', gameVariables.muted)
        if (gameVariables.muted == true) {
            console.log('Already muted so no clip for you!')
        }
        else {
            soundClip.stop();
        }  
    },
    
    //Method to clear div's
    clearDivs: () => {
        $('#optionSelect').empty();
        $('#question').empty();
        $('#time').empty();
        $('#modalResults').empty();
        $("#modalTitle").empty();
        $("#modalMsg").empty();
        $("#modalImg").empty();
        $("#modalTime").empty();
        $("#modalFooter").empty();
        // $('#time').empty();
    },

    //Method to push question and choices from array
    pushQs: () => {

        let index = gameVariables.qCounter;
        gameVariables.clearDivs();

        // Append question text to question div
        $("#question").text((gamePlayArray[index].question));

        gamePlayArray[index].choices.forEach((choice) => {
            let button = $("<button>", { "class": "m-2 choices btn btn-dark" });
            $(button).text(choice);
            $("#optionSelect").append(button);           
        })
    },

    // function to update score attributes in the floating mario boxes
    updateScore: () => {
        let reamining = (gamePlayArray.length - gameVariables.correct - gameVariables.incorrect - gameVariables.missed)
        $('#winBox').text(gameVariables.correct);
        $('#lossBox').text(gameVariables.incorrect);
        $('#remainingBox').text(reamining);
        $('#missBox').text(gameVariables.missed);
    },

    //Push wrong response screen
    pushWrong: () => {

        // check to see if there are no more questions and push toward the results page
        if (gameVariables.qCounter == (gamePlayArray.length - 1)) {
            
            let infoResultButton = $("<button>", { "id": "resultBtn", "class": "choices btn btn-dark", "data-dismiss": "modal", "type": "button" });
                $(infoResultButton).text("Results");
                $("#modalFooter").append(infoResultButton);    
        }
        else {
            // build next button
            let infoButton = $("<button>", { "id": "nextQBtn", "class": "choices btn btn-dark", "data-dismiss": "modal", "type": "button" });
                $(infoButton).text("Next Question");
                $("#modalFooter").append(infoButton);    
        }

        // Append Data
        $("#modalTitle").text("Incorrect!");
        $('#modalMsg').append(gameVariables.wrongMsg + "\"" + gamePlayArray[gameVariables.qCounter].answer + "\"!");
        $('#modalTime').append("Time Left: " + gameVariables.timeLeft);
        $('#modalImg').append(gamePlayArray[gameVariables.qCounter].gif);
        $("#infoModal").modal({ show: true, backdrop: 'static', keyboard: false, focus: true });  
    },

    //Push correct response screen
    pushCorrect: () => {

        // check to see if there are no more questions and push toward the results page
        if (gameVariables.qCounter == (gamePlayArray.length - 1)) {
            
            let infoResultButton = $("<button>", { "id": "resultBtn", "class": "choices btn btn-dark", "data-dismiss": "modal", "type": "button" });
                $(infoResultButton).text("Results");
                $("#modalFooter").append(infoResultButton);    
        }
        else {
            
            // build next button
            let infoButton = $("<button>", { "id": "nextQBtn", "class": "choices btn btn-dark", "data-dismiss": "modal", "type": "button" });
                $(infoButton).text("Next Question");
                $("#modalFooter").append(infoButton);   
        }

        // Append Data
        $("#modalTitle").text("Correct!");
        $('#modalMsg').append(gameVariables.correctMsg + "\"" +  gamePlayArray[gameVariables.qCounter].answer + "\"!");
        $('#modalTime').append("Time Left: " + gameVariables.timeLeft)
        $('#modalImg').append(gamePlayArray[gameVariables.qCounter].gif);
        $("#infoModal").modal({ show: true, backdrop: 'static', keyboard: false, focus: true });
        // playAudio();
    },

    // function to build the missed modal components and trigger it
    pushMissed: () => {

        // check to see if there are no more questions and push toward the results page
        if (gameVariables.qCounter == (gamePlayArray.length - 1)) {
            
            let infoResultButton = $("<button>", { "id": "resultBtn", "class": "choices btn btn-dark", "data-dismiss": "modal", "type": "button" });
                $(infoResultButton).text("Results");
                $("#modalFooter").append(infoResultButton);    
        }
        else {

            // build next button
            let infoMissButton = $("<button>", { "id": "nextQBtn", "class": "choices btn btn-dark", "data-dismiss": "modal", "type": "button"});
                $(infoMissButton).text("Next Question");
                $("#modalFooter").append(infoMissButton);    
        }

        gameVariables.missed++;
        gameVariables.animateCSS("#remainingBox", "bounce");
        gameVariables.animateCSS("#missBox", "bounce");
        gameVariables.updateScore();

        // Append Data
        $("#modalTitle").text("Missed!");
        $('#modalMsg').append("You missed it! Let's try on the next Question!");
        $('#modalTime').append("Time Left: " + gameVariables.timeLeft);
        $('#modalImg').html('<img class="images" src="./assets/images/missed.gif" alt="luigi missed"></img>');
        $("#infoModal").modal({ show: true, backdrop: 'static', keyboard: false, focus: true });
    },

    // Method to push results modal and details
    pushResults: () => {

        // build restart button
        let resetButton = $("<button>", { "id": "playAgainBtn", "class": "choices btn btn-dark", "type": "button" });
            $(resetButton).text("Play Again!");
            $("#modalFooter").append(resetButton);  

        // Attach asthetic looking boxes for results
        $("#modalResults").html(`
            <div class="container">
                <div class="row text-center">
                    <div id="finalImg" class="col-12">

                    </div>
                </div>
                <div class="row text-center">
                    <div id="capRes1" class="col-4">
                        <h2 id="missBoxResult" class="m-auto p-2">
                        </h2>
                        <figcaption class="figure-caption txtShadow text-center">Miss</figcaption>
                    </div>
                    <div id="capRes2" class="col-4">
                        <h2 id="lossBoxResult" class="m-auto p-2">  
                        </h2>
                        <figcaption class="figure-caption txtShadow text-center">Lose</figcaption>
                    </div>
                    <div id="capRes3" class="col-4">
                        <h2 id="winBoxResult" class="m-auto p-2">
                        </h2>
                        <figcaption class="figure-caption txtShadow text-center">Win</figcaption>
                    </div>
                </div>
            </div>        
        `);

        // Append Data
        $("#modalTitle").text("Final Results!");
        $('#finalImg').append(gameVariables.endImage);
        $('#winBoxResult').text(gameVariables.correct);
        $('#lossBoxResult').text(gameVariables.incorrect);
        $('#missBoxResult').text(gameVariables.missed);
        $("#infoModal").modal('show');
        gameVariables.animateCSS("#capRes1", "slideInLeft");
        gameVariables.animateCSS("#capRes2", "slideInLeft");
        gameVariables.animateCSS("#capRes3", "slideInLeft");
    },  

    // function used to animate objects
    animateCSS: (element, animationName, callback) => {
        const node = document.querySelector(element)
        node.classList.add('animated', animationName)
    
        function handleAnimationEnd() {
            node.classList.remove('animated', animationName)
            node.removeEventListener('animationend', handleAnimationEnd)
    
            if (typeof callback === 'function') callback()
        }
    
        node.addEventListener('animationend', handleAnimationEnd)
    }
};

//~~*~~*~~ Question Array Variables ~~*~~*~~

var gamePlayArray = [
    // Sonic
    {
        question: 'Name a famous SEGA character that is ultra fast, was a flagship for the system and has over 100 titles to date!',
        choices: ['A. Purple Durple', 'B. Buzby', 'C. Sonic', 'D. Tails'],
        gif: '<img class="images" src="./assets/images/Sonic.gif" alt="Sonic The Hedgehog">',
        audio: "sonic.mp3",
        answer: 'C. Sonic'
        
    },
    // Mario
    {
        question: 'Name a famous Nintendo Character that is from a famous 2d side scoller and is always trying to rescue a princess!',
        choices: ['A. Mario', 'B. Donkey Kong', 'C. Spider-man', 'D. The Terminator'],
        gif: '<img class="images" src="./assets/images/Mario.gif" alt="Mario">',
        audio: "mario.mp3",
        answer: 'A. Mario'
    },
    // Crash
    {
        question: 'What terrestrial marsupial would work through portals and spin in order to defeat the evil Dr. Neo Cortex!',
        choices: ['A. Pickle Rick', 'B. Donkey Kong', 'C. Crash Bandicoot', 'D. Toad'],
        gif: '<img class="images" src="./assets/images/crashBandicoot.gif" alt="Crash Bandicoot">',
        audio: "crashBandicoot.mp3",
        answer: 'C. Crash Bandicoot'
    },
    // comixZone
    {
        question: 'A video game famous for traversing the pages of graphic novels in its gameplay.',
        choices: ['A. Teenage Mutant Ninja Turtles', 'B. ComixZone', 'C. Spider-man', 'D. Paperboy'],
        gif: '<img class="images" src="./assets/images/comixZone.gif" alt="Comix Zone">',
        audio: "comixZone.mp3",
        answer: 'B. ComixZone'
    },
    // earthWormJim
    {
        question: 'Can you name a galaxy crusading annelid taking on the evils of the universe?',
        choices: ['A. Earthworm Jim', 'B. Bob Barker', 'C. Cypher', 'D. Galactic Earthworm Crusader'],
        gif: '<img class="images" src="./assets/images/earthwormJim.gif" alt="Earthworm Jim">',
        audio: "earthwormJim.mp3",
        answer: 'A. Earthworm Jim'
    },
    // masterChief
    {
        question: 'What famous super soldier fought the covenant and the flood just for starters while protecting the planet earth?',
        choices: ['A. Tom Clancy', 'B. Logan', 'C. Batman', 'D. Master Chief'],
        gif: '<img class="images" src="./assets/images/masterChief.gif" alt="Master Chief">',
        audio: "halo.mp3",
        answer: 'D. Master Chief'
    },
    // mortalCombat
    {
        question: 'Name a famous video game series that not only was a great fighting game, but was famous for its finishing moves!',
        choices: ['A. Street Fighter', 'B. Mortal Combat', 'C. Marvel vs. Capcom', 'D. Battle Toads'],
        gif: '<img class="images" src="./assets/images/mortalCombat.gif" alt="Mortal Combat">',
        audio: "mortalKombat.mp3",
        answer: 'B. Mortal Combat'
    },

];


$(document).ready(function() {

    // Setup Scores to Start
    gameVariables.updateScore();
    gameVariables.animateCSS("#winBox", "bounce");
    gameVariables.animateCSS("#lossBox", "bounce");
    gameVariables.animateCSS("#missBox", "bounce");
    gameVariables.animateCSS("#remainingBox", "bounce");
    gameVariables.animateCSS("#startbtn", "pulse");

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Clickable Button Logic Section ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Start game on start button click
    $("#startbtn").click(function(e){
        e.preventDefault();
        $('#startbtn').css({"display":"none"});
        $('#startText').css({"display":"none"});
        
        //Clearing out Divs as precaution each time
        gameVariables.clearDivs();
        
        //push question details
        gameVariables.pushQs();
        
        //timer countdown
        gameVariables.startTimer();
        
    });
        
    // Button choice click logic
    $("#optionSelect").on("click", ".choices", function(e){
        e.preventDefault();
        // Capture value of clicked button
        let chosenAns = $(this).text();
        let index = gameVariables.qCounter;
        gameVariables.clockRunning = true;
        gameVariables.decide(chosenAns, index);
    });

    // Reset play again button logic
    $("#modalFooter").on("click", "#playAgainBtn", function(e){
        e.preventDefault();
        gameVariables.animateCSS("#capRes1", "slideOutRight");
        gameVariables.animateCSS("#capRes2", "slideOutRight");
        gameVariables.animateCSS("#capRes3", "slideOutRight");
        setTimeout(function() { 
            $("#infoModal").modal("hide"); 
            // $("#infoModal").modal('hide');

            //Clearing out Divs as precaution each time
            gameVariables.clearDivs();
            
            // reset game variables
            gameVariables.missed = 0;
            gameVariables.correct = 0;
            gameVariables.incorrect = 0;
            $('#remainingBox').text(gamePlayArray.length);
            gameVariables.qCounter = 0;
            gameVariables.timeLeft = 30;
            gameVariables.updateScore();
            $('#startbtn').css({"display":"block"});
            $('#startText').css({"display":"block"});
        }, 500);
    });

    // Next question button click logic
    $("#modalFooter").on("click", "#nextQBtn", function(e){
        e.preventDefault();
        gameVariables.pushQs();
        gameVariables.startTimer()
        $("#infoModal").modal('hide');
        // reset timer
        gameVariables.timeLeft = 30;
    });
    
    // Results button logic
    $("#modalFooter").on("click", "#resultBtn", function(e){
        e.preventDefault();
        gameVariables.clearDivs();
        gameVariables.pushResults();  
    });

    // Soundtrack button logic
    $(".scoreArea").on("click", "#soundtrack", function(e){
        e.preventDefault();
        statusCheck = $(this).attr("data-status");

        // conditional to alternate playing music
        if (statusCheck == "true") {
            $(this).attr("data-status", "false");            
            $("#audioSoundtrack")[0].pause();
            $("#soundtrack").attr("src", "assets/images/themeOff.png")
            $("#soundtrack").css({"animation-iteration-count":"unset"});
        }
        else if (statusCheck != "true") {
            $(this).attr("data-status", "true");
            $("#audioSoundtrack")[0].play();
            $("#soundtrack").attr("src", "assets/images/themeOn.png")
            gameVariables.animateCSS("#soundtrack", "pulse");
            $("#soundtrack").css({"animation-iteration-count":"infinite"});
        }

    });

    // Speaker mute button logic
    $(".scoreArea").on("click", "#speaker", function(e){
        e.preventDefault();
        statusCheck = $(this).attr("data-status");
        
        // conditional to alternate playing music
        if (statusCheck == "true") {
            gameVariables.muted = false;
            $(this).attr("data-status", "false");
            let soundArr = [...$('.audioClips')];
            soundArr.forEach(function(soundItem){
                soundItem.volume = 0;
            });
            $("#speaker").attr("src", "assets/images/SpeakerOff.png");
            $("#speaker").css({"animation-iteration-count":"unset"});
        }
        else if (statusCheck != "true") {
            gameVariables.muted = true;
            $(this).attr("data-status", "true");
            let soundArr = [...$('.audioClips')];
            soundArr.forEach(function(soundItem){
                soundItem.volume = 1;
            });
            $("#speaker").attr("src", "assets/images/speakerOn.png");
            gameVariables.animateCSS("#speaker", "pulse");
            $("#speaker").css({"animation-iteration-count":"infinite"});
        }
    });

}); 
    
 



