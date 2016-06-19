function App(){
    this.cards = [];
}
App.prototype.renderApp = function(){
    var mainContainer = $("#main-container");
    this.mainContainer = mainContainer;
    var mainContainerContent = "<div id='cardsContainer' class='cards-container'><div class='car-cards'></div></div><div id='likeDislikeControls' class='actions'>" +
    "<a class='dislike'><img src='images/dislike.png'></img></a><a class='like'><img src='images/like.png'></img></a>" + 
    "</div>";
    this.mainContainer.html(mainContainerContent);
    this.renderCards();
    this.attachEventHandlers();
};
App.prototype.renderCards = function(){
    var cardsHTML = "<ul id='cardsContainers'>";
    cardsHTML += "</ul>";
    $(".car-cards").html(cardsHTML);
    for(var x in cars){
        var card = new Cards(cars[x]);
        card.render();
    }
};
App.prototype.attachEventHandlers = function(){
    $(".like").on("touchstart click", function(){
        var activeCard = $("#cardsContainers li:last-child");
        var width = activeCard.width() * 3;
        var height = activeCard.height()/2;
        $(activeCard).find(".liked").css('opacity', 1);
        $(activeCard).find(".nope").css('opacity', 0);
        $(activeCard).animate({transform : "translate(" + width + "px," + height + "px) rotate(60deg)"}, 600, function(){
            $(activeCard).remove();
            window.location.href = $(activeCard).attr("data-dealer");
        });
    });
    $(".dislike").on("touchstart click", function(){
        var activeCard = $("#cardsContainers li:last-child");
        var width = activeCard.width() * 3;
        var height = activeCard.height()/2;
        $(activeCard).find(".liked").css('opacity', 0);
        $(activeCard).find(".nope").css('opacity', 1);
        $(activeCard).animate({transform : "translate(-" + width + "px," + height + "px) rotate(-60deg)"}, 600, function(){
            $(activeCard).remove();
        });
    });
};