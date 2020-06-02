var socket = io.connect();

var _category_ = [];

var options = `<option value='accepted'>accepted</option><option value='cooking'>cooking</option><option value='on the way'>On the way</option>`;

function getCategory(){
    $.getJSON('/category/fetchData',function(data){
        _category_ = data;
        $.each(data, function(index, item){
            $('#categoryid').append($('<option>').val(item.id).text(item.name));
        });
    });
}

function filterByCategory(data) {
    var filteredOrders = data.filter(item => item.categoryid == $('#categoryid').val());
    return filteredOrders;
}

function makeTable(arr){
    console.log(arr);
    //var options = `<option value='accepted'>accepted</option><option value='cooking'>cooking</option><option value='on the way'>On the way</option>`;
    if(arr.length == 0)
    $("#records").html('Empty Array');

    var table = '<table class="table" id="orders"><thead class="thead-dark"><tr><th scope="col">ID</th><th scope="col">Name</th><th scope="col">Offerprice</th><th>Options</th><th scope="col">Status</th></tr></thead><tbody>';
    $.each(arr, function (index, item){
        table += `<tr><th scope="row">${item.id}</th><td>${item.name}</td><td>${item.offerprice}</td><td><select class='chefOptions' orderid=${item.id}>${options}</select></td><td><span id=o${item.id}><h3>Pending</h3></span></td></tr>`;
    });

    table += '</tbody></table>';
    $("#orders").html(table);
}

// function orderFilter(data)
// {
//     var temp;
//     $.each(data[1],function(index, item){
//         if(item.categoryid == $())
//     });
// }

$('document').ready(function(){
    getCategory();
    $("#submit").click(function(){
        var id = $("#categoryid").val();
        $.getJSON(`/chef/getOrders/${id}`, function(data) {
            makeTable(data);
        });   
    });

    socket.on('start', function(data) {
        console.log('connection', data);
    });

    socket.on('newOrders', function(data) {
        var item = filterByCategory(data[1]);
        
        for(var i=item.length -1; i >= 0 ;i--)
        {
            $("#orders tbody").append(`<tr><th scope="row">${item[i].id}</th><td>${item[i].name}</td><td>${item[i].offerprice}</td><td><select class='chefOptions' orderid=${item[i].id}>${options}</select></td><td><span id=o${item[i].id}><h3>Pending</h3></span></td></tr>`);   
        }
    });

    $('#orders').on('change', '.chefOptions', function() {
        $(`#o${$(this).attr('orderid')}`).html('<h3>'+$(this).val()+'</h3>');
        socket.emit('statusChanged', {status: $(this).val(), id: $(this).attr('orderid')});
    });
});
