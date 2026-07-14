const API="YOUR_APPS_SCRIPT_DEPLOY_URL_HERE"; // replace with your deployed web app URL

async function parse(){
  let text = document.getElementById("message").value;
  let result = await fetch(API,{
    method:"POST",
    body:JSON.stringify({action:"parse", text:text})
  });
  let data = await result.json();

  document.getElementById("name").value = data.Customer_Name;
  document.getElementById("phone1").value = data.Phone_1;
  document.getElementById("phone2").value = data.Phone_2;
  document.getElementById("address").value = data.Address;
  document.getElementById("unit").value = data.Unit;
  document.getElementById("size").value = data.Built_Up_Size;
  document.getElementById("property").value = data.Property_Type;
  document.getElementById("developer").value = data.Developer;
  document.getElementById("date").value = data.Inspection_Date;
}

async function save(){
  let order = {
    Customer_Name: document.getElementById("name").value,
    Phone_1: document.getElementById("phone1").value,
    Phone_2: document.getElementById("phone2").value,
    Address: document.getElementById("address").value,
    Unit: document.getElementById("unit").value,
    Built_Up_Size: document.getElementById("size").value,
    Property_Type: document.getElementById("property").value,
    Developer: document.getElementById("developer").value,
    Inspection_Date: document.getElementById("date").value,
    Inspection_Time: document.getElementById("time").value,
    Package: document.getElementById("package").value,
    Notes: document.getElementById("notes").value,
    Original_Message: document.getElementById("message").value
  };

  let res = await fetch(API,{
    method:"POST",
    body:JSON.stringify({action:"save", order:order})
  });

  let data = await res.json();
  if(data.success){
    alert("Order saved: "+data.orderID);
    loadDashboard();
  } else {
    alert("Error: "+data.error);
  }
}

async function loadDashboard(){
  let r = await fetch(API,{
    method:"POST",
    body:JSON.stringify({action:"dashboard"})
  });
  let d = await r.json();
  document.getElementById("dashboard").innerHTML =
    `Confirmed Orders: ${d.orders} <br>Sales: RM${d.sales}`;
}

// Load dashboard on page load
loadDashboard();
