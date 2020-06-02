var ordertState = [];
var socket = io.connect();

function reviveState() {
    var temp_state = localStorage.getItem('orderState');
    
    if(temp_state != 'null') {
        orderState = JSON.parse(temp_state);
        makeTable(orderState);
        console.log(orderState);
    }
    else {
        console.log("lla");
    }
}

function makeTable(arr){
    
    if(arr.length == 0)
    $("#records").html('<center>Empty Array</center>');

    var table = '';
    var collcount = 1;
    $.each(arr, function (index, item){
        table += `<div class="panel panel-default">`;
        table += `  <div class="panel-heading">
                        <h4 class="panel-title">
                            <a data-toggle="collapse" data-parent="#accordion" href="#collapse`+collcount+`" class="collapsed" aria-expanded="false">
                                <div class="order-history">
                                    <h4 style="float: left;margin-right: 2%;">
                                        <img src="/assets/uploads/item_images/${item.image}" alt=${item.name} style="width: 50px;height: 50px;" class="img-responsive" title=${item.name}> 
                                    </h4>
                                    <h4>
                                        <span>${item.name}</span> 
                                        <span class="oh-price">${item.offerprice} ₹</span>
                                    </h4>
                                    <p class="text-danger" id="s${item.id}"> Pending</p>
                                </div>
                            </a>
                        </h4>
                    </div>`;
        table += `  <div id="collapse`+collcount+`" class="panel-collapse collapse" aria-expanded="false">
                        <div class="panel-body">
                            <div class="row">
                                <div class="col-sm-4">
                                    <div class="oh-details">
                                        <h4>Details</h4>
                                        <ul class="ul">
                                            <li>Items Name :<span>${item.name}</span></li>
                                            <li>Items total:<span>${item.offerprice} ₹</span></li>
                                            <li>Order id:<span>${item.id}</span></li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="col-sm-4">
                                    <div class="oh-details">
                                        <ul class="ul">
                                            <li>Booked Date:<span>14-02-2019 23:50 PM</span></li>
                                            <li>Current Status: <span class="text-danger" id="ss${item.id}"> Pending</span></li>
                                        </ul>   
                                        <br><h4></h4><p></p>
                                    </div>
                                </div>
                                <div class="col-sm-4">
                                    <a href="javascript:void(0);" style="margin-right: 3%;" class="btn btn-primary delete" id="${item.id}"> Delevered </a>
                                    <a href="javascript:void(0);" class="btn btn-primary delete" id="${item.id}"> Cancel </a>
                                </div>
                            </div>
                        </div>
                    </div>`;
        table += `</div>`;

        collcount++;
    });

    $("#records").html(table);
}

$('document').ready(function(){
    reviveState();

    socket.on('statusChanged', function(data){
        console.log(data);
        $(`#s${data.id}`).html(`${data.status}`);  
        $(`#ss${data.id}`).html(`${data.status}`);       
    });
});