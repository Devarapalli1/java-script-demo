function displaySchedule(event) {
    event.preventDefault();
    console.log("entered.")
    var data = new FormData($('#formData').get(0));
    const options = {
        method: 'POST',
        headers: {
            'Accept': 'text/html',
        },
        mode: 'same-origin',
        body: data
    }
    fetch($('#formData').attr("action"), options)
        .then(response => response.json())
        .then(htmlData => {
            console.log(typeof (htmlData));
            console.log(htmlData.hasOwnProperty("data"));
            document.getElementById("end").innerHTML = htmlData["data"]
        })
        .catch(err => alert("something went wrong."));
    return false;
}