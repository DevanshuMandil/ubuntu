var _waiter_ = [];

function makeTable(arr){
    if(arr.length == 0)
    $("#records").html('Empty Array');

    var table = '<table class="table"><thead class="thead-dark"><tr><th scope="col">ID</th><th scope="col">Name</th><th scope="col">Phone No.</th><th scope="col">Email</th><th>Delete</th></tr></thead><tbody>';
    $.each(arr, function (index, item){
        table += `<tr><th scope="row">${item.id}</th><td>${item.name}</td><td>${item.phone}</td><td>${item.email}</td><td><button type="button" id="${item.id}" class="btn btn-danger delete">Delete</button></td></tr>`;
    });

    table += '</tbody></table>';
    $("#records").html(table);
}

function fetchWaiters(){
    $.getJSON('/waiter/fetchData', function(data) {
        _waiter_ = data;
        makeTable(data);
    });
}

fetchWaiters();

$("document").ready(function(){
   $('#submit').click(function(){
    $.getJSON('/waiter/insert',{
        categoryid: $('#categoryid').val(),
        name: $('#name').val(),
        phone: $('#phone').val(),
        email: ($('#email').val()).toLowerCase(),
        }, 
        function(data){
            makeTable(data);
        });
   });

   $('#records').on('click', '.delete', function() {
    var id = $(this).attr('id');
    $.getJSON(`/waiter/delete/${id}`, function(data) {
        makeTable(data);
        });      
    });
});