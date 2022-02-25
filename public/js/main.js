var uploadButtonText = document.getElementById('uploadButtonText');
var fileUpload = document.getElementById('fileUpload');
const uploadSubmit = document.getElementById('uploadSubmit');
var dataTableSection = document.getElementById('dataTableSection');
var ratesTableRows = document.getElementById('ratesTableRows');
var loadingWrapper = document.getElementById('loading-wrapper');

fileUpload.onclick = function (e) {
    e.target.value = '';
};

fileUpload.onchange = function (e) {
    var fileName = e.target.files[0].name;
    uploadButtonText.innerHTML = fileName;
};

uploadSubmit.onclick = function () {
    loadingWrapper.style.display = 'block';
    upload(fileUpload.files[0]);
}

function upload(file) {
    ratesTableRows.innerHTML = ''; // reset the table

    const formData = new FormData()
    formData.append('myPDF', file);

    fetch('/pdf', {
        method: 'POST',
        body: formData
    }).then(function (response) {
        return response.json();
    }).then(function (array) {
        dataTableSection.style.display = 'block';
        var rates = array.data;

        rates.forEach(element => {
            var code = element.Code;
            var currency = element.Currency;
            var bid = element.Bid;
            var ask = element.Ask;
            
            var tr = document.createElement('tr');
            var td1 = document.createElement('td');
            var td2 = document.createElement('td');
            var td3 = document.createElement('td');
            var td4 = document.createElement('td');

            td1.textContent = code;
            td2.textContent = currency;
            td3.textContent = bid;
            td4.textContent = ask;

            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            tr.appendChild(td4);

            ratesTableRows.appendChild(tr);
        });

        fileUpload.value = "";
        uploadButtonText.innerHTML = "Select a PDF file ..."

        //Hide preloader
        loadingWrapper.style.display = 'none';
    });
};

