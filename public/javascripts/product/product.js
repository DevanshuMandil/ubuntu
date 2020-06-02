var _category_ = [];
var _products_ = [];

function findCategoryByID(id){
    var name;
    $.each(_category_ , function(index, item){
        if(id == item.id){
            name = item.name;
        }
    });
    return name;
}

function makeTable(arr){
    console.log(arr);
    if(arr.length == 0)
    $("#records").html('Empty Array');

    var table = '<table class="table"><thead class="thead-dark"><tr><th scope="col">ID</th><th scope="col">Name</th><th scope="col">Price</th><th scope="col">Offerprice</th><th scope="col">Category</th><th scope="col">Availibility</th><th>Delete</th></tr></thead><tbody>';
    $.each(arr, function (index, item){
        table += `<tr><th scope="row">${item.id}</th><td>${item.name}</td><td>${item.price}</td><td>${item.offerprice}</td><td>${findCategoryByID(item.categoryid)}</td><td>${item.avail}</td><td><button type="button" id="${item.id}" class="btn btn-danger delete">Delete</button></td></tr>`;
    });

    table += '</tbody></table>';
    $("#records").html(table);
}

function fetchProducts(){
    $.getJSON('/product/fetchData', function(data) {
        _products_ = data;
        makeTable(data);
    });
}

function getCategory(){
    $.getJSON('/category/fetchData',function(data){
        _category_ = data;
        $.each(data, function(index, item){
            $('#categoryid').append($('<option>').val(item.id).text(item.name));
        });
    });
}

getCategory();
fetchProducts();

$(document).ready(function(){
    $("#submit").click(function(){
        $.getJSON('/product/insert',{
                categoryid: $('#categoryid').val(),
                name: $('#name').val(),
                price: $('#price').val(),
                offerprice: $('#offerprice').val(),
                avail: $('#avail').val()
        }, 
        function(data){
            makeTable(data);
        });
    });

    $('#records').on('click', '.delete', function() {
        var id = $(this).attr('id');
        $.getJSON(`/product/delete/${id}`, function(data) {
            makeTable(data);
        });      
    });
});