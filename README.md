![](https://img.shields.io/badge/STATUS-NOT%20CURRENTLY%20MAINTAINED-red.svg?longCache=true&style=flat)

# Notice
This public repository is read-only and no longer maintained. For the latest sample code repositories, visit the [SAP Samples](https://github.com/SAP-samples) organization.

# SAP Cloud Platform Recommendations Snippet

[![REUSE status](https://api.reuse.software/badge/github.com/SAP-samples/cloud-marketing-recommendation-ui-snippets)](https://api.reuse.software/info/github.com/SAP-samples/cloud-marketing-recommendation-ui-snippets)

Sample of HTML/JS/CSS snippet to integrate the SAP Marketing Recommendation Cache service on SAP Cloud Platform.

## Description

This repository contains code samples to enable the consumption of the [SAP Marketing Recommendation Cache service](https://api.sap.com/api/API_MKT_RECOMMENDATION_SRV/resource) to display products in a carousel or offers in a banner or carousel that can be used by a commerce web shop. The recommendations come from SAP Marketing Cloud and pass through a data buffer layer that resides on the SAP Cloud Platform.

In the case of the sample product recommendation snippet, the JavaScript code makes a call to get recommendations followed by another call to get the associated product master data.

In the case of the sample offer recommendations snippet, a single call is made to get the both the recommendations and the offer content data.

At last, the recommendations are then displayed within a carousel or banner using [slick-carousel](https://github.com/kenwheeler/slick).

## Requirements

* An **SAP Marketing Cloud tenant** (SAP Marketing On-premise is not supported), and access to an **SAP Cloud Platform tenant**.
* A *recommendation scenario* that has been configured using the SAP Marketing Cloud **Manage Recommendations** and **Recommendation Scenario** applications.
    * [Example for Product Recommendations](https://help.sap.com/viewer/b88f770e4b7c4ecead5477e7a6c7b8f7/1902.500/en-US/f2b2a435679e4edbbc9821f967445a6a.html)
    * [Example for Offer Recommendations](https://help.sap.com/viewer/b88f770e4b7c4ecead5477e7a6c7b8f7/2008.500/en-US/e72bbecf89b344d8bad5963446889158.html)
* A local or remote web server to run HTML code snippet.

## Download and Installation

1. Clone the repository to your local environment.
2. Use the html tag <script> inside your HTML page to include the JavaScript file from the following based on your scenario:
	* reco_product_carousel.js
	* reco_offer_banner.js
	* reco_offer_carousel.js

Refer to [snippet_example.html](https://github.com/SAP-samples/cloud-marketing-recommendation-ui-snippets/blob/master/main/snippet_example.html) for its related code snippet.

## Configuration

There is no configuration required for the code snippet. The only requirement is to pass the mandatory parameters. As mentioned above,  an active recommendation scenario is required from the underlying SAP Marketing Cloud system. Please refer to the [SAP Marketing Cloud application help](https://help.sap.com/viewer/b88f770e4b7c4ecead5477e7a6c7b8f7/1902.500/en-US/b6e0e555fb26727fe10000000a44538d.html) for additional informations.

The recommendation scenario provides the values for some of the mandatory parameters (l54, k13, k14, v).

## Known Issues

There are currently no known issues.

## How to obtain support

SAP does not offer support for the sample codes.
These sample codes are provided as-is.

## License
Copyright (c) 2020 SAP SE or an SAP affiliate company. All rights reserved. This project is licensed under the Apache Software License, version 2.0 except as noted otherwise in the [LICENSE](LICENSES/Apache-2.0.txt).
