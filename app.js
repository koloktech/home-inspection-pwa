/****************************************************
 HOME INSPECTION CRM V2
 FRONTEND JAVASCRIPT
****************************************************/


const API_URL =
"https://script.google.com/macros/library/d/1QfG73-Oa_JVU9n4DpjR1Pd_5Ojwcxf8wSRU2H2YDEiwRc1DGSjPvd0sp/2";





/****************************************************
 PAGE CONTROL
****************************************************/


function showPage(page){


document
.querySelectorAll(".page")
.forEach(p=>{

p.classList.add("hidden");

});


document
.getElementById(page)
.classList.remove("hidden");



if(page=="dashboardPage"){

loadDashboard();

}



if(page=="ordersPage"){

loadOrders();

}



if(page=="calendarPage"){

loadCalendar();

}



}






/****************************************************
 API HELPER
****************************************************/


async function api(action,data={}){


let response =
await fetch(API_URL,{

method:"POST",

body:JSON.stringify({

action,

...data

})

});


return await response.json();


}






/****************************************************
 DASHBOARD
****************************************************/


async function loadDashboard(){


let data =
await api(
"dashboard"
);



document
.getElementById("totalJobs")
.innerHTML =
data.totalJobs;



document
.getElementById("sales")
.innerHTML =
data.sales;



document
.getElementById("collected")
.innerHTML =
data.collected;



document
.getElementById("outstanding")
.innerHTML =
data.outstanding;




let html="";



data.upcoming
.forEach(o=>{


html += `

<div class="inspection-card">


<h3>
${o.Customer_Name}
</h3>


<p>
📅 ${o.Inspection_Date}
</p>


<p>
🏠 ${o.Address}
</p>


<p>
${o.Property_Type}
-
${o.Package}
</p>


<p>
RM ${o.Final_Price}
</p>


<p>
Payment:
${o.Payment_Status}
</p>


</div>


`;

});



document
.getElementById("upcomingList")
.innerHTML=html;



}








/****************************************************
 PARSE WHATSAPP
****************************************************/


async function parseMessage(){


let text =
document
.getElementById("message")
.value;



let data =
await api(
"parse",
{
text:text
}
);



document.getElementById("name")
.value =
data.Customer_Name || "";



document.getElementById("phone1")
.value =
data.Phone_1 || "";



document.getElementById("phone2")
.value =
data.Phone_2 || "";



document.getElementById("address")
.value =
data.Address || "";



document.getElementById("unit")
.value =
data.Unit || "";



document.getElementById("size")
.value =
data.Built_Up_Size || "";



document.getElementById("property")
.value =
data.Property_Type || "";



document.getElementById("developer")
.value =
data.Developer || "";



document.getElementById("date")
.value =
data.Inspection_Date || "";



}








/****************************************************
 SAVE ORDER
****************************************************/


async function saveOrder(){


let order={


Customer_Name:
value("name"),


Phone_1:
value("phone1"),


Phone_2:
value("phone2"),


Address:
value("address"),


Unit:
value("unit"),


Built_Up_Size:
value("size"),


Property_Type:
value("property"),


Developer:
value("developer"),


Inspection_Date:
value("date"),


Inspection_Time:
value("time"),


Package:
value("package"),


Notes:
value("notes"),


Original_Message:
value("message")



};



let result =
await api(
"save",
{
order
}
);



if(result.success){


alert(
"Order Saved : "+
result.orderID
);



showPage(
"ordersPage"
);



}



}







/****************************************************
 LOAD ORDERS
****************************************************/


async function loadOrders(){



let search =
value("search");



let orders =
await api(
"orders",
{
search
}
);



let html=`


<table>


<tr>

<th>
Customer
</th>


<th>
Property
</th>


<th>
Date
</th>


<th>
Price
</th>


<th>
Status
</th>


<th>
Action
</th>


</tr>


`;





orders.forEach(o=>{


html += `

<tr>


<td>

${o.Customer_Name}

<br>

${o.Phone_1}

</td>



<td>

${o.Property_Type}

<br>

${o.Package}

</td>



<td>

${o.Inspection_Date}

</td>



<td>

RM ${o.Final_Price}

</td>



<td>

${o.Inspection_Status}

</td>




<td>


<button onclick="openEdit('${o.Order_ID}')">

Edit

</button>


<button onclick="openPayment('${o.Order_ID}')">

Payment

</button>



<button onclick="deleteOrder('${o.Order_ID}')">

Delete

</button>


</td>


</tr>


`;


});



html+="</table>";



document
.getElementById("ordersTable")
.innerHTML=html;


}







/****************************************************
 EDIT ORDER
****************************************************/


let currentOrder=null;



async function openEdit(id){


let order =
await api(
"getOrder",
{
id
}
);



currentOrder=order;



editID.value =
order.Order_ID;


editName.value =
order.Customer_Name;


editPhone.value =
order.Phone_1;


editPackage.value =
order.Package;


editDate.value =
order.Inspection_Date;


editStatus.value =
order.Inspection_Status;



document
.getElementById("editModal")
.classList.remove("hidden");



}







async function updateOrder(){


let order={


Order_ID:
editID.value,


Customer_Name:
editName.value,


Phone_1:
editPhone.value,


Package:
editPackage.value,


Inspection_Date:
editDate.value,


Inspection_Status:
editStatus.value


};



let result =
await api(
"update",
{
order
}
);



if(result.success){


alert(
"Updated"
);



closeModal();


loadOrders();



}



}







function closeModal(){


document
.getElementById("editModal")
.classList.add("hidden");


}







/****************************************************
 DELETE
****************************************************/


async function deleteOrder(id){


if(!confirm(
"Delete this order?"
))
return;



let result =
await api(
"delete",
{
id
}
);



if(result.success){

loadOrders();

}



}







/****************************************************
 PAYMENT
****************************************************/


function openPayment(id){


paymentOrderID.value=id;


document
.getElementById("paymentModal")
.classList.remove("hidden");


}



async function savePayment(){


let payment={


Order_ID:
paymentOrderID.value,


Amount:
paymentAmount.value,


Method:
paymentMethod.value,


Notes:
paymentNote.value


};



let result =
await api(
"payment",
{
payment
}
);



if(result.success){


alert(
"Payment Saved"
);


closePayment();


loadOrders();


}



}



function closePayment(){


document
.getElementById("paymentModal")
.classList.add("hidden");


}









/****************************************************
 CALENDAR
****************************************************/


async function loadCalendar(){



let events =
await api(
"calendar"
);



let calendarEl =
document
.getElementById("calendar");



calendarEl.innerHTML="";



let calendar =
new FullCalendar.Calendar(
calendarEl,
{


initialView:
"dayGridMonth",


events:events,


eventClick:function(info){


alert(
info.event.title+
"\n\n"+
info.event.extendedProps.description
);


}


});


calendar.render();



}









/****************************************************
 HELPERS
****************************************************/


function value(id){

return document
.getElementById(id)
.value;

}




window.onload=function(){

loadDashboard();

};
