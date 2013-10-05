onConnected = function (socket) {

  var 
    N_preview_window = document.getElementById('preview-window')

    , mainIframe = document.getElementById('preview-window')
    , btn_refresh = document.getElementById('js_menu-refresh')
    ;

    


    socket.on('refresh', function (data) {

        console.log('on refresh: ',data);

        mainIframe.src = data.url;
    });


    socket.on('preview', function (data) {
        
        console.log('on preview: ',data);
    
    });

    var passbRefresh = function () {
        console.log('socket emit refresh');
        socket.emit('refresh');
    };

    btn_refresh.onclick = passbRefresh;


    function setFocusThickboxIframe() {
        mainIframe.contentWindow.focus();
    }

    function disableRefresh () {
    // slight update to account for browsers not supporting e.which
        var disableF5 = function (keyEvent) { 

            if ((keyEvent.which || keyEvent.keyCode) == 116) {

                keyEvent.preventDefault();

                passbRefresh();

              } 

        };

        // disable f5
        console.log('block F5', mainIframe);

        window.addEventListener("keydown", disableF5, true);
        // mainIframe.document.addEventListener("keydown", disableF5, true);

    };

    disableRefresh();

};