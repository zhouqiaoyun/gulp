$("#dialog-name").show().dialog({
  autoOpen: false,
  height: 180,
  width: 400,
  modal: true,
  buttons: {     
        'Cancel': {
        	click:function(){
        		 $(this).dialog( "close" );
        	},
        	class:'speBack',
        	text:'Cancel'
        },
    	"Submit": {
	    	class:'speDistance',
	    	text:'Submit',		    	
    		click:function() {
		    	//跳转到创建任务页面        
		    	var copy_name=$('#copyname').val();
				if(copy_name==''){
					alert('请填写应用的名称');
					return false;      		
		    	}else{
		    		$.ajax({
						url:url+url_copy_app,		
						type:"post",
						dataType:'json',
						data:{
							app_id:app_id,
							app_name:copy_name
						},
						success:function(data){
					        if(data.status_code==200){
					        	alert('复制成功');
					        	window.location.reload();
					        
					       }else if(data.status_code==201){
					        	alert(data.message);
						    }
						}
					})	
			 	}      	  
	    	}
	    }
      }
       
   }); 
    //修改模型弹框
    $( "#dialog-total" ).show().dialog({
	  autoOpen:false,
	  height:300,
      resizable: false,
      modal: true,
      buttons: {
        "Re-enter":{
        		click:function(){
	        		$( this ).dialog( "close" );
	        	},
	        	class:'notBackground',
	        	text:'Re-enter'
	    	},
        'logore&calculate':{ 
        		click:function(){
	        		$( this ).dialog( "close" );	
	        		//接下来的逻辑
	        	},
	        	class:'sureBackground',
	        	text:'logore&calculate'
      		}
      }
    });
