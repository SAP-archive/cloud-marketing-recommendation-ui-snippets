/*
 * SAP Marketing Recommendation Integration Example
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

/**
 * This will contain core functions to get Recommendations of type
 * Offer or Product.
 */

(function () {
	var recommendationsByDivId = {};
	var itemInfosByDivId = {};
	var imageElements = {};

	var load = (function () {
		function file(type) {
			return function (url, condition) {
				return new Promise(function (resolve, reject) {
					condition = typeof condition == 'undefined' ? true : condition

					if (condition) {
						var element = document.createElement(type)
						document.head.appendChild(element);

						switch (type) {
							case "script":
								element.type = 'text/javascript';
								element.src = url;
								break;
							case "link":
								element.type = 'text/css';
								element.rel = 'stylesheet';
								element.href = url;
								break;
							case "img":
								element.src = url;
								imageElements[url] = element;
								break;
						}

						element.onload = function () { resolve(); }
						element.onerror = function () { reject(url); }
					} else {
						resolve();
					}
				});
			}
		}

		return {
			css: file('link'),
			js: file('script'),
			img: file('img')
		}
	})()

	var loadJQueryLib = function () {
		var pathTojQuery = 'https://code.jquery.com/jquery-2.2.1.min.js';
		var condition = typeof jQuery == 'undefined';
		return load.js(pathTojQuery, condition)
	}

	var loadSlickLib = function () {
		var pathToSlickJS =
			"https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.9.0/slick.min.js";
		var pathToSlickCSS =
			"https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.9.0/slick.min.css";
		var pathToSlickThemeCSS =
			"https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.9.0/slick-theme.min.css";
		var pathToRecoCSS = "./resources/css/reco-custom.css";
		var pathToRecoArrowsCSS = "./resources/css/reco-arrows.css";

		return [
			load.js(pathToSlickJS),
			load.css(pathToSlickCSS),
			load.css(pathToSlickThemeCSS),
			load.css(pathToRecoCSS),
			load.css(pathToRecoArrowsCSS),
		];
	}

	var loadLibraries = function(withOption) {
		var promiseChain = loadJQueryLib();
		promiseChain = promiseChain.then(function () {
			var aResourcesPromises = []
			if (withOption.slickLib) {
				aResourcesPromises = aResourcesPromises.concat(loadSlickLib())
			}

			if (withOption.additionalResources && Array.isArray(withOption.additionalResources)) {
				aResourcesPromises = aResourcesPromises.concat(withOption.additionalResources.map(function(oResourcePromise) {
					return oResourcePromise();
				}));
			}

			return Promise.all(aResourcesPromises);
		 })
		return promiseChain;
	}

	var preloadImages = function(mAccessors, data) {
		var items = process(data)

		var imageUrls = {}
		if (!itemInfosByDivId[mAccessors.DIV_ID])
			itemInfosByDivId[mAccessors.DIV_ID] = {};

		for (var i = 0; i < items.length; i++) {
			itemInfosByDivId[mAccessors.DIV_ID][items[i][mAccessors.KEY_ID]] = items[i];
			if (!imageUrls.hasOwnProperty(items[i][mAccessors.KEY_URL]))
				imageUrls[items[i][mAccessors.KEY_URL]] = i;
		}

		var imagesToPreload = Object.keys(imageUrls).map(function (x) { return load.img(x); })
		return Promise.all(imagesToPreload);

		/**
		* Processes arguments to concatenate all items from requested
		* origins
		*/
		function process(info) {
			var items = [];
			for (var i = 0; i < info.length; i++) {
				var response = info[i].d;
				if (typeof response != "undefined")
					items = items.concat(response.results)
			}
			return items.filter(function (item) {
				return item[mAccessors.KEY_URL] !== "";
			});
		}
	}

	//Force https in all requests to avoid browser redirects
	var setHttpsInURL = function(serverURL) {
		var serverURLHttps = serverURL
		if (serverURL.indexOf("http://") === 0) {
			serverURLHttps = serverURL.replace("http", "https");
		}
		return serverURLHttps;
	}

	//Converts to the correct parameter format accepted by URL Request
	function formatWith(c, p) {
		return (typeof (p) != 'undefined' ? (p.toString().length > 0 ? c + p + c : "''") : "''");
	}

	//Add URL parameter if argument is not empty
	function addURLParam(key, value) {
		return value != "''" ? "&" + key + "=" + value : "";
	}

	function handleWithCoupon(value) {
		var result = "";
		value = typeof value === "boolean" ? value.toString() : value;
		if (typeof value === "string") {
			lowerCaseValue = value.toLowerCase();
			if (lowerCaseValue === "true" || lowerCaseValue === "x") { //offer with coupons
				result = "X"
			} else if (lowerCaseValue === "false" || lowerCaseValue === " ") { //offer with no coupons
				result = " ";
			}
		}
		return formatWith("'", result); //offer with or without coupons
	}

	var fetchOfferRecommendations = function(divId, params) {
		var serviceURL = setHttpsInURL(params['server']) +
			"/api/API_MKT_RECOMMENDATION_SRV/GetOfferRecommendations?" +
			addURLParam("UserType", formatWith("'", params['usertype'])) +
			addURLParam("LeadingItemIds", formatWith("'", params['leadingitemids'])) +
			addURLParam("LeadingItemType", formatWith("'", params['leadingitemtype'])) +
			addURLParam("BasketItemIds", formatWith("'", params['basketitemids'])) +
			addURLParam("BasketItemType", formatWith("'", params['basketitemtype'])) +
			addURLParam("ContextParameters", formatWith("'", params['context'])) +
			addURLParam("Language", formatWith("'", params['language'])) +
			addURLParam("Position", formatWith("'", params['position'])) +
			addURLParam("CommunicationMedium", formatWith("'", params['communicationmedium'])) +
			addURLParam("OfferContentType", formatWith("'", params['offercontenttype'])) +
			addURLParam("WithCoupon", handleWithCoupon(params['withcoupon'])) +
			addURLParam("MarketingArea", formatWith("'", params['marketingarea'])) +
			addURLParam("_L54AD1F204_", formatWith("'", params['l54'])) +
			addURLParam("_K13_", formatWith("", params['k13'])) +
			addURLParam("_V_", formatWith("", params['v'])) +
			addURLParam("_K14_", formatWith("'", params['k14']));

		var url;
		var headers = {};

		if (params['h'] && params['userid']) {
			url = serviceURL;
			headers['_u_'] = params['userid'];
			headers['_h_'] = params['h'];
		} else {
			url = serviceURL + addURLParam("UserId", formatWith("'", params['userid']));
		}

		return new Promise(function(resolve, reject) {
			$.ajax({
				type: "GET",
				dataType: "json",
				crossDomain: true,
				headers: headers,
				async: true,
				url: url,
				error: function () { console.log("ERROR: GetRecommendations call"); reject(); },
				success: function (data) {
					recommendationsByDivId[divId] = data.d.results;
					resolve([data]);
				}
			});
		});
	}

	var fetchProductRecommendations = function(divId, params) {
		var serviceURL = setHttpsInURL(params['server']) +
			"/api/API_MKT_RECOMMENDATION_SRV/GetRecommendations?" +
			addURLParam("UserType", formatWith("'", params['usertype'])) +
			addURLParam("LeadingItemIds", formatWith("'", params['leadingitemids'])) +
			addURLParam("LeadingItemType", formatWith("'", params['leadingitemtype'])) +
			addURLParam("BasketItemIds", formatWith("'", params['basketitemids'])) +
			addURLParam("BasketItemType", formatWith("'", params['basketitemtype'])) +
			addURLParam("ContextParameters", formatWith("'", params['context'])) +
			addURLParam("_L54AD1F204_", formatWith("'", params['l54'])) +
			addURLParam("_K13_", formatWith("", params['k13'])) +
			addURLParam("_V_", formatWith("", params['v'])) +
			addURLParam("_K14_", formatWith("'", params['k14']));

		var url;
		var headers = {};

		if (params['h'] && params['userid']) {
			url = serviceURL;
			headers['_u_'] = params['userid'];
			headers['_h_'] = params['h'];
		} else {
			url = serviceURL + addURLParam("UserId", formatWith("'", params['userid']));
		}

		return new Promise(function(resolve, reject) {
			$.ajax({
				type: "GET",
				dataType: "json",
				crossDomain: true,
				headers: headers,
				async: true,
				url: url,
				error: function () { console.log("ERROR: GetRecommendations call"); reject(); },
				success: function (data) {
					recommendationsByDivId[divId] = data.d.results;
					resolve(data);
				}
			});
		})
	}

	var fetchProducts = function(params, data) {
		var results = data.d.results;
		var productsOrigins = {}

		for (var i = 0; i < results.length; i++) {
			var resultObjectType = results[i].ResultObjectType
			var resultObjectId = results[i].ResultObjectId
			if (productsOrigins.hasOwnProperty(resultObjectType))
				productsOrigins[resultObjectType].push(resultObjectId);
			else
				productsOrigins[resultObjectType] = [resultObjectId];
		}

		// Each product origin required its own ajax call.
		var requests = [];
		for (var productOrigin in productsOrigins) {
			var productIds = productsOrigins[productOrigin].join();
			var serviceURL = setHttpsInURL(params['server']) +
				"/api/API_MKT_RECOMMENDATION_SRV/GetProducts?" +
				addURLParam("ProductIds", formatWith("'", productIds)) +
				addURLParam("ProductOrigin", formatWith("'", productOrigin)) +
				addURLParam("Language", formatWith("'", params['language'])) +
				addURLParam("_L54AD1F204_", formatWith("'", params['l54'])) +
				addURLParam("_K13_", formatWith("", params['k13'])) +
				addURLParam("_V_", formatWith("", params['v'])) +
				addURLParam("_K14_", formatWith("'", params['k14']));
			requests.push(
				new Promise(function(resolve, reject) {
					$.ajax({
						type: "GET",
						dataType: "json",
						crossDomain: true,
						async: true,
						url: serviceURL,
						error: function () { console.log("ERROR: getProduct call"); reject(); },
						success: function (data) { resolve(data); }
					})
				})
			);
		}
		return Promise.all(requests);
	}

	//Define flows
	var getOfferRecommendations = function(divId, params) {
		return fetchOfferRecommendations(divId, params)
				.then(preloadImages.bind(null, {
					DIV_ID: divId,
					KEY_URL: "OfferContentSourceURL",
					KEY_ID: "MarketingOffer"
				}))
				.then(function() {
					return {
						recommendationList: recommendationsByDivId[divId],
						offerInfos: itemInfosByDivId[divId],
						imageElements: imageElements
					}
				});
	}

	var getProductRecommendations = function(divId, params) {
		return fetchProductRecommendations(divId, params)
				.then(fetchProducts.bind(null, params))
				.then(preloadImages.bind(null, {
					DIV_ID: divId,
					KEY_URL: "ProductImageUrl",
					KEY_ID: "ProductId"
				}))
				.then(function() {
					return {
						recommendationList: recommendationsByDivId[divId],
						productInfos: itemInfosByDivId[divId],
						imageElements: imageElements
					}
				});
	}

	RecoCore = {
		init: function (withOption, callback) {
			if (typeof Promise == 'undefined') {
				var element = document.createElement('script');
				document.head.appendChild(element);
				element.type = 'text/javascript';
				element.src = "https://cdnjs.cloudflare.com/ajax/libs/bluebird/3.3.4/bluebird.min.js";
				element.onload = function () {
					loadLibraries(withOption).then(callback);
				}
			} else {
				loadLibraries(withOption).then(callback);
			}
		},
		load: load,
		getOfferRecommendations: getOfferRecommendations,
		getProductRecommendations: getProductRecommendations
	}
})();

