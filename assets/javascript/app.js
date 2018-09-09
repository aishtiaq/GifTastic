var topics = [
    'apple', 'banana', 'strawberry', 'pumpkin', 'tomato', 'pineapple',
    'orange', 'squash','blueberry','cherry tomato'
]
var offset= 0;
var queryURL="";
function init() {
    for (var i=0;i<topics.length; i++) {
        var button=$("<button>");
        button.addClass("btn btn-secondary px-3 mx-3 my-2");
        button.html(topics[i]);
        button.attr("id", topics[i]);
        $("#buttons").append(button);
    }
}



$(document).ready(function() {
    //get items from local storage
    if(localStorage.getItem('links')){
        $("#fav").html(localStorage.getItem('links'));
    }

    var btnPrev='';
    var btnCurr='';
  
    $(document).on("click", ".btn",function(){
        // $(".btn").on("click", function(){
        if(btnCurr!='') {
            btnPrev = btnCurr;
        }
        btnCurr=$(this).attr("id");

        console.log($(this).attr("id"));
        if($(this).attr("id")==='submit') {
            
            topics.push($("#newBtn").val());
            var button=$("<button>");
            button.addClass("btn btn-secondary px-3 mx-3 my-2");
            button.html($("#newBtn").val());
            button.attr("id", $("#newBtn").val().replace(/\s+/g, '+'));
            $("#buttons").append(button);
            btnCurr=$("#newBtn").val();
            $("#newBtn").val("");
        }
        
        if(btnPrev===btnCurr) {
            offset=offset+10;
            queryURL = "http://api.giphy.com/v1/gifs/search?q="+btnCurr.replace(/\s+/g, '+')+"&api_key=dc6zaTOxFJmzC&limit=10&offset="+offset;
            
         }
        else {
            queryURL = "http://api.giphy.com/v1/gifs/search?q="+btnCurr.replace(/\s+/g, '+')+"&api_key=dc6zaTOxFJmzC&limit=10";
            $("#results").empty();
        }
        $.ajax({
          url: queryURL,
          method: "GET"
        }).then(function(response) {
           
            for (var i=0; i< 10; i++) {
                var myDiv = $("<div class='float-left'>");
                var imageDiv =$("<div>");
                var image = $("<img>");
                var url=response.data[i].images.fixed_height_still.url;
                
                var title = $('<p class="px-2 mb-0 mt-4">');
                title.html("<b>Title</b>: "+response.data[i].title);

                myDiv.append(title);

                var p = $('<p class="px-2 my-0">');
                p.html("<b>Rating</b>: "+response.data[i].rating);

                myDiv.append(p);
                
                image.attr("src",url);
                image.attr("data-still",url);
                image.attr("data-animate",response.data[i].images.fixed_height.url);
                image.attr("data-state","still");
                image.addClass("image-fluid px-2 gif");
                
                imageDiv.append(image);
                myDiv.append(imageDiv);

                var favButton = $("<p class='mt-1 mx-1'>");
                favButton.html('<i class="fas fa-star float-left"></i>');
                myDiv.append(favButton);

                var dlHTML= "<a href='"+response.data[i].images.original_mp4.mp4+"' target='_blank' download><i class='float-right fas fa-download'></i></a>";
                
                favButton.append(dlHTML);
                myDiv.append(favButton);

                $("#results").append(myDiv);

                
            }
           
          
        });

    })
  
    $(document).on("click",".gif", function() {
        console.log ("I am here");
        var state = $(this).attr("data-state");
        
        if(state==="still") {
            var animate = $(this).attr("data-animate");
            $(this).attr("src",animate);
            $(this).attr("data-state","animate");
        } else if (state === "animate") {
            var still = $(this).attr("data-still");
            $(this).attr("src",still);
            $(this).attr("data-state","still");
        }

    });
    
    $(document).on("click",".fa-star", function() {
        
        $("#fav").append($("<div>").html($(this).parent().prev().html()));
        localStorage.setItem('links',$("#fav").html());
    });
  
});

