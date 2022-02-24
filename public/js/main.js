var uploadButtonText = document.getElementById('uploadButtonText');
var fileUpload = document.getElementById('fileUpload');

fileUpload.onclick = function (e) {
    e.target.value = '';
};

fileUpload.onchange = function (e) {
    var fileName = e.target.files[0].name;
    uploadButtonText.innerHTML = fileName;
};