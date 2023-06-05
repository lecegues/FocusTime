
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
function onYouTubeIframeAPIReady(){
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
    searchVideos('BigRicePiano').then(function(videos) {
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