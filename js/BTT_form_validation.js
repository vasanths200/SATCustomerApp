/*
*	FUNCTION : jQuery Client Side Form validation (For single or multiple forms)
* 	By - Vasanth S (vasanths200@gmail.com)	*
*	Oct, 2015 

Futures
===============================================
*	Client Side Form validation Plugin which could be used for a page with multiple or single form.
					  
Files To be Included
===========================
js/BTT_form_validation.js
style/BTT_form_validation.css

Function Call
===========================
$(".val_form01,.val_form02").BTT_form_validate();

*/

(function($) 
{	
	var BTT_val_values = {},
		BTT_val_default = {},
		BTT_val_data = {},
		diable = "";
		
	BTT_val_default["pattern"] = {"zip":/^[0-9a-z\s]+$/i,"usname":/^[0-9a-z_.]+$/i,"vartext":/^[0-9a-z_. ]+$/i,"name":/^[a-z ]+$/i,"mobile":/^[0-9+-]+$/i,"mobile_strict":/^[5,6,7,8,9][0-9+-]+$/i,"phone":/^[0-9-]+$/i,"numsls":/^[0-9/]+$/i,"float":/^[+-]?((\.\d+)|(\d+(\.\d+)?))$/,"money":/^\d+(\.\d{1,10})?[.]?$/,"moneywneg":/^[+-]?((\.\d+)|(\d+(\.\d+)?))$/,"qty":/^\d+$/,"email":/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i};
	
	BTT_val_default["forKeyPress"] = 
	{	
	"zip":{"values":"48-57,97-122,65-90,45,32","type":"in"},	// numbers + alphabets + " " 
	"usname":{"values":"48-57,97-122,65-90,95,46","type":"in"},		// numbers + alphabets + _ + .
	"vartext":{"values":"48-57,97-122,65-90,95,46,32","type":"in"},			// numbers + alphabets + _ + .
	"name":{"values":"97-122,65-90,32","type":"in"},	// only alphabets
	"mobile_strict":{"values":"48-57,45,43","type":"in"},	// numbers + "+" + - numbers should start with 5 to 9
	"mobile":{"values":"48-57,45,43","type":"in"},	// numbers + "+" + -
	"phone":{"values":"48-57,45","type":"in"},	// numbers +  -
	"numsls":{"values":"48-57,47","type":"in"},	// numbers +  /
	"money":{"values":"48-57,46","type":"in"},		// only positive value money
	"moneywneg":{"values":"48-57,46,45","type":"in"},		// positive nd negative value money
	"float":{"values":"48-57,46,45","type":"in"},	// negative values too
	"qty":{"values":"48-57","type":"in"},
	"email":{"values":"48-57,97-122,65-90,64,46","type":"in"}	
	};
	
	BTT_val_default["comKey"] = [39,37,46,36,35,9];
	
	BTT_val_default["call_on"] = "both";			
	BTT_val_default["dsp_type"] = "msg"; /* it can be msg or red_box */	
	BTT_val_default["on_hidden"] = false;
	BTT_val_default["mandKeys"] = [17,8];		
	BTT_val_default["error"] = {
								"req-int":"Required Field",
								"req-text":"Required Field",
								"min":"Value should have Min [[min]] Chrs.",
								"max":"Value can have Max [[max]] Chrs.",
								"pattern":
									{
									"default":"Invalid Format",
									"zip":"Enter a Valid Zip",
									"usname":"Enter a Valid User Name",
									"name":"Enter a Valid Name",
									"mobile":"Enter a Valid Mobile No",
									"phone":"Enter a Valid Phone No",
									"float":"Enter a Number",
									"qty":"Enter a Qty",
									"email":"Enter a Email Id"
									}
								};
		
		var find_validations = function(items)
		{
			var va_split = items.split("|");
				range_pat = /^[0-9-]+$/i,
				split1 = ""
				opt = {"req":"","min":"","max":"","method":""};
			
			for(s in va_split)
			{			
			
				if(va_split[s].substring(0, 4) == "req-")
				opt["req"] = va_split[s].substring(4);
				else if(range_pat.test(va_split[s]))
				{
					split1 = va_split[s].split("-");
										
					if(split1.length == 1 || split1.length == 2)
					{
						if(split1[0] > 0 ) opt["min"] = split1[0];		
						
						if(split1.length == 2)
						if(split1[1] > 0 ) opt["max"] = split1[1];
					}
				}	
				else
				opt["method"] = va_split[s];
			}
		return opt;
		},
		showError = function(tObj,error,vld_type)
		{
		var fInd = tObj.closest("form").attr("BTT_form_vald_id");		
	
			if(error == false)
			{				
				if(vld_type == "msg")
				tObj.parent().find(".BTT_val_error_space").css("display","none").text('');
				else
				tObj.removeClass(vld_type);

				tObj.closest("form").find("[type=submit]:visible").attr("disabled",false);
				tObj.removeAttr("BTT_val_has_error");
			}
			else
			{
				if(vld_type == "msg")
				tObj.parent().find(".BTT_val_error_space").css("display","block").text(error);				
				else
				tObj.addClass(vld_type);

				if(typeof(BTT_val_values[fInd].call_on[$(tObj).closest("form").attr("id")]) == "undefined")
				{
				diable = (BTT_val_values[fInd].call_on == "element_only")?false:true;
				tObj.closest("form").find("[type=submit]:visible").attr("disabled",diable);
				}
				tObj.attr("BTT_val_has_error",1);
			}
						
			return error;
		},
		check_if_key_exist = function(values_str,cur_key)
		{		
		var spl_key = values_str.split(","),
			spl_key1 = "",
			key_exist = false;
										
			for(ke in spl_key)
			{
			spl_key1 = spl_key[ke].split("-");
				if(spl_key1.length == 2)
				{
				if(cur_key >= spl_key1[0] && cur_key <= spl_key1[1]) { key_exist = true; break; }
				}					
				else if(spl_key1.length == 1)
				{
				if(cur_key == spl_key1[0]) { key_exist = true; break; }
				}
			}
		return key_exist;	
		},
		validate_each_field = function(tObj,event,ret)
		{ 
		var Form_Obj = tObj.closest("form"),
			ind = Form_Obj.attr("BTT_form_vald_id"),
			uniq_error_msg = {},
			curelm_error_ara = {},
			tVal = tObj.val(),
			in_vld = find_validations(tObj.attr("BTT_validate")),
			vld_type = (typeof(tObj.attr("BTT_val_dsp_type")) != "undefined")?tObj.attr("BTT_val_dsp_type"):(typeof(Form_Obj.attr("BTT_val_dsp_type")) != "undefined"?Form_Obj.attr("BTT_val_dsp_type"):(typeof(BTT_val_data.dsp_type)!= "undefined"?BTT_val_data.dsp_type:BTT_val_default["dsp_type"])),
			fInd = Form_Obj.attr("BTT_form_vald_id");
						
			fixd = (BTT_val_values[fInd].call_on == "submit_only" && event.type != "submit" && ret != "count")?true:false;
							
			if(typeof(tObj.attr("BTT_val_has_error")) == 1) return false;			
							
			var	on_hidden = (typeof(tObj.attr("BTT_val_on_hidden")) != "undefined")?tObj.attr("BTT_val_on_hidden"):(typeof(Form_Obj.attr("BTT_val_on_hidden")) != "undefined"?Form_Obj.attr("BTT_val_on_hidden"):(typeof(BTT_val_data.on_hidden)!= "undefined"?BTT_val_data.on_hidden:BTT_val_default["on_hidden"])); 
				
				if((on_hidden == false && tObj.is(":visible") == false) || fixd == true) /* restrict validation on hidden field  */ 
				{
				showError(tObj,false,vld_type);
				return false;
				}
						
		/* -->>> find and add unique error msg */	
		var form_error_ara = "";
			
		if(typeof($(tObj).closest("form").attr("BTT_val_error")) == "string")
		{
			try { form_error_ara = JSON.parse($(tObj).closest("form").attr("BTT_val_error")); } 
			catch (e) { form_error_ara = ""; }
					 
		}
		
		for (ky in BTT_val_default.error) 
		{
			if(ky != "pattern")
			uniq_error_msg[ky] = typeof(form_error_ara[ky])!="undefined"?form_error_ara[ky]:BTT_val_default.error[ky];
		}		
		
		if(typeof($(tObj).attr("BTT_val_error")) == "string")
		{
			try { curelm_error_ara = JSON.parse($(tObj).attr("BTT_val_error")); } 
			catch (e) { curelm_error_ara = ""; }
					
			 if(curelm_error_ara != "")
			 for (ky in uniq_error_msg) 
			 {
				 if(ky != "pattern")
				 uniq_error_msg[ky] = typeof(curelm_error_ara[ky])!="undefined"?curelm_error_ara[ky]:uniq_error_msg[ky];
			 }		
		}
		
		uniq_error_msg['pattern'] = "";
		if(in_vld.method != "")
		{		
			try { pat_err = JSON.parse($(tObj).attr("BTT_val_error")); } 
			catch (e) { pat_err = ""; }
			
			if(typeof(pat_err) == "object")
			{			
				if(typeof(pat_err.pattern) != "undefined")
				{
					if(typeof(pat_err.pattern) == "object")
					{
					uniq_error_msg['pattern'] =(typeof(pat_err.pattern[in_vld.method])!="undefined")?pat_err.pattern[in_vld.method]:((typeof(pat_err.pattern['default'])!="undefined")?pat_err.pattern['default']:"");
					}
					else
					{
					uniq_error_msg['pattern'] = pat_err.pattern;
					}				
				}
			}
			
			if(uniq_error_msg['pattern'] == "")
			{
				try { pat_errf = JSON.parse($(tObj).closest("form").attr("BTT_val_error")); } 
				catch (e) { pat_errf = ""; }
				
				if(typeof(pat_errf) == "object")
				{			
					if(typeof(pat_errf.pattern) != "undefined")
					{
						if(typeof(pat_errf.pattern) == "object")
						{
						uniq_error_msg['pattern'] =(typeof(pat_errf.pattern[in_vld.method])!="undefined")?pat_errf.pattern[in_vld.method]:((typeof(pat_errf.pattern['default'])!="undefined")?pat_errf.pattern['default']:"");
						}
						else
						{
						uniq_error_msg['pattern'] = pat_errf.pattern;
						}				
					}
				}
			}
			
			if(uniq_error_msg['pattern'] == "")
			{
			uniq_error_msg['pattern'] = (typeof(BTT_val_default.error.pattern[in_vld.method]) != "undefined")?BTT_val_default.error.pattern[in_vld.method]:BTT_val_default.error.pattern.default;
			}
		}					
		/* --<<< find and add unique error msg */			
			var error = false;

				/* Check Required >>> */
				reqTyp = (in_vld.req == "")?false:in_vld.req;
				if(reqTyp != false)
				{
					if(typeof(tVal) == 'object' && tVal == null) error = uniq_error_msg["req-text"];
					else
					error = ( reqTyp == "int" )?((tVal > 0 || tVal < 0)? false:((/^\d+$/.test(tVal) == true || tVal == "")?uniq_error_msg["req-int"]:uniq_error_msg["req-text"])):((tVal != "")?false:uniq_error_msg["req-text"]);		
					
				}		
				/* Check Required <<< */

				/* Check pattern or function call >>> */		
				if(error == false && in_vld.method != "")
				{
					if(typeof(BTT_val_default.pattern[in_vld.method]) == "function")
					{
						error = BTT_val_default.pattern[in_vld.method](tObj);
					}
					else 
					{
						if(tVal.match(BTT_val_default.pattern[in_vld.method]) || tVal == "")
						error = false;
						else
						error = uniq_error_msg.pattern;			
					}
				}
				/* Check pattern or function call <<< */		
							
				/* Check length >>> */		
				
				if(error == false)
				{
				if(typeof(tVal) == "object" && tVal == null) tVal = "";
				
					if(tVal != "" && in_vld.min > 0 && tVal.length <  in_vld.min)
					{
						error = uniq_error_msg.min.replace(/\[\[min\]\]/g,in_vld.min);	
					}

					if(error == false && in_vld.max > 0 && tVal.length > in_vld.max)
					{
						error = uniq_error_msg.max.replace(/\[\[max\]\]/g,in_vld.max);
					}
				}
				/* Check length <<< */		
								
			if(error != false) error = error.replace(/\[\[val\]\]/g,tVal);
			showError(tObj,error,vld_type);				
		},
		apply_val_for_elm = function(parElm)
		{		
			var Form_Obj = (parElm[0].localName == "form")?parElm:parElm.closest("form");
			
			if(Form_Obj.length == 0){ alert("No Form Element found."); return false;}
		
		var onAct = "";
			parElm.find("[BTT_validate]").each(function()
			{				
			var fInd = Form_Obj.attr("BTT_form_vald_id"),		
			vld_type = (typeof($(this).attr("BTT_val_dsp_type")) != "undefined")?$(this).attr("BTT_val_dsp_type"):(typeof(Form_Obj.attr("BTT_val_dsp_type")) != "undefined"?Form_Obj.attr("BTT_val_dsp_type"):(typeof(BTT_val_data.dsp_type)!= "undefined"?BTT_val_data.dsp_type:BTT_val_default["dsp_type"])); 			

					if($(this).parent().find(".BTT_val_error_space").length == 0)
					if(vld_type == "msg") $(this).parent().append("<small class='BTT_val_error_space' style='display:none'></small>");		

					f_vld = find_validations($(this).attr("BTT_validate")); 
					
					if(typeof(BTT_val_default["forKeyPress"][f_vld.method]) != "undefined" && BTT_val_values[fInd].call_on != "submit_only")
					{
						$(this).on("keypress",function(event)
						{
							var ku_vld = find_validations($(this).attr("BTT_validate")); 				
							CCod = (event.which) ? event.which : event.keyCode;

							if((event.which == 0 && BTT_val_default.comKey.indexOf(CCod) != -1) || BTT_val_default.mandKeys.indexOf(CCod) != -1) 
							return true;						

							keyUpval = BTT_val_default["forKeyPress"][ku_vld.method];
							key_exist = check_if_key_exist(keyUpval.values,CCod);			
							
							var ret = (key_exist == false )?((keyUpval.type=="in")?false:true):((keyUpval.type=="in")?true:false);

							return ret;			
						});					
					}					
					
					onAct = $(this).get(0).tagName.toLowerCase() == "select"?"change":"input";					
					$(this).on(onAct,function(event) { validate_each_field($(this),event,"");	});			
			});
		},
		remove_from_validation = function(Form_Obj)
		{
			if(Form_Obj[0].localName != "form")
			{
			alert("Function is not called for Form Element");
			return false;
			}			
			var fInd = Form_Obj.attr("BTT_form_vald_id");
			
			if(fInd == "undefined") return false;
			
			delete BTT_val_values[fInd]; 
			Form_Obj.find(".BTT_val_error_space").remove();
			Form_Obj.find("[btt_val_has_error]").each( function(){$(this).removeAttr("btt_val_has_error"); });
			Form_Obj.removeAttr("BTT_form_vald_id");
			
			Form_Obj.find("[BTT_validate]").each(function()
			{
			$(this).unbind( "input" );
			$(this).unbind( "keypress" );
			});
			Form_Obj.find("[type=submit]:visible").attr("disabled",false);
		},
		validate_form = function(fObj,ret,f_eve)
		{			
		var pop_form = fObj.attr("form_table");
			
		if(typeof(ret) == "undefined") ret = "boolean";
		if(typeof(f_eve) == "undefined") f_eve = "";
		
			var fInd = fObj.attr("BTT_form_vald_id"),
				can_sub = true;
	
			/* call before callback function */	
			if(BTT_val_values[fInd]["BTT_val_cb_before"] != "") can_sub = BTT_val_values[fInd]["BTT_val_cb_before"](fObj);
				
			if(typeof(callBackonValidation['before'][pop_form])!= "undefined" && can_sub == true)
			{				
				can_sub = callBackonValidation['before'][pop_form](fObj);
			}	
			
				if(can_sub != false)
				{
				can_sub = true;				

				if(BTT_val_values[fInd].call_on == "both" || BTT_val_values[fInd].call_on == "submit_only" || ret == "count")
				{				
					fObj.find("[BTT_validate]").each(function(event)
					{
						if(typeof($(this).attr("BTT_val_has_error") == "undefined") || $(this).attr("BTT_val_has_error") != 1)
						validate_each_field($(this),f_eve,ret);						
					});
					
					if(fObj.find("[BTT_val_has_error=1]").length > 0)
					{
					fObj.find("[BTT_val_has_error=1]:visible").first().focus();
					can_sub = false;
					}					
				}						
				if(can_sub == false)console.log(fObj.find("[BTT_val_has_error=1]"));					
	
				/* call after callback function */	
				if(can_sub != false)	
				if(BTT_val_values[fInd]["BTT_val_cb_after"] != "") can_sub = BTT_val_values[fInd]["BTT_val_cb_after"](fObj);
				
				}		
					
			if(ret == "boolean")		
			return can_sub;	
			else if(ret == "count")
			{
			return fObj.find("[BTT_val_has_error=1]").length;
			}
		}
	
	$.fn.BTT_form_validate = function(BTT_val_data_inp)
	{
	BTT_val_data =(typeof(BTT_val_data_inp) != "undefined")?BTT_val_data_inp:{};
		
	if(typeof(BTT_val_data.forKeyPress) == "object") $.extend( BTT_val_default.forKeyPress, BTT_val_data.forKeyPress );
	if(typeof(BTT_val_data.pattern) == "object") $.extend( BTT_val_default.pattern, BTT_val_data.pattern );
		
	if(typeof(BTT_val_data.error) == "object" && typeof(BTT_val_data.error.pattern) == "object")
	{
	$.extend( BTT_val_default.error.pattern, BTT_val_data.error.pattern );
	delete BTT_val_data.error.pattern; 
	
	$.extend( BTT_val_default.error, BTT_val_data.error );
	}
	else if(typeof(BTT_val_data.error) != "undefined" && typeof(BTT_val_data.error.pattern) != "undefined")
	{	
	$.extend( BTT_val_default.error, {"pattern":{"default":BTT_val_data.error.pattern}} );
	}
	
	var vld_type = "",
		Form_Obj = "",
		split_vld = "",
		this_spc = {},
		CCod = "",
		key_exist = false;
		
		$(this).each(function()
		{		
		ind = $("[BTT_form_vald_id]").length;
		
		Form_Obj = $(this);
		
		if(Form_Obj[0].localName != "form") 
		{
		alert("The Element is not a Form. Please call the function for 'form' Elements");
		return;
		}		
			$(this).submit(function(event)
			{
				return validate_form($(this),"boolean",event);				
			});					
					
			BTT_val_values[ind] = {};
			$(this).attr("BTT_form_vald_id",ind);
					
			BTT_val_values[ind]["BTT_val_cb_before"] = (typeof($(this).attr("BTT_val_cb_before")) != "undefined")?BTT_val_data[$(this).attr("BTT_val_cb_before")]:((typeof(BTT_val_data.cb_before)!= "undefined")?BTT_val_data.cb_before:"");

			BTT_val_values[ind]["BTT_val_cb_after"] = (typeof($(this).attr("BTT_val_cb_after")) != "undefined")?BTT_val_data[$(this).attr("BTT_val_cb_after")]:((typeof(BTT_val_data.cb_after)!= "undefined")?BTT_val_data.cb_after:"");
						
			BTT_val_values[ind]["call_on"] = (typeof($(this).attr("BTT_val_call_on")) != "undefined")?$(this).attr("BTT_val_call_on"):((typeof(BTT_val_data.call_on)!= "undefined")?BTT_val_data.call_on:BTT_val_default["call_on"]);
			
			apply_val_for_elm(Form_Obj);
			
			//if(BTT_val_values[ind]["call_on"] != "submit_only")
			
		});			
	}
	
	$.fn.BTT_form_val_extend = function()
	{
		$(this).each(function(){ apply_val_for_elm($(this)); });
	};
	
	$.fn.BTT_form_val_remove = function()
	{
		$(this).each(function(){ remove_from_validation($(this)); });
	};	

	$.fn.BTT_form_val_check = function()
	{	
	var opt = {};
		$(this).each(function(ind){ opt[ind] = {"form":$(this),"error_count":validate_form($(this),"count")}; });
		
		if(Object.keys(opt).length == 1)
		return opt[0].result;	
		else return opt;
	};	
})(jQuery);