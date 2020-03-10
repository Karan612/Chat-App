
let endpoint = "http://localhost:3000/api";

var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() {
    if (xhr.readyState == XMLHttpRequest.DONE) {
        console.log(xhr.responseText);
    }
}
xhr.open('GET', `${{endpoint}}/get-history`, true);
xhr.send(null);