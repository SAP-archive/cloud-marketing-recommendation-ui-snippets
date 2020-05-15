/*
 * SAP Marketing Recommendation Integration Example
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

/**
 * This is the snippet to render recommendations of offers in
 * 	a carousel and its supported arguments.
 *
 * <div
 *	data-divRecoOfferCarouselId="myDivId" (required)
 *	data-carouselShowMaxNumOffers="" (max is 5)
 * 	data-carouselOfferBoxColor="#cccccc"
 *	data-carouselFontColor="#000000"
 *	data-userId=""
 *	data-userType=""
 *	data-leadingItemIds=""
 *	data-leadingItemType=""
 *	data-basketItemIds=""
 *	data-basketItemType=""
 *	data-context=""
 *	data-position=""
 *	data-communicationMedium=""
 *	data-offerContentType=""
 *	data-withCoupon=""
 *	data-marketingArea=""
 *	data-server="" (required)
 *	data-language="" (EN / FR / ...)
 *	data-h=""
 *	data-l54="" (required)
 *	data-k13="" (required)
 *	data-v="" (required)
 *	data-k14="" (required) >
 * </div>
 */
document.addEventListener('DOMContentLoaded', function() {

	function main() {
		if (typeof RecoCore === "undefined") {
			var element = document.createElement('script');
			document.head.appendChild(element);
			element.type = 'text/javascript';
			element.src = "resources/reco_core.js";
			element.onload = start;
		} else {
			start();
		}
	}

	function start() {
		RecoCore.init({
			slickLib: true,
			additionalResources: [
				// RecoCore.load.js.bind(null,"URL_TO_JS")
			]
		}, function () {
			var $carouselParentDivs = $('[data-divrecooffercarouselid]');

			$.each($carouselParentDivs, function () {
				var $carouselParentDiv = $(this);
				var params = $carouselParentDiv.data();
				var divId = params["divrecooffercarouselid"];

				RecoCore.getOfferRecommendations(divId, params)
					.then(setUpCarouselView.bind(null, divId, $carouselParentDiv))
			});
		});
	}

	function setUpCarouselView(divId, $carouselParentDiv, data) {
		var params = $carouselParentDiv.data();
		var recommendationList = data.recommendationList;
		var offerInfos = data.offerInfos;
		var imageElements = data.imageElements;

		var uniqueItemsContainer = divId + "-item-container";
		var uniqueThumbnailContainer = divId + "-item-thumbnail-container";
		var uniqueItemsText = divId + "-item-text";
		var itemTextClasses = [uniqueItemsText, "item-text-properties", "center-horizontal"]
		var itemContainerClasses = [uniqueItemsContainer, "item-container-h"]
		var itemThumbnailContainerClasses = [uniqueThumbnailContainer, "thumbnail-container"]
		var carouselClasses = ["carousel-container", "custom-slick-btn", "carousel-h"]
		var $carousel = $("<div>", { "class": carouselClasses.join(" "), "id": divId});
		for (var i = 0; i < recommendationList.length; i++) {
			var offerId = recommendationList[i].MarketingOffer;

			var item = offerInfos[offerId];
			var offerImageUrl = item.OfferContentSourceURL;
			var offerTargetUrl = item.OfferContentTargetURL;
			var offerSourceDesc = item.OfferContentSourceURLDesc;

			var imgElement = imageElements[offerImageUrl];
			imgElement.className = "thumbnail-product center-horizontal";

			$carousel.append($("<div>")
				.append($("<div>", { "class": itemContainerClasses.join(" ") })
					.append(($("<div>", { "class": itemThumbnailContainerClasses.join(" ") })
						.append($("<a>", { "target": "_top", "href": offerTargetUrl }).append(imgElement))))
					.append($("<div>", { "class": itemTextClasses.join(" "), "text": offerSourceDesc }))));
		}

		$carouselParentDiv.append($carousel)

		var mq = window.matchMedia('(max-width: 1200px)');
		mq.addListener(function() { setTextToImageWidth($carousel); });

		setTextToImageWidth($carousel);
		setCSSPropertiesFromSnippet(params, uniqueItemsText, uniqueItemsContainer);

		createResponsiveCarouselSlick($carousel, params);
	}

	function setCSSPropertiesFromSnippet(params, uniqueItemsText, uniqueItemsContainer) {
		//text font color
		var fontColor = params['carouselfontcolor'];
		fontColor = typeof fontColor != "undefined" ? fontColor : "#000000";
		$("." + uniqueItemsText).css('color', fontColor);

		//carousel box color
		var boxColor = params['carouselofferboxcolor'];
		boxColor = typeof boxColor != "undefined" ? boxColor : "#dddddd";
		var s = new Option().style;
		s.color = boxColor;
		if (s.color.length > 0) {
			$("." + uniqueItemsContainer).css({
				'background-color': s.color,
				'margin': "1vw",
				'padding-top': "1vw",
				'padding-bottom': "1vw",
				'box-shadow': "1px 1px 8px 1px #cccccc"
			});
		}
	}

	// HTML + Carousel API = no way to make the text follow image's width
	function setTextToImageWidth($carousel) {
		var maxTextHeight = 0;
		$carousel.find(".thumbnail-product").each(function (i, element) {
			var $carouselItem = $(element).parent().parent().parent();
			$carouselItem.find(".item-text-properties").css('width', $(element).innerWidth())
			$carouselItem.find(".item-text-properties").css('height', "auto");
			var itemTextHeight = parseFloat($carouselItem.find(".item-text-properties").css('height'));
			if (itemTextHeight > maxTextHeight) {
				maxTextHeight = itemTextHeight;
			}
		});

		// apply max for uniform view
		$carousel.find(".thumbnail-product").each(function (i, element) {
			var $carouselItem = $(element).parent().parent().parent();
			$carouselItem.find(".item-text-properties").css('height', maxTextHeight + "px");
		});
	}

	function createResponsiveCarouselSlick($carousel, params) {
		var numItems = $carousel.children().length;
		var numItemsToShow = Math.min(numItems, parseInt(params["carouselshowmaxnumoffers"]) || numItems);
		var slidesToShow = Math.min(numItemsToShow, 5);

		//Find most of images' width
		var items = $carousel.find(".thumbnail-product");
		var widthCount = {}
		for (var i = 0; i < items.length; i++) {
			var width = items[i].offsetWidth;
			if (!widthCount[width])
				widthCount[width] = 1
			else {
				widthCount[width]++;
			}
		}

		var maxCount = 0;
		var mostUsedWidth;
		Object.keys(widthCount).forEach(function(key) {
			var value = widthCount[key];
			if (maxCount < value) {
				mostUsedWidth = key;
				maxCount = value;
			}
		});

		//build reponsiveness from 1 ... number of offers to be shown.
		var responsiveSettings = [];
		for (var i = 1; i < slidesToShow; i++) {
			var occurence = {
				breakpoint: (parseInt(mostUsedWidth)+(i*50)) * (i+2) + 50,
				settings: {
					slidesToShow: i,
					initialSlide: numItems > i ? Math.floor(i/2) : 0
				}
			}
			responsiveSettings.push(occurence)
		}

		$carousel.slick({
			lazyLoad: 'progressive',
			infinite: false,
			initialSlide: numItems > slidesToShow ? Math.floor(slidesToShow/2) : 0,
			swipeToSlide: true,
			centerMode: true,
			slidesToShow: slidesToShow,
			touchThreshold: 25,
			waitForAnimate: false,
			autoplay: false,
			autoplaySpeed: 3500,
			arrows: false,
			dots: true,
			speed: 500,
			responsive: responsiveSettings
		});
	}

	main();
})