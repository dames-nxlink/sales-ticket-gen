// This file only contains code to make all the copy buttons functional

function addCopy ($target){
    $target.select();
    document.execCommand("copy");
}


// Install Ticket
$("#at-sub-btn").on('click', function() {addCopy($("#atSubject"))})
$("#at-bod-btn").on('click', function () {addCopy($("#atBody"))})
$("#si-sub-btn").on('click', function() {addCopy($("#siSubject"))})
$("#si-bod-btn").on('click', function () {addCopy($("#siBody"))})