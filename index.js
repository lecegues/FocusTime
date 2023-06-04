
// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {

    //  Get the middle-box container and the button
    var startButton = document.getElementById('start');
    var middleBox = document.getElementById('middle-box-container');

    startButton.addEventListener('click', function() {
        middleBox.style.transform = 'translateX(-100%)';
        startButton.style.opacity = '0';
      });


});