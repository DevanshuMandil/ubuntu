var categories = [];
var products = [];
var state = [];

var socket = io.connect();

function reviveState() {
    var temp_state = localStorage.getItem('ourState');
    
    if(temp_state != 'null') {
        state = JSON.parse(temp_state);
        console.log(state);
        makeCart();
    }
}

function createCategoriesInMenu() {
    if(categories.length == 0) {
        $('#menu').html('<center><h1>othing to show...</h1></center>')
        return;
    }
    var length = categories.length;
    var menu = '<table class="table table">';
    var rows = parseInt(length / 2); 
    var index = 0; 
    
    menu += `<tr><th><h3>Food Categories :<h3></th></tr>`;
    for(var i=0; i<rows; i++) { 
        menu += `<tr><th class="add" style="cursor: pointer" id=${categories[index].id}>${categories[index].name}</th><th style="cursor: pointer" id=${categories[index+1].id}>${categories[index+1].name}</th></tr>`;
        index = index + 2;  
    }

    if(length % 2 != 0)
        menu +=  `<tr><th class="add" style="cursor: pointer" id=${categories[index].id}>${categories[length-1].name}</th></tr>`

    menu += '</table>';
    $('#menu').html(menu);
}

function fetchDataFromServer() {
    $.getJSON('/product/fetchData', function(data) {
        products = data;
    });
    $.getJSON('/category/fetchData', function(data) {
        categories = data;
        createCategoriesInMenu();
    });
}

fetchDataFromServer();

function showProducts(categoryid) {
    
    var items = products.filter(item => item.categoryid == categoryid);
    createProductsInMenu(items);
}

$('document').ready(function(){
    $('#menu').on('click', 'th', function(){
        showProducts($(this).attr('id'));
    });
    
    $('#products').on('click', '.cart', function() {
        showInCart($(this).attr('id'));
    });

    $('#cart').on('click', '.increment', function() {
        increment($(this).attr('id'));
    });

    $('#cart').on('click', '.decrement', function() {
        decrement($(this).attr('id'));
    });

    $('#submit').on('click',function(){
        totalAmount();
    });

    $("#cart").on('click','.remove',function(){
        removeItem($(this).attr('id'));
    });

    socket.on('newOrders',function(data){
        localStorage.setItem('orderState', JSON.stringify(data[1]));
        localStorage.removeItem('ourState');
    });
    
    reviveState();
});


function createProductsInMenu(items) {
    if(items.length == 0) {
        $('#products').html('<center><h1>No Products in the category</h1></center>')
        return;
    }
    var length = items.length;
    var menu = '<table class="table table">';
    var rows = parseInt(length / 2); 
    var index = 0; 

    menu += `<tr><th><h3>Food Items :<h3></th></tr>`;
    
    for(var i=0; i<rows; i++) { 
        menu += `<tr><th class="cart" style="cursor: pointer" id=${items[index].id}>${items[index].name}</th><th class="cart" style="cursor: pointer" id=${items[index+1].id}>${items[index+1].name}</th></tr>`;
        index = index + 2;  
    }

    if(length % 2 != 0)
        menu +=  `<tr><th class="cart" style="cursor: pointer" id=${items[index].id}>${items[length-1].name}</th></tr>`

    menu += '</table>';
    $('#products').html(menu);
}

function makeCart() {
    var result = '<ul>';
    $.each(state, function(index, item) {
        result += `<li><ul><li>${item.name}</li><li>Price: ${item.price}</li><li>Offerprice: ${item.offerprice}</li><li><span style="cursor: pointer" class="increment" id=${item.id}>+</span><span>${item.quantity}</span><span style="cursor: pointer" class="decrement" id=${item.id}>-</span>&nbsp;&nbsp;&nbsp;&nbsp;<button id=${item.id} class="remove">Remove</button></li></ul></li>`;
    });
    result += '</ul>';
    $('#cart').html(result);
    localStorage.setItem('ourState', JSON.stringify(state));
}

function checkItem(productid)
{   
    var flag = false;
    $.each(state, function(index, item){

        if(item.id == productid)
        {
            flag = true;
        }
    });
    return flag;
}

function createOrder()
{
    var order = [];
    $.each(state, function(index, item){
        order.push(Object.values(item));
    });

    return order;
}

function totalAmount()
{
    var sum=0;
    $.each(state, function(index , item){
        sum = sum + (item.offerprice*item.quantity);
    });
    
    swal({
        title: 'Total Amount:  Rs.'+sum+'',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirm'
      }).then((result) => {
        if (result.value) { 
            
            socket.emit('order',createOrder());     
            localStorage.setItem('total', sum);
            
            swal(
            'Confirmed',
            'Your order has been placed.',
            'success'
          ).then(function(){
            // localStorage.setItem('orderState', JSON.stringify(state));
            // localStorage.removeItem('ourState');

            window.location.href = "http://localhost:5000/order/orderCart";
          });
        }
      });

}

function showInCart(productid) {
    if(state.length > 0)
    {
        var status=checkItem(productid);
        if(status)
        {
            swal({
                imageUrl: 'http://www.hospitality-school.com/wp-content/uploads/2010/03/waiter-order-taking.jpg',
                imageHeight: 300,
                text: 'Sorry sir but you already ordered it.',
                imageAlt: 'A tall image'
              })
            return 0;
        }
    }
    var a = products.filter(item => item.id == productid);
    console.log(a);
    a[0]['quantity'] = 1;
    a[0]['table_no'] = 1;
    console.log(a);
    state.push(a[0]);
    makeCart();
}

function removeItem(productid)
{  
    for(var i=0;i< state.length; i++)
    {
        if(productid == state[i].id)
        {
            state.splice(i, 1);
            break;
        }
    }

    makeCart();
    
}

function increment(productid) {

    state = state.map(item => {
        if(item.id == productid && item.quantity<8) {
            item.quantity += 1;
            return item;
        }
        return item;
    });
    makeCart();
}

function decrement(productid) {
    
    
    state = state.map(item => {
        if(item.id == productid && item.quantity >1) {
            item.quantity -= 1;
           
            return item;
        }
        return item;
    });
    makeCart();
}
