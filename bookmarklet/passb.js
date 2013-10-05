/* @file passb.js */

/*
javascript:(function(){var jsCode = document.createElement('script');jsCode.setAttribute('src', 'http://localhost:3333/get-client/bookmarklet');document.head.appendChild(jsCode);}());


*/

(function () {

  document.title = 'Under PassB control';

  function addSocketClientLib () {

    var 
      script = document.createElement('script')
      ;

    script.setAttribute('src', 'http://localhost:3333/get-client/socket-io-client' );

    document.body.appendChild(script);

  }


  function addToolbar () {

    var   
      toolbarRoot = document.createElement('div')
      , innerToolbar
      ;

    toolbarRoot.id = 'passb-toolbar';
    toolbarRoot.style.position = 'fixed';
    toolbarRoot.style.top = '0';
    toolbarRoot.style.right = '0';

    innerToolbar = '<ul><li><button>start</button></li><li>menu2</li><li>menu3</li></ul>';

    toolbarRoot.innerHTML = innerToolbar;

    document.body.appendChild(toolbarRoot);

  } 

  function pageRefresh () {

  }

  function disableRefresh () {
    // slight update to account for browsers not supporting e.which
    var disableF5 = function (keyEvent) { 

      if ((keyEvent.which || keyEvent.keyCode) == 116) {

        keyEvent.preventDefault();

        pageRefresh();

      } 

    };
    // disable f5
    window.addEventListener("keydown", disableF5, true);
  
  }

  function movePageToIframe () {

    var 
      iframe = document.createElement('iframe')
      ;

      iframe.setAttribute('width', '100%');
      iframe.style.border = 'none';

      iframe.setAttribute('src', window.location.href);
      iframe.setAttribute('height', document.documentElement.clientHeight);
      iframe.style.overflow = 'hidden';

      document.body.style.overflow = 'hidden';
      document.body.innerHTML = '';
      document.body.appendChild(iframe);

  }

  window.location.href = 'http://localhost:3333/preview?url='+window.location.href;

  // movePageToIframe();
  // addToolbar();
  // addSocketClientLib();

  // disableRefresh();



})();