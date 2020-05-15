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
			var $bannerParentDivs = $('[data-divrecoofferbannerid]');

			$.each($bannerParentDivs, function () {
				var $bannerParentDiv = $(this);
				var params = $bannerParentDiv.data();
				var divId = params["divrecoofferbannerid"];

				RecoCore.getOfferRecommendations(divId, params)
					.then(setUpBannerView.bind(null, divId, $bannerParentDiv))
			});
		});
	}

	function setUpBannerView(divId, $bannerParentDiv, data) {
		var params = $bannerParentDiv.data();
		var recommendationList = data.recommendationList;
		var offerInfos = data.offerInfos;
		var imageElements = data.imageElements;

		//custom width
		var customWidthCSSClass = createCSSForCustomBannerWidth(divId, params);

		var $banner = $("<div>");
		for (var i = 0; i < recommendationList.length; i++) {
			var offerId = recommendationList[i].MarketingOffer;

			var item = offerInfos[offerId];
			var offerImageUrl = item.OfferContentSourceURL;
			var offerTargetUrl = item.OfferContentTargetURL;

			var imgElement = $(imageElements[offerImageUrl]);
			imgElement.addClass("banner-offer " + customWidthCSSClass);
			imgElement.data("url", offerTargetUrl);
			imgElement.on("click", function() {
			 	window.location.href = $(this).data("url");
			});

			$banner.append($("<div>").append(imgElement));
		}

		$bannerParentDiv.append($banner);
		$banner.slick({
			lazyLoad: 'progressive',
			infinite: false,
			autoplay: true,
			autoplaySpeed: 3500,
			dots: true,
			speed: 500,
		});
	}

	function createCSSForCustomBannerWidth(divId, params) {
		var bannerWidth = params["bannerwidth"] || "auto";
		var customWidthCSSClass = "banner-custom-width-" + divId;
		var style = document.createElement('style')
		style.type = "text/css";
		style.innerHTML = "." + customWidthCSSClass + "{width: " + bannerWidth + ";}"
		document.getElementsByTagName('head')[0].appendChild(style)
		return customWidthCSSClass;
	}

	main();
})