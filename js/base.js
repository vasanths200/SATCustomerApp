// callBackonValidation['after'] / ['before']

// >>>>>>>>>>>>>>>>>>>>>>> CONTENTS  .....................

    const SERVERURL = "http://sattaxi.in/crm/mappcustomers";
    const MINOTPINTRVL = 30; // in seconds
    const CENTERERODELATLNG = "11.3410,77.7172";

// <<<<<<<<<<<<<<<<<<<<<<<< CONTENTS  .....................	
	
var callBackonValidation = {};
	callBackonValidation['before'] = {};
	callBackonValidation['after'] = {};


var path = window.location.pathname.split(".html");
var page = path[0].split("/").pop();


(function($){

	function checkLogedin()
	{	
		LDB.executeQuery("select * from login_user_info where property = 'login_status' AND value = '1'", function(inpObj){

			var opAra = LDB.selectObj2Obj(inpObj,"property");

			if(Object.keys(opAra).length === 0 && page != 'login')
			{
				window.location.replace("../files_non_auth/login.html");
			}
		
		});	
	} 

	 checkLogedin();	

})(jQuery);



	 
	 document.addEventListener("deviceready", onDeviceReady, true);

	
    // Cordova is ready
	
    //
    function onDeviceReady() {
		
		//device.name, device.cordova, device.platform, device.uuid, device.version 		
		var divId = (typeof(device) == "undefined")?"00000000000000":device.uuid;	
		alert(divId);				
		
		var watchId = navigator.geolocation.watchPosition(onNewLocation,onLocError);	

			//		navigator.geolocation.getCurrentPosition(onNewLocation,onLocError);	
		//alert(89);				
					
    }
	
	function onLocError(error)
	{
		 alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
	}
	
	function onNewLocation(position)
	{ 
		alert(position.coords.latitude+' -ZXZ- '+position.coords.longitude);
	}
	
function preSaveVal(fObj)
{

//fObj.find("[type=submit]").remove();
fObj.find("[type=submit]").addClass("ss_hidden");

$(".loader_main_div").removeClass("ss_hidden");

var vToSub = {};

	$(fObj).find(".form_group:visible").each(function(){
		
		var row = $(this).attr("row_count");
		var sVal = "";
		var rObj = $(this),
			lK = "";
		
		$(this).find("[data-mmd]").each(function(){
			
			spl = $(this).attr("data-mmd").split("[");
							
			if(typeof(vToSub[spl[0]]) == "undefined") vToSub[spl[0]] = {};
			if(typeof(vToSub[spl[0]][row]) == "undefined") vToSub[spl[0]][row] = {};
					
			if($(this).get(0).tagName.toLowerCase() == "input" && $(this).attr("type") == "radio")
			{
				sVal = typeof($(rObj).find("[data-mmd='"+$(this).attr("data-mmd")+"']:checked").val()) == "undefined"?"":$(rObj).find("[data-mmd='"+$(this).attr("data-mmd")+"']:checked").val();
			}						
			else if($(this).get(0).tagName.toLowerCase() == "input" && $(this).attr("type") == "checkbox")
			{
				sVal = "";
				if(typeof($(rObj).find("[data-mmd='"+$(this).attr("data-mmd")+"']:checked").val()) != "undefined")
				{
					valAra = [];
					$(rObj).find("[data-mmd='"+$(this).attr("data-mmd")+"']:checked").each(function(k)
					{
						valAra[k] = $(this).val();	
					});
				sVal = valAra.join(",");
				}
			}						
			else
				sVal = $(this).val();
							
			vToSub[spl[0]][row][spl[1].replace("]","")] = sVal;	
		});						
	});	
	
	
	console.log(vToSub);
	return false;
	$.ajax(
	{
		type:"POST",
		url:SERVERURL,
		data:{"requestFor":"fsd","mobileSerial":"","customer_id":"","appKey":""},
		success: function(data){	
		
			var toObj = "";					
			try { toObj = JSON.parse(data); } catch (e) { $(".loader_main_div").addClass("ss_hidden"); return false; }				

			if(toObj == "") { $(".loader_main_div").addClass("ss_hidden"); return false; }
			if(toObj.data[0].status == "success") 
			{	
				if(toObj.success != "")		
				{				
					var mSplS = toObj.success.split("|");
					showNotification('success',mSplS[0],mSplS[1]);						
				}
				else
				{
					showNotification('success','Done',"Task completed successfully.");
				}
				
				if($(".ssdt_current_page_no").length > 0) $(".ssdt_current_page_no").trigger("change"); // REFRESH THE LIST PAGE
				if($(".reload_vehiclelistbkpg").length == 1) $(".reload_vehiclelistbkpg").trigger("click");  // IF BOOKING PAGE REFRESH THE VEHICLE LIST
				
				if(typeof(reFreshNotif[toObj.table]) != "undefined")
				getShowMainNotif();				
						
				retFro = true;
				if(typeof(cb_af_saveSuccess[toObj.table]) != "undefined") retFro = cb_af_saveSuccess[toObj.table](fObj,toObj);	
								
				if(retFro == false)
				{						
					$(".loader_main_div").addClass("ss_hidden");	
					fObj.find("[type=submit]").removeClass("ss_hidden");
					return false;									
				}				
			}			
							
			//if(toObj.error != "")			
			if(toObj.data[0].status == "error")			
			{	
				if(toObj.error != "")
				{
					var mSplE = toObj.error.split("|");		
					showNotification('error',mSplE[0],mSplE[1]);		
				}
				else
				{
					showNotification('error','Failed',"Task failed.");
				}			
			
				$.each(toObj.data,function(ro,val){
					if(val.status == "success")
					$(fObj).find("[row_count='"+ro+"']").remove();
				});
				
				if($(fObj).find(".form_group:first").find(".divider_div").length > 0)
				{
					$(fObj).find(".form_group:first").find(".divider_div").remove();
				}
				
			if(typeof(cb_af_saveError[toObj.table]) != "undefined") retFro = cb_af_saveError[toObj.table](fObj);	
			
			$(".loader_main_div").addClass("ss_hidden");	
			fObj.find("[type=submit]").removeClass("ss_hidden");
			return false;
			}	
			
			closeMainPop(fObj,toObj.data,toObj.table);
			$(".loader_main_div").addClass("ss_hidden");
		}
	});	

}