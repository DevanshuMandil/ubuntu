var _data_ = [];

function makeTable(arr) {
    if (arr.length == 0) {
        $('#records').html('Empty Array');
        return;
    }
    var tableHtml = '<center><table border=1 id="table">';
    tableHtml += '<tr><th>Id</th><th>Name</th><th>Edit</th><th>Delete</th></tr>';
    $.each(arr, function (index, item) {
        tableHtml += `<tr><td>${item.id}</td><td>${item.name}</td><td><button class="edit" id="${item.id}">Edit</button></td><td><button class="delete" id="${item.id}">Delete</button></td></tr>`;
    });
    tableHtml += '</table></center>';
    $('#records').html(tableHtml);
}

function sendToServer() {
    var name = $('#name').val();
    $.getJSON(`/category/insert`, { name }, function (data) {
        makeTable(data);
    });
}

function fetchData() {
    $.getJSON('/category/fetchData', function(data) {
        _data_ = data;
        makeTable(data);
    });
}

fetchData();

$(document).ready(function () {
    $('#records').on('click', '.delete', function() {
        var id = $(this).attr('id');
        $.getJSON(`/category/delete/${id}`, function(data) {
            makeTable(data);
        });      
    });
});
