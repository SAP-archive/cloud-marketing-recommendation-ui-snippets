/*
 * SAP Marketing Recommendation Integration Example
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

/**
 * This is the snippet to render recommendations of offers in
 * 	a banner and its supported arguments.
 *
 * <div
 *	data-divRecoOfferBannerId="myDivId" (required)
 *	data-bannerWidth="80%"
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
			var $bannerParentDivs = $('[data-divrecoproductcarouselid]');

			$.each($bannerParentDivs, function () {
				var $bannerParentDiv = $(this);
				var params = $bannerParentDiv.data();
				var divId = params["divrecoproductcarouselid"];

				RecoCore.getProductRecommendations(divId, params)
					.then(setUpCarouselView.bind(null, divId, $bannerParentDiv))
			});
		});
	}

	function setUpCarouselView(divId, $carouselDiv, data) {
		var params = $carouselDiv.data();
		var recommendationList = data.recommendationList;
		var productInfos = data.productInfos;
		var imageElements = data.imageElements;


		var orientation = params['orientation'];
		var isVertical = orientation == 'vertical' ? true : false;
		var uniqueItemsContainer = divId + "-item-container";
		var uniqueThumbnailContainer = divId + "-item-thumbnail-container";
		var uniqueItemsText = divId + "-item-text";
		var itemTextClasses = [uniqueItemsText, "item-text-properties"]
		var itemContainerClasses = [uniqueItemsContainer, adaptCSSClassIf(isVertical, "item-container")]
		var itemThumbnailContainerClasses = [uniqueThumbnailContainer, "thumbnail-container"]
		var carouselClasses = ["carousel-container", "custom-slick-btn", adaptCSSClassIf(isVertical, "carousel")]
		var $carousel = $("<div>", { "class": carouselClasses.join(" "), "id": divId });

		for (var i = 0; i < recommendationList.length; i++) {
			var productId = recommendationList[i].ResultObjectId;

			var item = productInfos[productId];
			var productName = item.ProductName;
			var productImageUrl = item.ProductImageUrl;
			var productTargetUrl = item.ProductTargetUrl;

			var imgElement = imageElements[productImageUrl];
			imgElement.className = "thumbnail-product";

			$carousel.append($("<div>")
				.append($("<div>", { "class": itemContainerClasses.join(" ") })
					.append($("<a>", { "target": "_top", "href": productTargetUrl })
						.append($("<div>", { "class": itemThumbnailContainerClasses.join(" ") })
							.append(imgElement)))
					.append($("<div>", { "class": itemTextClasses.join(" "), "text": productName }))));
		}

		$carouselDiv.append($carousel)
		// Additional set up for vertical and horizontal
		if (isVertical) {
			setVerticalCarouselImageWidth($carouselDiv, uniqueThumbnailContainer);
			setVerticalCarouselCenter($carouselDiv, uniqueItemsContainer);
			$(window).resize(function () {
				setVerticalCarouselImageWidth($carouselDiv, uniqueThumbnailContainer);
				setVerticalCarouselCenter($carouselDiv, uniqueItemsContainer);
				setTextToImageWidth($carousel);
			});
		} else {
			var mq = window.matchMedia('(max-width: 1200px)');
			mq.addListener(function() {setTextToImageWidth($carousel)});
		}

		setTextToImageWidth($carousel);
		setCSSPropertiesFromSnippet(params, uniqueItemsText);

		createSlick($carousel, isVertical);

		function setCSSPropertiesFromSnippet(params, uniqueItemsText) {
			var fontColor = params['carouselfontcolor'];
			fontColor = typeof fontColor != "undefined" ? fontColor : "#000000";
			$("." + uniqueItemsText).css('color', fontColor);
		}

		// HTML + Carousel API = no way to make the text follow image's width
		function setTextToImageWidth($carousel) {
			$carousel.find(".thumbnail-product").each(function(i, element) {
				var $carouselItem = $(element).parent().parent().parent();
				$carouselItem.find(".item-text-properties").css('width', $(element).innerWidth())
			});
		}

		// Undefined behavior if images not same dimensions
		function setVerticalCarouselImageWidth($carouselDiv, uniqueThumbnailContainer) {
			var $images = $carouselDiv.find(".thumbnail-product");
			var ratio = $images.prop("naturalHeight") / $images.prop("naturalWidth");
			var newHeight = $carouselDiv.width() * ratio;
			$('.' + uniqueThumbnailContainer).css({
				"height": newHeight,
				"width": $carouselDiv.width()
			});
		}

		function setVerticalCarouselCenter($carousel, uniqueItemsContainer) {
			var $images = $carouselDiv.find(".thumbnail-product");
			var availableWidth = $carouselDiv.width() - $images.width();
			var paddingForCenter = Math.max(availableWidth / 2, 0)
			$('.' + uniqueItemsContainer).css("padding-left", paddingForCenter);
		}
	}

	function createSlick($carousel, isVertical) {
		$carousel.slick({
			lazyLoad: 'progressive',
			infinite: false,
			vertical: isVertical,
			verticalSwiping: isVertical,
			initialSlide: 0,
			swipeToSlide: true,
			centerMode: false,
			slidesToShow: 2,
			variableWidth: !isVertical,
			touchThreshold: 25,
			waitForAnimate: false,
			autoplay: false,
			autoplaySpeed: 3500,
			arrows: !isVertical,
			dots: false,
			speed: 500,
		});

		// Set the height to the provided div's height
		if (isVertical) {
			var $slickWindow = $carousel.find('.slick-list');
			var $providedDiv = $carousel.parent().parent();

			// work around for vertical carousel's height
			$carousel.on('setPosition', function() {
				adjustCarouselVerticalHeight($slickWindow, $providedDiv);
			})

			adjustCarouselVerticalHeight($slickWindow, $providedDiv);
		}

		function adjustCarouselVerticalHeight($slickWindow, $providedDiv) {
			$slickWindow.height($providedDiv.height() - 100);
			$slickWindow.css('padding', "0px 0px");
		}
	}

	function adaptCSSClassIf(isVertical, CSSClass) {
		return isVertical ? CSSClass.concat("-v") : CSSClass.concat("-h");
	}

	main();
})