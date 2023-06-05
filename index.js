
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

    //  Get the middle-box container and the button
    var startButton = document.getElementById('start');
    var middleBox = document.getElementById('middle-box-container');
    var playerContainer = document.getElementById('player-container');

    // after pressing start
    startButton.addEventListener('click', function() {
        middleBox.style.transform = 'translateX(-100%)';
        startButton.style.opacity = '0';
        playerContainer.style.display ='block';
        
        
        // initiate youtube player
        initializePlayer();

        // start the timer
        startTimer();
        
      });


    // dropdown event listeners
    // Get the dropdown items
    var dropdownItems = document.getElementsByClassName("dropdown-item");

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

    // Set up timer
    var timerInterval;
    var totalSeconds = 0;

    function startTimer() {
        // Get the session duration inputs
        var hoursInput = document.getElementById('session-hours');
        var minutesInput = document.getElementById('session-minutes');
        var secondsInput = document.getElementById('session-seconds');

        // Calculate the total session duration in seconds
        var hours = parseInt(hoursInput.value) || 0;
        var minutes = parseInt(minutesInput.value) || 0;
        var seconds = parseInt(secondsInput.value) || 0;
        totalSeconds = (hours * 3600) + (minutes * 60) + seconds;

        // Display the initial timer value
        updateTimerDisplay();

        // Disable the session duration inputs
        hoursInput.disabled = true;
        minutesInput.disabled = true;
        secondsInput.disabled = true;

        // Start the timer interval
        timerInterval = setInterval(function() {
        // Decrease the total seconds by 1
        totalSeconds--;

        // Update the timer display
        updateTimerDisplay();

        // Stop the timer when it reaches 0
        if (totalSeconds <= 0) {
            stopTimer();
        }
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval);
    }

    function updateTimerDisplay() {
        var hours = Math.floor(totalSeconds / 3600);
        var minutes = Math.floor((totalSeconds % 3600) / 60);
        var seconds = totalSeconds % 60;

        // Format the timer value as HH:MM:SS
        var formattedTime = formatTime(hours) + ':' + formatTime(minutes) + ':' + formatTime(seconds);

        // Update the timer display element
        document.getElementById('timer-display').textContent = formattedTime;
    }

    function formatTime(value) {
        return value.toString().padStart(2, '0');
    }

});