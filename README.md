# chemistry-client


The Chemistry UI is a single page API client built on backbone.js with help from the New York Times' [stickit](http://nytimes.github.io/backbone.stickit/) library for declarative binding of DOM nodes.

This is all for reasons of heritage and compatibility; chemistry is the latest in a long line of working CMSes from various client projects.


## Roadmap

Longer term, chemistry is an API definition more than anything else. We expect to swap in different back ends and also to migrate away from backbone towards whatever the LTS hotness is next year.
The goal is to create a versatile migration path to and from Rails.

To get there, we are gradually shaking off the 2010s:

* Use native jsonApi
* Rewrite in modern ES6 javascript.
* Replace jQuery selectors with DOM queries
* Remove supporting libraries by duplicating only the functionality we use
* Build up Utility/library as repository

Key steps:

* replace View and CollectionView from Marionette
* replace Model and Collection from Backbone
* remove any remaining jQuery calls


## Local development

It is easy to bring up the UI in a webpack dev server:

    $ git clone git@github.com:spanner/chemistry-client.git ui
    $ cd chemistry-client
    $ yarn install
    $ yarn start

To *use* the UI, you will also need a local Chemistry API running, which in turn requires a working rails development environment with MySQL and Elasticsearch.

