

function getClient (uid) {

    var uid = uid;

    return {

        N : {

            previewWindow : document.getElementById('js_preview-window')
            , connectionStatus : document.getElementById('js_connection-status')
            , btn_refresh : document.getElementById('js_menu-refresh')
            , previewClientCount : document.getElementById('js_preview-client-count')
        },

        registerSocketOnActions  : function (socket) {

            var self = this;

            socket.on('get_unique_id', function (){
                socket.emit('get_unique_id', uid);
            });

            socket.on('refresh', function (data) {

                console.log('on refresh: ',data);

                self.N.previewWindow.src = data.url;
            });


            socket.on('preview', function (data) {
                
                console.log('on preview: ',data);

                self.N.previewClientCount.innerHTML = data.watchCount;
            
            });
        },
        onConnected : function (socket) {

            this.N.connectionStatus.innerHTML = 'ok';
            this.N.connectionStatus.classList.add('status-ok');

            this.registerSocketOnActions(socket);
        

            var passbRefresh = function () {
                console.log('socket emit refresh');
                socket.emit('refresh');
            };

            this.N.btn_refresh.onclick = passbRefresh;


            function disableRefresh () {
            // slight update to account for browsers not supporting e.which
                var disableF5 = function (keyEvent) { 

                    if ((keyEvent.which || keyEvent.keyCode) == 116) {

                        keyEvent.preventDefault();

                        passbRefresh();

                      } 

                };

                // disable f5
                // console.log('block F5', mainIframe);

                window.addEventListener("keydown", disableF5, true);
                // mainIframe.document.addEventListener("keydown", disableF5, true);

            };

            disableRefresh();

        },

        notConnected : function () {

            this.N.connectionStatus.innerHTML = 'failed';
            this.N.connectionStatus.classList.add('status-failed');

        }

    };
}