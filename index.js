
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


/** Youtube API Backend
 *  1. Obtain what user chose in dropdown menu
 *  2. Search for keywords on youtube sorted by popularity and 2+ hour long filter depending on what they chose
 *          - Classical Music: Classical Music (2+ hour)
 *          - Piano: BigRicePiano (2+ Hours)
 *          - Lofi: Lofi Music
 * 
 */