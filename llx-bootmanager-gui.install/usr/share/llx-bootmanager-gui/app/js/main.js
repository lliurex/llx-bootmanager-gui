
// Classe N4dChatSession

function LlxNetBootManagerClient(){
   self=this;
   this.BootOrder=null;
   this.AvailableList=null;
}

// Methods

LlxNetBootManagerClient.prototype.login = function(username, password, server){
    // n4d connect
    
    $("body").addClass("CursorWaiting");

    $.xmlrpc({
	url: 'https://'+$("#input_server").val()+':9779',
	    methodName: 'validate_user',
	    params: [username, password],
	    success: function(response,status,jqXHR){
		    $("body").removeClass("CursorWaiting");
		    groups=response[0].return[1];
		    //if ((groups.indexOf('adm')!=-1)||(groups.indexOf('admins')!=-1)||(groups.indexOf('teachers')!=-1)) {
		    if ((groups.indexOf('adm')!=-1)||(groups.indexOf('admins')!=-1)) {			    
			    // TO DO....
			   //alert("To do");
			   sessionStorage.server=server;
			   sessionStorage.username=username;
			   sessionStorage.password=password;
			   var gui = require('nw.gui');
			   var win = gui.Window.get();
			   win.resizeTo(700, 500);
			   $("#loginFrame").hide();
			   //$("#MainFrame").show();
			   self.populateGui();
			    // Hide login
				// Show Menu!!
		    } else{
			    $("#input_password").addClass("wrong_pass");
			    $("#input_username").addClass("wrong_pass");
			    //alert("Username or password error!");
		    }
	    },
	    error: function(jqXHR, status, error) {
		    alert("Status: "+status+"\nError: N4d server is down"+error);
	    }
    })
}

LlxNetBootManagerClient.prototype.showTimer = function(){
   $.xmlrpc({
		 url: 'https://'+sessionStorage.server+':9779',
		 methodName: 'getBootTimer',
		 params: ["","LlxBootManager"],
		 success: function(response,status,jqXHR){
			// Set Timer
			   $(function() {
				 $( "#slider-range-min" ).slider({
					range: "min",
					value: (response[0].return/10),
					min: 0,
					step: 5,
					max: 120,
					slide: function( event, ui ) {
					   $( "#time" ).val(  ui.value +" s");
					 }
				 });
		   
				 $( "#time" ).val( $( "#slider-range-min" ).slider( "value" ) +" s");
				 });		 
			 
			 }
			 
			 
	  });
   
   
   
}

LlxNetBootManagerClient.prototype.sortList = function(){
   
   // Wait for BootOrder and AvailableList are not empty
   
   if (this.BootOrder && this.AvailableList) {
	  
	  // Populate Lists
	  $("#BootList").empty();
	  $("#AvailableOptions").empty();
	  
	  console.log(self.BootOrder);
	  
	  // Populate Boot List
	  for (i in self.BootOrder) {
		 var itemclass="ltsp";
		 if (self.BootOrder[i].indexOf("bootfromhd")>-1) itemclass="bootfromhd";
		 if (self.BootOrder[i].indexOf("netinstall")>-1) itemclass="netinstall";
		 // Check if BootOrder[i] is in the Available List
		 var boot_label=""
		 for (j in self.AvailableList) {
			if (self.BootOrder[i]==self.AvailableList[j]["id"]) {
			   boot_label=self.AvailableList[j]["label"];
			   self.AvailableList.splice(j, 1);
			   break;
			}
		 }
		 var listitem=$(document.createElement("li")).html(boot_label).attr("id", self.BootOrder[i]).addClass("menuEntry").addClass(itemclass);
		 // bootfromhd netinstall
		 
		 
		 // only append  Boot List if boot item is available (has found it on available list)
		 if (boot_label!="") $("#BootList").append(listitem);
		 
		 
	  }
	  
	  
	  // Populate Available List
	  for (i in self.AvailableList) {
		 var itemclass="ltsp";
		 if (self.AvailableList[i]['id'].indexOf("bootfromhd")>-1) itemclass="bootfromhd";
		 if (self.AvailableList[i]['id'].indexOf("netinstall")>-1) itemclass="netinstall";
		 var listitem=$(document.createElement("li")).html(self.AvailableList[i]['label']).attr("id", self.AvailableList[i]['id']).addClass("menuEntry").addClass(itemclass);
		 // bootfromhd netinstall
		 
		 $("#AvailableOptions").append(listitem);
		 //listitem=document.createElement("li").html();
	  }
	  
	  
	    // Make Lists Sortable
        $( "#BootList, #AvailableOptions" ).sortable({
            placeholder: "ui-sortable-placeholder",
             connectWith: ".connectedSortable",
             /*start: function(event, item){
                list_of_origin=event.target.id;
                },*/
            receive: function(event, ui) {
                var sourceList = $(ui.sender)[0].id;
                var targetList = $(this)[0].id;
                console.log(sourceList);
                console.log(targetList);
                if (sourceList==targetList) {
                    // Nothing to do...
                } else{  // Different Lists, let's swap!
                    if (sourceList=="AvailableOptions") {
                        div=$("#BootList").find("li");
                        var element=null;
                        for (i=0;i<div.length;i++) {
						   if((typeof($(div[i]).children()[0]))!="undefined"){
                            if ($(div[i]).children()[0].className=="empty")
                                element=$(div[i]).children()[0];
						   }
                        }
                        var newelement=$(document.createElement("li")).addClass("i-sortable-handle");
                        $(newelement).append($(element).clone());

                        console.log(element);
                        $(element).parent().remove();

                        $("#AvailableOptions").append(newelement);

                    } else {
                        div=$("#AvailableOptions").find("li");
                        var element=null;
                        for (i=0;i<div.length;i++) {
						   
						   //alert(typeof($(div[i]).children()[0]));
						   if((typeof($(div[i]).children()[0]))!="undefined"){
							  if ($(div[i]).children()[0].className=="empty")
								  element=$(div[i]).children()[0];
						   }
						   
                        }
                        var newelement=$(document.createElement("li")).addClass("i-sortable-handle");
                        $(newelement).append($(element).clone());

                        $(element).parent().remove();

                        $("#BootList").append(newelement);


                        }

                } // End elsedifferent lists*/


            }
         }).disableSelection();
   }

}
	
	
LlxNetBootManagerClient.prototype.populateGui=function populateGui(){
   $("#MainFrame").show();
	  self.showLists();
	  self.showTimer();
	  
	  $("#btSave").bind('click', function( event ){
		 var new_boot_order=[];
		 
		 $('ul#BootList li').each(function(index, element) {
			//alert ($(element).find(".menuEntry").prop("id"));
			console.log($(element).find(".menuEntry"));
			var label=$(element).prop("id");
			new_boot_order.push(label);
            
        }); 
	  
	  // Save List
	  parameter_list = [[sessionStorage.username, sessionStorage.password],"LlxBootManager"].concat(new_boot_order);
	  console.log(new_boot_order);
	  $.xmlrpc({
		 url: 'https://'+sessionStorage.server+':9779',
		 methodName: 'setBootOrder',
		 params: parameter_list,
		 success: function(response,status,jqXHR){ 
			 },
				 error: function(jqXHR, status, error) {
						 bootbox.alert("Status: "+status+"\nError: N4D server is down "+error);
			 }
	  })
	
	time=$( "#slider-range-min" ).slider( "value" );
	
	  $.xmlrpc({
		 url: 'https://'+sessionStorage.server+':9779',
		 methodName: 'setBootTimer',
		 params: [[sessionStorage.username, sessionStorage.password],"LlxBootManager", (time*10)],
		 success: function(response,status,jqXHR){
				 
			   
		   },
			   error: function(jqXHR, status, error) {
					   bootbox.alert("Status: "+status+"\nError: N4D server is down "+error);
		   }
	  })
			
	
	
	
	 })
   
   
   
}


LlxNetBootManagerClient.prototype.showLists = function(){
   
   // Load Templates
   $.xmlrpc({
		 url: 'https://'+sessionStorage.server+':9779',
		 methodName: 'getBootList',
		 params: ["","LlxBootManager"],
		 success: function(response,status,jqXHR){
			 self.AvailableList=response[0].return;
			 self.sortList();
			 },
				 error: function(jqXHR, status, error) {
						 bootbox.alert("Status: "+status+"\nError: N4D server is down "+error);
			 }
	  })
   
   // Load Boot Order
   $.xmlrpc({
		 url: 'https://'+sessionStorage.server+':9779',
		 methodName: 'getBootOrder',
		 params: ["","LlxBootManager"],
		 success: function(response,status,jqXHR){
			 self.BootOrder=response[0].return;
			 self.sortList();
			 },
				 error: function(jqXHR, status, error) {
						 bootbox.alert("Status: "+status+"\nError: N4D server is down "+error);
			 }
	  })
	  
   }
	
function deleteFolderRecursive(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function(file, index){
      var curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
}


$(document).ready(function() {
    deleteFolderRecursive("/tmp/.chromium_open");
    var LlxNetBootManager=new LlxNetBootManagerClient();
    // Bind Event Handlers  
        
    if (sessionStorage.username==undefined) {
	$("#loginFrame").show();
	$("#LoginButton").bind('click', function( event ){
	    username=$("#input_username").val();
	    password=$("#input_password").val();
	    server=$("#input_server").val();                        
	    LlxNetBootManager.login(username,password, server);
	})
    } else {
	  //LlxNetBootManager.login(username,password, server);
	  LlxNetBootManager.populateGui();
	  
    }
    
	
	
	
});
