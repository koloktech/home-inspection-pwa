const API=

"https://script.google.com/macros/s/AKfycbzJvRsd6vEAGpWk4bErSJcJKYeWSbnjfYpG-bQkJGBGZG4T3VqXSugrGZ2HoLJ5sU5r/exec";



async function parse(){


let text=
document.getElementById(
"message"
).value;


let result=
await fetch(API,{

method:"POST",

body:JSON.stringify({

action:"parse",

text:text

})

});


let data=
await result.json();


name.value=data.Customer_Name;

phone.value=data.Phone_1;

property.value=data.Property_Type;


}



async function save(){


let order={

Customer_Name:name.value,

Phone_1:phone.value,

Property_Type:property.value,

Package:
package.value,


Original_Message:
message.value


};


let res=
await fetch(API,{

method:"POST",

body:JSON.stringify({

action:"save",

order:order

})

});


let data=
await res.json();


alert(
"Saved "+data.orderID
);


}



async function loadDashboard(){


let r=
await fetch(API,{

method:"POST",

body:JSON.stringify({

action:"dashboard"

})

});


let d=
await r.json();


dashboard.innerHTML=

`
Orders:
${d.orders}

<br>

Sales:
RM${d.sales}

`;

}


loadDashboard();