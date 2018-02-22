 window.onload = function() {
      // var faceArray=[]; //全局数组，存储人脸信息
      var video = document.getElementById('video'),
          canvas = document.getElementById('canvas'),
          snap = document.getElementById('tack'),
          img=document.getElementById('img'),
          upload=document.getElementById('upload');

          //视频录制模块
          var tracker1 = new tracking.LandmarksTracker();
          tracker1.setInitialScale(4);
          tracker1.setStepSize(2);
          tracker1.setEdgesDensity(0.1);
          tracking.track(video, tracker1, { camera: true });

    
          snap.addEventListener('click', function(){
           
              //绘制canvas图形，将video中的图像绘制到canvas中
              canvas.getContext('2d').drawImage(video, 0, 0, 400, 300); 
                
              //把canvas图像转为img图片
              img.src= canvas.toDataURL("image/png"); //"img/faces.jpg";

        });
         upload.addEventListener('click',function(){
              var base=canvas.toDataURL('image/png').substr(22);
              $.ajax({
              type: "POST",
              url: "upload.php",
              async: true,
              data: {base:base},
              dataType: "json",
              success: function (data) {
                $(".rect").remove();
                $("#takephoto").animate({marginRight:-500+'px'},400);
                $("#iden").slideDown();
                $("#handler")[0].src=data.path;
              },
              error: function (err) {
                console.log(err);
              }
           });
        });
         $('#faceIden').click(function(){
            $(document.createElement('progress')).addClass('pro').appendTo($("body"));
            var subscriptionKey = "e855b26783354f34bee9e62f3cde752a";
            var uriBase = "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect";//无需更改
            // Request parameters.
            var params = {
                "returnFaceId": "true",
                "returnFaceLandmarks": "false",
                "returnFaceAttributes": "age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise",
            };
            // Display the image.
            var sourceImageUrl = document.getElementById("handler").src;
            console.log(sourceImageUrl);
            // Perform the REST API call.
            $.ajax({
                url: uriBase + "?" + $.param(params),

                // Request headers.
                beforeSend: function(xhrObj){//在请求发送前设置头信息
                    xhrObj.setRequestHeader("Content-Type","application/json");//返回JSON格式数据
                    xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
                },

                type: "POST",
                dataType:'json',
                // Request body.
                data: '{"url": ' + '"' + sourceImageUrl + '"}',
            })

            .done(function(data) {
                $("progress").remove();
                
                var str='';
                if(data.length>0){
                  for(var i=0;i<data.length;i++){
                    var rect=data[i].faceRectangle;
                    drawRect(rect.left,rect.top,rect.width,rect.height);
                    str+="<p>人物"+(i+1)+"</p><p>年龄: "+data[i].faceAttributes.age+"岁</p><p>性别: ";
                     if(data[i].faceAttributes.gender=="female"){
                        str+="女</p>";
                      }else{
                        str+="男</p>";
                      }
                      // alert("sex:"+str);
                      // if(data[i].faceAttributes.glasses!="ReadingGlasses"){
                      //   if(Determine_glasses(data[i].faceAttributes.accessories)){
                      //     str+="<p>装饰:戴着眼镜</p>";
                      //   }
                        
                      // }
                      // alert("glasses:"+str);
                      str+="<p>心情: "+Determine_emotion(data[i].faceAttributes)+"</p>";//<p>发色："+idenHairColor(data[i].faceAttributes.hair.hairColor)+"</p>
                  }
       
                }else{
                  str="未检测到人像！";
                }
                $("#datainfo").slideDown().html(str);
            })

            .fail(function(jqXHR, textStatus, errorThrown) {
               $("progress").remove();
                // Display error message.
                var errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): ";
                errorString += (jqXHR.responseText === "") ? "" : (jQuery.parseJSON(jqXHR.responseText).message) ? 
                    jQuery.parseJSON(jqXHR.responseText).message : jQuery.parseJSON(jqXHR.responseText).error.message;
                alert(errorString);
            });
         });
         function Determine_emotion(y) {
          // alert("Determine_emotion");
           var temp=y.emotion["anger"];
           var p;
           for(var i in y.emotion){
              if (y.emotion[i]>temp){
               
               temp=y.emotion[i];
               p=i;
             }
           }
           var s;
           switch(p)
           {
             case "anger": s="生气";break;
             case "contempt": s="蔑视";break;
             case "disgust": s="厌恶";break;
             case "fear": s="害怕";break;
             case "happiness":s= "开心";break;
             case "neutral": s="平静";break;
             case "sadness": s="伤心";break;
             case "surprise":s= "惊讶";break;
           }
          // alert(s);
          return s;
        }

        function drawRect(x, y, w, h) {  //绘制方框
              var rect = document.createElement('div');
              document.querySelector('#iden').appendChild(rect);
              rect.classList.add('rect');
              rect.style.width = w + 'px';
              rect.style.height = h + 'px';
              rect.style.left = x + 'px';
              rect.style.top = y + 'px';

            };
        // function Determine_glasses(y) {
        //   // alert("Determine_emotion");
        //    var temp=y[0].confidence;
        //    var p=true;
        //    for(var i=0;i<y.length;i++){
        //     if(y[i].type=='glasses'&&y[i].confidence>0.8){
        //         p=true;
        //       }else{
        //         p=false;
        //       }
        //     }
        //    }
           
        //   // alert(s);
        //   return p;
        // }

        // function idenHairColor(attr){
        //   // alert("idenHairColor");
        //   var color;var j;
        //   var con=attr[0].confidence;
        //   for(var i=0;i<attr.length;i++){
        //     if(attr[i].confidence>con){
        //       con=attr[i];
        //       j=i;
        //     }
        //   }
        //   color=attr[j].color;
        //   alert(color);
        //   return color;
        // }
  }