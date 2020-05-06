# SAP Cloud Platform Recommendations Snippet

Sample of html/js/css snippet to integrate the SAP Marketing Recommendation Cache service on the SAP Cloud Platform.

## Description

This code sample enables the consumption of the [SAP Marketing Recommendation Cache service](https://api.sap.com/api/API_MKT_RECOMMENDATION_SRV/resource) to display products in a carousel that can be used by a commerce web shop. The recommendations come from SAP Marketing Cloud and pass through a data buffer layer that resides on the SAP Cloud Platform.

With the help of the HTML code snippet, and mandatory parameters, the sample JavaScript makes a call to get recommendations, followed by another call to get the associated product master data. The recommendations are then displayed within a carousel using [slick-carousel](https://github.com/kenwheeler/slick).

## Requirements

* An **SAP Marketing Cloud tenant** (SAP Marketing On-premise is not supported), and access to an **SAP Cloud Platform tenant**.
* A *recommendation scenario* that has been configured using the SAP Marketing Cloud **Manage Recommendations** and **Recommendation Scenario** applications. ([Example](https://help.sap.com/viewer/b88f770e4b7c4ecead5477e7a6c7b8f7/1902.500/en-US/f2b2a435679e4edbbc9821f967445a6a.html)).
* A local or remote web server to run HTML code snippet

## Download and Installation

1. Clone the repository to your local environment.
2. Use the html tag <script> inside your HTML page to include the JavaScript file reco_product_script.js. Refer to [snippet_example.html](https://github.com/SAP/cloud-marketing-recommendation-ui-snippets/blob/master/main/snippet_example.html)

## Configuration

There is no configuration required for the code snippet. The only requirement is to pass the mandatory parameters. As mentioned above,  an active recommendation scenario is required from the underlying SAP Marketing Cloud system. Please refer to the [SAP Marketing Cloud application help](https://help.sap.com/viewer/b88f770e4b7c4ecead5477e7a6c7b8f7/1902.500/en-US/f2b2a435679e4edbbc9821f967445a6a.html) for additional instructions.
The recommendation scenario provides the values for some of the mandatory parameters (l54, k13, k14,v).

## Known Issues

There are currently no known issues.

## How to obtain support

SAP does not offer support for the Sample Code.
This Sample Code is provided as-is.

## License
Copyright (c) 2020 SAP SE or an SAP affiliate company. All rights reserved. This file is licensed under the Apache Software License, version 2.0 except as noted otherwise in the [LICENSE file](/LICENSE).
