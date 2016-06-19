function Cards(car){
    this.car = car;
    this.xStart = 0;
	this.yStart = 0;
	this.touchStart = false;
	this.posX = 0;
    this.posY = 0;
    this.lastPosX = 0;
    this.lastPosY = 0; 
    this.pane_width = 260;
    this.pane_count = 0;
    this.current_pane = 0;
    this.threshold = 1;
}
Cards.prototype.render = function(){
    var contentHTML = "<li data-dealer='" + this.car.dealer_url + "' id='" + this.car.id + "'><div><img src=" + this.car.img_url + "></img><div class='liked'></div><div class='nope'></div><div id='car-data'><div>Company: " + this.car.company + "</div><div>Name: " + this.car.name + "</div><div>Make: " + this.car.make + "</div><div>Price(Ex-showroom): " + this.car.price + "</div></div></div></li>";
    $(".car-cards ul").append(contentHTML);
    this.card = $("#" + this.car.id);
    this.likeSelector = $(".liked");
    this.dislikeSelector = $(".nope");
    this.attachevententHandlersForCard();
};
Cards.prototype.onLike = function(element){
    var component = this;
    window.location.href = $(element).attr("data-dealer");
};
Cards.prototype.attachevententHandlersForCard = function () {
	var component = this;
	var handler = function (event) {
		var self = this;
		event.preventDefault();
		switch (event.type) {
		case 'touchstart':
			if (component.touchStart === false) {
				component.touchStart = true;
				component.xStart = event.originalEvent.touches[0].pageX;
				component.yStart = event.originalEvent.touches[0].pageY;
			}
		case 'mousedown':
			if (component.touchStart === false) {
				component.touchStart = true;
				component.xStart = event.pageX;
				component.yStart = event.pageY;
			}
		case 'mousemove':
		case 'touchmove':
			if (component.touchStart === true) {
				var pageX = typeof event.pageX == 'undefined' ? event.originalEvent.touches[0].pageX : event.pageX;
				var pageY = typeof event.pageY == 'undefined' ? event.originalEvent.touches[0].pageY : event.pageY;
				var deltaX = parseInt(pageX) - parseInt(component.xStart);
				var deltaY = parseInt(pageY) - parseInt(component.yStart);
				var percent = ((100 / 260) * deltaX) / 7;
				component.posX = deltaX + component.lastPosX;
				component.posY = deltaY + component.lastPosY;

				$(this).css("transform", "translate(" + component.posX + "px," + component.posY + "px) rotate(" + (percent / 2) + "deg)")
				var opa = (Math.abs(deltaX) / component.threshold) / 100 + 0.1;
				if (opa > 1.0) {
					opa = 1.0;
				}
				if (component.posX >= 0) {
					$(this).find(component.likeSelector).css('opacity', opa);
					$(this).find(component.dislikeSelector).css('opacity', 0);
				} else if (component.posX < 0) {

					$(this).find(component.dislikeSelector).css('opacity', opa);
					$(this).find(component.likeSelector).css('opacity', 0);
				}
			}
			break;
		case 'mouseup':
		case 'touchend':
			component.touchStart = false;
			var pageX = (typeof event.pageX == 'undefined') ? event.originalEvent.changedTouches[0].pageX : event.pageX;
			var pageY = (typeof event.pageY == 'undefined') ? event.originalEvent.changedTouches[0].pageY : event.pageY;
			var deltaX = parseInt(pageX) - parseInt(component.xStart);
			var deltaY = parseInt(pageY) - parseInt(component.yStart);

			component.posX = deltaX + component.lastPosX;
			component.posY = deltaY + component.lastPosY;

			var opa = Math.abs((Math.abs(deltaX) / component.threshold) / 100 + 0.1);

			if (opa >= 1) {
				if (component.posX > 0) {
					$(this).animate({
						transform : "translate(" + (component.posX + component.pane_width) + "px," + (component.posY + component.pane_width) + "px) "
					}, 400, function () {
						if (component.onLike) {
							component.onLike(this);
						}
						$(this).remove()
					});
				} else {
					$(this).animate({
						transform : "translate(-" + ( - (component.posX) + component.pane_width) + "px," + (component.posY + component.pane_width) + "px) "
					}, 400, function () {
						$(this).remove();
					});
				}
			} else {
				component.lastPosX = 0;
				component.lastPosY = 0;
				$(this).animate({
					transform : "translate(0px,0px) rotate(0deg)"
				}, 200);
				$(this).find(component.likeSelector).animate({
					"opacity" : 0
				}, 200);
				$(this).find(component.dislikeSelector).animate({
					"opacity" : 0
				}, 200);
			}
			break;
		}
	};
	this.card.bind('touchstart mousedown', handler);
	this.card.bind('touchmove mousemove', handler);
	this.card.bind('touchend mouseup', handler);
};