=== Geo Masala ===
Tags: gutenberg,leaflet,map,geo,gis
Donate link: http://waterproof-webdesign.info/donate
Contributors: jhotadhari
Tested up to: 4.9.4
Requires at least: 4.7
Requires PHP: 5.6
Stable tag: trunk
License: GNU General Public License v2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Add interactive Leaflet Maps. A new block for gutenberg: 'Geo Masala Map'


== Description ==

Add interactive Leaflet Maps to your blog.
A new block for gutenberg: 'Geo Masala Map'

* Customize the Map and its Features directly from within the gutenberg block.
* Create and edit Features (Markers, Lines, Polygones ...). Change their color, icon, Popup ...
* Customize the Map itself, baselayers, controls ...
* Map Features are shareable and can be used between users and posts (depending on Features settings)

> Geo Masala on [GitHub](https://github.com/jhotadhari/geo-masala)

> Geo-Masala is coded while sitting wet in a tent during monsoon somwhere in south himalaya. I appreaciate any kind of help or sponsorship. [Donate](http://waterproof-webdesign.info/donate)
I'm really out of money, cycling around the world and hungry. Thanks, love you.

= How to use =
Edit any Post with gutenberg and add a 'Geo Masala Map' block, save post and done. Your post will display a map.
* Draw some Features or select some from the Feature-Pool.
* Edit the Feature, change icon or color, change the popup content and title.
* Open the Map Settings Panel and customize the controls.
* Change the Feature sharing settings for a sngle Feature, and reuse the Feature in other Posts
* ...

= What is a Feature? =
The term "Feature" is used in the cartographic context. A representation of a real-world object on a map. [feature|Definition - Esri Support GIS Dictionary](https://support.esri.com/en/other-resources/gis-dictionary/term/dcc335be-78ae-4bd2-b254-b44c37343f75)
Within this plugin, a Feature can represent a simple location (Marker), a way/route/track (Polyline) or an Area (Polygon/Rectangle).
A couple of properties are stored with the Feature, eg. appereance and popup-content data.

= How does the Plugin works? =
A Feature is saved as a post type, and not saved to the Block!

* The Plugin registered a new custom-post-type 'geom_feature'. Each geom_feature is used to store a single cartographic Feature, formatted in geoJSON. The cartographic Feature and other data (appearance, popup-content ...) are stored as post-meta.
* The geom_feature is registered without wordpress ui (List table and editing screen) or appearance in admin-navigation or admin-bar.
* When editing any post with gutenberg, the 'Geo Masala Map' block displays a leaflet map and some settings-panels beneath it. All crud actions (create, read, update, delete) for geom_feature(s) are handled within the editor block using the wp rest api and its backbone client. (Currently all geom_feature(s) are always “publish” state and 'all' operations within the block are saved immediately to the geom_feature)
* The Features-Pool Panel within the Features-Panel lists available geom_features. If a Feature gets removed from map, the geom_feature is still saved and available to use.
* Therefor a Feature created by one post can be used in another post as well (depending on the individual feature settings). All changes made to a geom_feature are saved immediately and will effect all posts where the Feature is displayed (well, some map ui elements have cancel/undo buttons).
* All attributes related to the map (and not to its features) are stored as block attributes.

= In Development =
The Plugin is in early development (and needs a sponsor to go on).
Some ui will change and more options will be added.

Coming soon hopefully:
* wiki and tutorials
* Possibility to draw routes on a map.
* Import for gpx/geoJSON/kml
* Method to add altitude and slope values for features
* Elevation profile for line/routes
* Color line/routes by z value or slope
* ...

Known issues:
* Currently there is a maximum for hundred Features, will be changed in future. This is the max number for the REST request (can be bypassed easily, but the ui needs some changes before it gets flooded with features)
* Feature Sharing: The popover control controls if the Feature appears in a Feature-Pool. If it is already in use somwhere, it will still be used, but just not displayed in Feature-Pool.

= Contribute =
* Geo-Masala is free and open source. The source is hosted on [GitHub](https://github.com/jhotadhari/geo-masala).
* Tell me your wishes, maybe get me a bowl of rice and some masala: [Donate](http://waterproof-webdesign.info/donate)
* I'm really out of money, cycling around the world, and Geo-Masala is coded while sitting wet in a tent during Monsoon somwhere in south himalaya. I appreaciate any kind of help or sponsorship.

= Thanks for beautiful ressoucres =

* WordPress, its environment, the [WP REST API](https://developer.wordpress.org/rest-api/), the [Backbone JavaScript Client](https://developer.wordpress.org/rest-api/using-the-rest-api/backbone-javascript-client/) and the [Gutenberg Editor](https://wordpress.org/gutenberg/handbook/) and its components.
* [Backbone](http://backbonejs.org/), [Backbone Marionette](http://marionettejs.com/) and [Backbone Deep Model](https://www.npmjs.com/package/backbone.deep-model).
* [React](https://reactjs.org/) and [react-virtualized](https://github.com/bvaughn/react-virtualized)
* [Leaflet](http://leafletjs.com/) and Plugins:
  * [Leaflet Draw](https://github.com/Leaflet/Leaflet.draw)
  * [Leaflet Draw Toolbar](https://github.com/justinmanley/leaflet-draw-toolbar)
  * [Leaflet Geosearch](https://github.com/smeijer/leaflet-geosearch)
  * [Leaflet Loading](https://github.com/ebrelsford/Leaflet.loading)
  * [Leaflet Providers](https://github.com/leaflet-extras/leaflet-providers)
  * [Leaflet Fullscreen](https://github.com/brunob/leaflet.fullscreen)
  * [Leaflet Toolbar](https://github.com/Leaflet/Leaflet.toolbar)
* This Plugin is generated with [generator-pluginboilerplate version 1.1.0](https://github.com/jhotadhari/generator-pluginboilerplate)
* ...

== Installation ==

### Requirements:
* php 5.6
* JavaScript needs to be enabled
* The [Gutenberg Editor Plugin] (https://wordpress.org/plugins/gutenberg/) is required for WordPress versions prior to 5.0

If the Plugin is not available in the official WordPress Plugin Repository yet, you will find the [latest distributed version in its github repository: ./dist/trunk/] (https://github.com/jhotadhari/geo-masala/tree/master/dist/trunk). Copy the ./dist/trunk/ folder, rename it to 'geo-masala' and upload it to your WordPress.

Upload and install this Plugin the same way you'd install any other plugin.

== Screenshots ==

== Upgrade Notice ==

This Plugin is still in early development. Reality might be in movement.


== Changelog ==

0.0.3
edited readme.

0.0.2
first stable version.
edited readme.
removed 'beautiful-dnd' and using 'react-virtualized' instead.

0.0.1
added custom_post_type geom_feature and started block geom/map
block not finished

