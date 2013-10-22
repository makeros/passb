var initPagesViews = function () {
  
  var N_count = document.getElementById('js_pages-in-view');
  var count = parseInt(N_count.dataset.count);

  var pagesViews = new JustGage({
    id: "js_pages-in-view", 
    value: count, 
    min: 0,
    max: 100,
    title: "Pages in use",
    label: "",    
    gaugeWidthScale: 0.2          
  });

};

window.onload = function () {

  var formUniqueId = document.getElementById('form_unique-id');
  var btnInstallBookmarklet = document.getElementById('js_install-bookmarklet');

  formUniqueId.onsubmit = function (eventSubmit) {

    console.log(eventSubmit);

    return false;

  };

  btnInstallBookmarklet.onclick = function () {
    return false;
  };


  initPagesViews();

};