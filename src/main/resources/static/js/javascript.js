
var data_length;
var dataArray;
var columns = [];
var table_name;
var currentTab = 0; 
var valid;


function checkFile() {
	 if(document.getElementById("upload_csv").files.length == 0) { 
            document.getElementById('upload_btn').disabled = true;
document.getElementById("inputGroupFile01").innerHTML = "Choose csv file"; 
        } else { 
	document.getElementById("inputGroupFile01").innerHTML = document.getElementById("upload_csv").files[0].name;
            document.getElementById('upload_btn').disabled = false;

        }
    }


function fermer()
{document.getElementById("upload_csv").value= null;
checkFile();
remove();
currentTab = 0;
document.getElementById("table_name").value=null;
var x = document.getElementsByClassName("tab");
x[0].style.display = "block";
x[1].style.display = "none";
document.getElementById("alert").style.display = "none";
document.getElementById("nextBtn").disabled = false;
}

function remove() {
  var selected_option =  document.querySelectorAll('[id=select_option]');
	for(var i = 0; i< selected_option.length ; i++)
	{
	
		 selected_option[i].parentNode.removeChild(selected_option[i]);
	}
   
}

function upload()
{
	parseData(results);
	showTab(currentTab);

	}
	
	function results(data) {
		dataArray = data;
    //Data is usable here
  data_length = data[0].length;
		for(var i = 0; i< data[0].length ; i++)
		{
			
	 var div_select = document.createElement("div");
	div_select.id = "select_option";
	var tag = document.createElement("label");
	tag.id  = "label"+ i;
   var text = document.createTextNode(data[0][i]);
   tag.appendChild(text);
   var element = document.getElementById("fields");
   element.appendChild(div_select);
 div_select.appendChild(tag);

var selectList = document.createElement("select");
selectList.className  = "form-control";
selectList.id  = "select"+ i;
selectList.required = true;
div_select.appendChild(selectList);

var option = document.createElement("option");
option.selected = true;
option.disabled = true;
option.value = " ";
option.text = "type";
selectList.appendChild(option);

var option = document.createElement("option");
option.text = "number";
option.value = "INT";
selectList.appendChild(option);


var option = document.createElement("option");
option.text = "text";
option.value = "varchar(100)";
selectList.appendChild(option);

		}
		
		

}
	
		function parseData(callBack) {
    Papa.parse(document.getElementById('upload_csv').files[0], {
        download: true,
        dynamicTyping: true,
			skipEmptyLines: true,
        complete: function(results) {
            callBack(results.data);
        }
    });
}
	
	 


	function showTab(n) {
	  // This function will display the specified tab of the form...
	  var x = document.getElementsByClassName("tab");
	 	 x[n].style.display = "block";
	  //... and fix the Previous/Next buttons:
	  if (n == 0) {
	    document.getElementById("prevBtn").style.display = "none";
	  } else {
	    document.getElementById("prevBtn").style.display = "inline";
	  }
	  if (n == (x.length - 1)) {
	    document.getElementById("nextBtn").innerHTML = "Submit";
		
	  } else {
	    document.getElementById("nextBtn").innerHTML = "Next";
		
	  }
	  //... and run a function that will display the correct step indicator:
	  fixStepIndicator(n)
	}

async function nextPrev(n) {
		
		 var x = document.getElementsByClassName("tab");
	
		if(n == -1)
		 document.getElementById("alert").style.display = "none";
		var check_forme = validateForm();
	  if (n == 1 && !check_forme) return false;

if(check_forme)
await checkTable().done(function(result) 
{
	
	if(result == "existe")
			{
	document.getElementById("alert").innerHTML = "Error, table name already exist";
	document.getElementById("alert").style.display = "block";
				valid = false;
			}
			else {
			valid = true;
			document.getElementById("alert").style.display = "none";
			}
});

if(!valid) return false;

	  if (currentTab == 1 && n == 1 && !validateSelect()) return false;
		
 		if (n !=1 || currentTab != 1)
	 			x[currentTab].style.display = "none";
		
	  		currentTab = currentTab + n;

	  if (currentTab == 2) {
		currentTab = currentTab -1;
	  
	document.getElementById("nextBtn").disabled = true;
		data= {
			"data" : dataArray,
			"columns": columns,
			"table_name": table_name
}
		
	$.ajax({
			headers: { 
        'Accept': 'application/json',
        'Content-Type': 'application/json' 
    },
    type : "POST",
    url : "/save_table",
    data : JSON.stringify(data),
dataType: 'text',
    success : function(result) {
	if(result == "success")
 	  $(document).ready(function(){
	
 	$('#exampleModalCenter').modal('hide')	
    $("#success").modal();
  
}); if(result == "error"){
	document.getElementById("alert").innerHTML = "Error, please check columns type";
	document.getElementById("alert").style.display = "block";
	document.getElementById("nextBtn").disabled = false;
	columns = [];
}
    },
    error : function(e) {
		console.log(e)
    }
}); 

	  }
	  else 
{
	  showTab(currentTab);

}
	}

function validateSelect()
{
	table_name = document.getElementById("table_name").value;
	
	for(var i = 0; i < data_length; i++)
	{
		var element = document.getElementById("select"+ i);
		var label = document.getElementById("label"+ i).textContent;
		
    //If it isn't "undefined" and it isn't "null", then it exists.
if(typeof(element) != 'undefined' && element != null){
   if (element.value == " ") {
	document.getElementById("alert").innerHTML = "Type of columns required";
	document.getElementById("alert").style.display = "block";
element.focus()
return false;

} else {
	document.getElementById("alert").style.display = "none";
}

columns.push([label, element.value]);

} 
	}
	
	return true;
}


   function checkTable() {
	
	var table_name = document.getElementById("table_name").value;  
	
return 	$.ajax({		
    type : "GET",
    url : "/check",
    data : {"table_name": table_name},
    success : function(){}, 
    error : function(e) {
	console.log(e)
    }
}); 
    
}


 	function validateForm() {
		var element = document.getElementById("table_name");
		
		if(typeof(element) != 'undefined' && element != null){
   if (element.value == "") {
	document.getElementById("alert").innerHTML = "Table name required";
	document.getElementById("alert").style.display = "block";
element.focus()
return false;

} else{
	document.getElementById("alert").style.display = "none";
}
}


	return true;
	
	}
	

	function fixStepIndicator(n) {
	  // This function removes the "active" class of all steps...
	  var i, x = document.getElementsByClassName("step");
	  for (i = 0; i < x.length; i++) {
	    x[i].className = x[i].className.replace(" active", "");
	  }
	  //... and adds the "active" class on the current step:
	  x[n].className += " active";
	}

 if (window.location.href.indexOf("tables/") > -1) {
	var lastPart = window.location.href.split("/").pop();
	lastPart = lastPart.replace(/%20/g, " ")
	 var table_name =  document.querySelectorAll('[id=table_name]');
	for(var i = 0; i< table_name.length ; i++)
	{
	  var name_of_table = table_name[i].textContent;
			if(name_of_table == lastPart)
					table_name[i].className += " active";
	}  

    }

  

	