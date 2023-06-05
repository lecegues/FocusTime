
/* ----------------- Load Youtube API Client Library ----------------- */
gapi.load('client',initYoutubeAPI);

// Initialize Youtube API Client
function initYoutubeAPI(){
    gapi.client.init({
        apiKey: 'AIzaSyBa-ycTgrwwaZDcSBATnpF6Ps3g68AytGM',
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'],
        }).then(function() {
            // API Initialization succesful
            console.log('Youtube API Client Succesfully Loaded');

            // Call searchVideos functions
            // searchVideos('BigRicePiano');
        }, function(error){
            // API Initialization failed
            console.error('Error loading youtube API:', error);

        });
}

// Search for videos based on a keyword
function searchVideos(keyword){
    return gapi.client.youtube.search.list({
        part: 'snippet',
        q: keyword,
        type: 'video',
        maxResults:5,

        // sort & filter videos
        order: 'viewCount',    // sort by view count
        videoDuration: 'long', // long videos
    }).then(function(response){

        var videos = response.result.items;
        console.log('videos found: ', videos); // console
        return videos;

    }, function(error){
        console.error('Error searching for videos', error); // console
        return [];
    });

}


/* ----------------- Load Youtube API Player Library ----------------- */
let player; //hpld player object

// automatically executes
function initializePlayer(){
    console.log("Youtube API Player Succesfully Loaded"); // console

    player = new YT.Player("player",{
        height: 500,
        width: 500,
        playerVars:{
            playersinline:1,
            autoplay:1,
            controls:0,
            disablekb:1,
        },
        events:{
            onReady:onPlayerReady,
            onStateChange:onPlayerStateChange
        }
    });
};



/**
 * Called when youtube player is ready to play a video
 */
function onPlayerReady(event) {

    // searchVideos(var) should depend on what user chose. Retrieve items
    var selectedMusicPreference = document.getElementById("selectedOptionText").textContent;

    if (selectedMusicPreference == "piano"){
        selectedMusicPreference = "BigRicePiano";
    }
    else if (selectedMusicPreference == "classical"){
        selectedMusicPreference = "classical study music"
    }
    else if (selectedMusicPreference == "lofi"){
        selectedMusicPreferecne = "Lofi study music"
    }
    else{
        selectedMusicPreference = "BigRicePiano";
    }
    console.log(selectedMusicPreference);
    searchVideos(selectedMusicPreference).then(function(videos) {
      var videoIds = videos.map(function(video) {
        return video.id.videoId;
      });
      console.log('Video IDs:', videoIds);
      event.target.cuePlaylist(videoIds); // Queue the videos in the player
      event.target.playVideo(); // Play the first video
    });
  }

/**
 * Called when youtube player state changes (starts playing or stops)
 */
var done = false;
function onPlayerStateChange(event){
    if (event.data == YT.PlayerState.PLAYING && !done){
        done=true;
    }

    // add functions here
}


/* ----------------- Normal Functions ----------------- */ 
document.addEventListener('DOMContentLoaded', () => {

    /* -- Automatic Dropdown Menu Update -- */
    var dropdownItems = document.getElementsByClassName("dropdown-item"); // get dropdown items

    // Add click event listeners to the dropdown items
    for (var i = 0; i < dropdownItems.length; i++) {
    dropdownItems[i].addEventListener("click", function(event) {
        // Prevent the default link behavior
        event.preventDefault();
        
        // Get the selected option value
        var selectedOption = this.getAttribute("data-value");
        
        // Update the selected option display
        document.getElementById("selectedOptionText").textContent = selectedOption;
        
    });
    }

    //  Get the middle-box container and the button
    var startButton = document.getElementById('start');
    var middleBox = document.getElementById('middle-box-container');
    var playerContainer = document.getElementById('player-container');

    /* -- Start Button is Pressed --*/ 
    startButton.addEventListener('click', function() {
        middleBox.style.transform = 'translateX(-100%)';
        startButton.style.opacity = '0';
        playerContainer.style.display ='block';
        
        // initiate youtube player
        initializePlayer();

        // disable music preference as well
        var musicButton = document.getElementById('musicDropdown');
        musicButton.disabled = true;

        // start the timer
        getTimerValues();
        
      });

    /* ------- Set up timer ------- */
    var timerInterval, breakTimerInterval;
    var sessionTotalSeconds, workTotalSeconds, breakTotalSeconds = 0;
    var originalWorkTotalSeconds,originalBreakSeconds;
    var isPaused = false;
    var remainingSeconds = 0;

    function getTimerValues(){
        // Get the session duration inputs
        var sessionHoursInput = document.getElementById('session-hours');
        var sessionMinutesInput = document.getElementById('session-minutes');
        var sessionSecondsInput = document.getElementById('session-seconds');

        // Get the work duration inputs
        var workHoursInput = document.getElementById('work-hours');
        var workMinutesInput = document.getElementById('work-minutes');
        var workSecondsInput = document.getElementById('work-seconds');

        // Get the break duration inputs
        var breakHoursInput = document.getElementById('break-hours');
        var breakMinutesInput = document.getElementById('break-minutes');
        var breakSecondsInput = document.getElementById('break-seconds');

        // TODO function to calculate duration in seconds
        // Calculate the total session duration in seconds
        var sessionHours = parseInt(sessionHoursInput.value) || 0;
        var sessionMinutes = parseInt(sessionMinutesInput.value) || 0;
        var sessionSeconds = parseInt(sessionSecondsInput.value) || 0;
        sessionTotalSeconds = (sessionHours * 3600) + (sessionMinutes * 60) + sessionSeconds;

        // Calculate the work duration in seconds
        var workHours = parseInt(workHoursInput.value) || 0;
        var workMinutes = parseInt(workMinutesInput.value) || 0;
        var workSeconds = parseInt(workSecondsInput.value) || 0;
        workTotalSeconds = (workHours * 3600) + (workMinutes * 60) + workSeconds;
        originalWorkTotalSeconds = workTotalSeconds;

        // Calculate the break duration in seconds
        var breakHours = parseInt(breakHoursInput.value) || 0;
        var breakMinutes = parseInt(breakMinutesInput.value) || 0;
        var breakSeconds = parseInt(breakSecondsInput.value) || 0;
        breakTotalSeconds = (breakHours * 3600) + (breakMinutes * 60) + breakSeconds;
        originalBreakSeconds = breakTotalSeconds;
        
        // Disable the session duration inputs, work duration inputs, 
        sessionHoursInput.disabled = true;
        sessionMinutesInput.disabled = true;
        sessionSecondsInput.disabled = true;
        workHoursInput.disabled = true;
        workMinutesInput.disabled = true;
        workSecondsInput.disabled = true;
        breakHoursInput.disabled = true;
        breakMinutesInput.disabled = true;
        breakSecondsInput.disabled = true;

        startTimer();

    }

    function startTimer() {
        // Display the initial timer value
        updateTimerDisplay();

        // Timer starts -- put check functions while timer is going in here
        timerInterval = setInterval( function() {

            if (isPaused){
                return; // function does nothing if paused
            }

            // Decrease seconds by 1
            sessionTotalSeconds--;
            workTotalSeconds--;
        
            // Update the timer display
            updateTimerDisplay();

            // Check if 0: stop the timer
            if (sessionTotalSeconds <= 0 || workTotalSeconds <= 0) {
  
                // Break Timer shows up
                startBreak();
                // reset workTotalSeconds
                workTotalSeconds = originalWorkTotalSeconds;


            }

        }, 1000);
    }

    function stopTimer() {

        // TODO keep the timer value
        isPaused = true;
        clearInterval(timerInterval);
        remainingSeconds = sessionTotalSeconds;
    }

    function resumeTimer(){
        clearInterval(breakTimerInterval);
        isPaused = false;
        sessionTotalSeconds = remainingSeconds;
        startTimer();

    }

    function updateTimerDisplay() {
        var hours = Math.floor(sessionTotalSeconds / 3600);
        var minutes = Math.floor((sessionTotalSeconds % 3600) / 60);
        var seconds = sessionTotalSeconds % 60;

        // Format the timer value as HH:MM:SS
        var formattedTime = formatTime(hours) + ':' + formatTime(minutes) + ':' + formatTime(seconds);

        // Update the timer display element
        document.getElementById('timer-display').textContent = formattedTime;

        // do the same with the break timer value
        hours = Math.floor(breakTotalSeconds / 3600);
        minutes = Math.floor((breakTotalSeconds % 3600) / 60);
        seconds = breakTotalSeconds % 60;

        formattedTime = formatTime(hours) + ':' + formatTime(minutes) + ':' + formatTime(seconds);
        document.getElementById('break-display').textContent = formattedTime;
    }

    function formatTime(value) {
        return value.toString().padStart(2, '0');
    }

    /**
     * Function that will start the break timer
     */
    function startBreak(){
        stopTimer();
        breakTotalSeconds = originalBreakSeconds;

        breakTimerInterval = setInterval( function() {

            // need to start the break timer:
            breakTotalSeconds--;

            if (breakTotalSeconds <= 0){
                resumeTimer();
            }
            
            // display initial timer value
            updateTimerDisplay();

        }, 1000);
        
    }

});