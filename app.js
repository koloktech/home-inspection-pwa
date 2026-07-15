/****************************************************
 HOME INSPECTION CRM V2
 FRONTEND JAVASCRIPT
****************************************************/


const API_URL =
"https://script.google.com/macros/s/AKfycbzJvRsd6vEAGpWk4bErSJcJKYeWSbnjfYpG-bQkJGBGZG4T3VqXSugrGZ2HoLJ5sU5r/exec";





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

if(page=="paymentPage"){

loadPayments();

}



}






/****************************************************
 API HELPER
****************************************************/


async function api(action,data={}){


let response =
await fetch(API_URL,{

method:"POST",

headers:{

"Content-Type":"text/plain;charset=utf-8"

},

body:JSON.stringify({

action,

...data

})

});

if(!response.ok){

throw new Error("Server returned "+response.status);

}


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
${safe(o.Customer_Name)}
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

orders = Array.isArray(orders)
? orders.filter(o=>o.Order_ID)
: [];



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

${safe(o.Customer_Name)}

<br>

${safe(o.Phone_1)}

</td>



<td>

${safe(o.Property_Type)}

<br>

${safe(o.Package)}

<br>

<small>
${safe(o.Address)}
</small>

</td>



<td>

${safe(o.Inspection_Date)}

</td>



<td>

RM ${safe(o.Final_Price)}

</td>



<td>

${safe(o.Inspection_Status)}

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
order.Phone_1 || "";


editPhone2.value =
order.Phone_2 || "";


editAddress.value =
order.Address || "";


editUnit.value =
order.Unit || "";


editSize.value =
order.Built_Up_Size || "";


editProperty.value =
order.Property_Type || "";


editDeveloper.value =
order.Developer || "";


editPackage.value =
order.Package || "";


editPrice.value =
order.Final_Price || "";


editPaid.value =
order.Amount_Paid || "";


editDate.value =
order.Inspection_Date || "";


editTime.value =
order.Inspection_Time || "";


editSalesStatus.value =
order.Sales_Status || "Confirmed";


editStatus.value =
order.Inspection_Status || "Scheduled";


editPaymentStatus.value =
order.Payment_Status || "Unpaid";


editReportStatus.value =
order.Report_Status || "Not Started";


editNotes.value =
order.Notes || "";



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


Phone_2:
editPhone2.value,


Address:
editAddress.value,


Unit:
editUnit.value,


Built_Up_Size:
editSize.value,


Property_Type:
editProperty.value,


Developer:
editDeveloper.value,


Package:
editPackage.value,


Final_Price:
editPrice.value,


Amount_Paid:
editPaid.value,


Inspection_Date:
editDate.value,


Inspection_Time:
editTime.value,


Sales_Status:
editSalesStatus.value,


Inspection_Status:
editStatus.value,


Payment_Status:
editPaymentStatus.value,


Report_Status:
editReportStatus.value,


Notes:
editNotes.value


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
 LOAD PAYMENTS
****************************************************/


async function loadPayments(){


let container =
document.getElementById("paymentsTable");


container.innerHTML =
'<p class="status-message">Loading payments...</p>';


try{


let payments =
await api("payments");


payments = Array.isArray(payments)
? payments.filter(p=>p.Order_ID || p.Payment_ID || Number(p.Amount)>0)
: [];


let orders =
await api("orders");

orders = Array.isArray(orders)
? orders.filter(o=>o.Order_ID)
: [];

let ordersByID = new Map(
orders.map(o=>[o.Order_ID,o])
);

payments = payments.map(p=>{

let order = ordersByID.get(p.Order_ID) || {};

return {
...p,
Customer_Name:p.Customer_Name || order.Customer_Name,
Balance:p.Balance ?? order.Balance,
Payment_Status:p.Payment_Status || order.Payment_Status,
Notes:p.Notes || order.Notes
};

});


if(!payments.length){

payments = orders
.filter(o=>Number(o.Amount_Paid)>0)
.map(o=>({

Payment_ID:
"ORDER-"+o.Order_ID,

Order_ID:
o.Order_ID,

Customer_Name:
o.Customer_Name,

Payment_Date:
o.Last_Update || o.Created_Date,

Amount:
o.Amount_Paid,

Method:
"Recorded in order",

Payment_Status:
o.Payment_Status,

Balance:
o.Balance,

Notes:
o.Notes

}));

}


if(!payments.length){

container.innerHTML =
'<p class="status-message">No payments recorded yet. Add a payment from an order.</p>';

return;

}


let html =
"<table><tr><th>Order</th><th>Customer</th><th>Date</th><th>Amount</th><th>Balance</th><th>Status</th><th>Method</th><th>Notes</th></tr>";


payments.forEach(p=>{

html +=
"<tr><td>"+safe(p.Order_ID)+
"</td><td>"+safe(p.Customer_Name)+
"</td><td>"+safe(formatDateTime(p.Payment_Date || p.Date || p.Created_Date))+
"</td><td>RM "+money(p.Amount)+
"</td><td>RM "+money(p.Balance)+
"</td><td>"+safe(p.Payment_Status)+
"</td><td>"+safe(p.Method)+
"</td><td>"+safe(p.Notes)+
"</td></tr>";

});


container.innerHTML = html + "</table>";


}catch(error){

container.innerHTML =
'<p class="status-message error-state">Could not load payments: '+safe(error.message)+'</p>';

}


}




/****************************************************
 CALENDAR
****************************************************/


async function loadCalendar(){



let events =
await api(
"calendar"
);

events = Array.isArray(events)
? events.filter(event=>event.id && event.start)
: [];



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




function safe(value){

return String(value ?? "")
.replaceAll("&","&amp;")
.replaceAll("<","&lt;")
.replaceAll(">","&gt;")
.replaceAll('"',"&quot;")
.replaceAll("'","&#039;");

}


function money(value){

let amount = Number(value);

return Number.isFinite(amount)
? amount.toLocaleString("en-MY",{maximumFractionDigits:2})
: "0";

}


function formatDateTime(value){

if(!value){

return "";

}

let date = new Date(value);

if(Number.isNaN(date.getTime())){

return value;

}

return date.toLocaleString("en-MY",{
year:"numeric",
month:"short",
day:"numeric",
hour:"2-digit",
minute:"2-digit"
});

}


window.onload=function(){

loadDashboard();

};
