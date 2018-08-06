# Geo Masala #
**Tags:** gutenberg,block,leaflet,map,geo,gis  
**Donate link:** http://waterproof-webdesign.info/donate  
**Contributors:** [jhotadhari](https://profiles.wordpress.org/jhotadhari)  
**Tested up to:** 4.9.8  
**Requires at least:** 4.9.6  
**Requires PHP:** 5.6  
**Stable tag:** trunk  
**License:** GNU General Public License v2 or later  
**License URI:** http://www.gnu.org/licenses/gpl-2.0.html  

Highly customizable Map Block for Gutenberg, based on Leaflet


## Description ##

Highly customizable Map Block for Gutenberg, based on Leaflet

* Customize the Map and its Features directly from within the **Gutenberg Block**
* **Draw and edit Features**. Markers, Lines, Polygons ...
* **Customize Feature-Appearance**. Icon/Shadow, Color, Opacity, Class-Names ...
* A **Wysiwyg Editor** to Edit the Popup-Content. Use **Images/Videos/Audios** inside the Popup-Content
* **Customize the Map** itself. Dimensions, Baselayers, Controls ...
* Map Features are shareable and can be used between users and posts (depending on Features settings)

> Geo Masala on [GitHub](https://github.com/jhotadhari/geo-masala).<br/>It's open-source, free as freedom, free of cost and it will remain free.

### How to use ###

Edit any Post with gutenberg and add a 'Geo Masala Map' block, save post and done. Your post will display a map.

* Draw some Features or select some from the Feature-Panel.
  * The default Status for a new Feature is draft, only published ones are displayed in frontend.
  * To get Features from other posts/users, open Feature-Panel and adjust the Filters.
* Edit the Feature, change status, icon or color, change the popup content and title.
* Open the Map Settings Panel and customize the controls.
* Change the Feature sharing settings for a single Feature, and reuse the Feature in other Posts
* ...

> The [Gutenberg Editor Plugin](https://wordpress.org/plugins/gutenberg/) **is required** for WordPress versions prior to 5.0, see [requirements](https://wordpress.org/plugins/geo-masala/#installation)

### What is a Feature? ###
The term "Feature" is used in the cartographic context. A representation of a real-world object on a map ([feature|Definition - Esri Support GIS Dictionary](https://support.esri.com/en/other-resources/gis-dictionary/term/dcc335be-78ae-4bd2-b254-b44c37343f75)).
Within this plugin, a Feature can represent a simple location (Marker), a way/route/track (Polyline) or an Area (Polygon/Rectangle).
A couple of properties are stored with the Feature, eg. appereance and popup-content data.

### How does the Plugin work? ###
A Feature is saved as a post type, and not saved to the Block!

* The Plugin registered a new custom-post-type 'geom_feature'. Each geom_feature is used to store a single cartographic Feature, formatted in geoJSON. The cartographic Feature and other data (appearance, popup-content ...) are stored as post-meta.
* The geom_feature is registered without wordpress ui (List table and editing screen) or appearance in admin-navigation or admin-bar.
* When editing any post with gutenberg, the 'Geo Masala Map' block displays a leaflet map and some settings-panels beneath it. All crud actions (create, read, update, delete) for geom_feature(s) are handled within the editor block using the wp rest api and its backbone client. All geom_feature crud actions are saved immediately (Some ui elements have reset/save buttons).
* default post_status for geom_feature(s) is 'draft'.
* The Features-Panel lists geom_features. Features on Map are highlighted. If a Feature gets removed from map, the geom_feature is still saved and available to use.
* Therefor a Feature created by one post can be used in another post as well (depending on the individual feature settings). All changes made to a geom_feature are saved immediately and will effect all posts where the Feature is displayed.
* All attributes related to the map (and not to its features) are stored as block attributes.

### In Development ###
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

* Currently there is a maximum for hundred Features, will be changed in future.
* Feature Sharing: The popover control controls if the Feature appears in a Feature-Pool. If it is already in use somwhere, it will still be used, but just not displayed in Feature-Panel.

### Contribute ###
* Most welcome :)
* Geo-Masala is free and open source. The source is hosted on [GitHub](https://github.com/jhotadhari/geo-masala). So dig the code as you like.
* For **support**, to **request new plugin-features** or inform me about **issues and bugs** [create a new issue on Github](https://github.com/jhotadhari/geo-masala/issues/new) or [add a new topic to WP's support forum](https://wordpress.org/support/plugin/geo-masala)
* Love to get your **feedback**, [Create a new review and rate this Plugin](https://wordpress.org/support/plugin/geo-masala/reviews/#new-post), write a tutorial and tell your friends.
* [Tell me](https://waterproof-webdesign.info/en/#contact) your wishes, maybe get me a bowl of rice and some masala: [Donate](http://waterproof-webdesign.info/donate)

> I'm hungry, cycling around the world and Geo-Masala is coded while sitting wet in a tent during Monsoon somwhere in south himalaya. I appreaciate any kind of [donation](http://waterproof-webdesign.info/donate) or sponsorship.

### Thanks for beautiful ressoucres ###

* WordPress, the [WP REST API](https://developer.wordpress.org/rest-api/), the [Backbone JavaScript Client](https://developer.wordpress.org/rest-api/using-the-rest-api/backbone-javascript-client/) and the [Gutenberg Editor](https://wordpress.org/gutenberg/handbook/) and its components.
* [Backbone](http://backbonejs.org/), [Backbone Marionette](http://marionettejs.com/), [Backbone Deep Model](https://www.npmjs.com/package/backbone.deep-model) and [Backbone Cocktail](https://github.com/onsi/cocktail).
* [React](https://reactjs.org/), [react-virtualized](https://github.com/bvaughn/react-virtualized) and [react-multi-select](https://github.com/khan/react-multi-select)
* [Leaflet](http://leafletjs.com/) and Plugins:
  * [Leaflet Draw](https://github.com/Leaflet/Leaflet.draw)
  * [Leaflet Draw Toolbar](https://github.com/justinmanley/leaflet-draw-toolbar)
  * [Leaflet Geosearch](https://github.com/smeijer/leaflet-geosearch)
  * [Leaflet Loading](https://github.com/ebrelsford/Leaflet.loading)
  * [Leaflet Providers](https://github.com/leaflet-extras/leaflet-providers)
  * [Leaflet Fullscreen](https://github.com/brunob/leaflet.fullscreen)
  * [Leaflet Toolbar](https://github.com/Leaflet/Leaflet.toolbar)
* This Plugin is generated with [generator-pluginboilerplate version 1.2.3](https://github.com/jhotadhari/generator-pluginboilerplate)
* Background for plugin banner and icon [OpenTopoMap](http://opentopomap.org/)
* ...

## Installation ##

### Requirements:
* JavaScript needs to be enabled
* The [Gutenberg Editor Plugin](https://wordpress.org/plugins/gutenberg/) is required for WordPress versions prior to 5.0
* It works on **php version 5.6**. For **older php versions**, edit the dependency ```php_version``` on line 34 in ```./geo-masala.php``` and test it. [Report](https://waterproof-webdesign.info/en/#contact) me your tests, I really appreciate.

Upload and install this Plugin the same way you'd install any other plugin.

## Screenshots ##
1. Block Overview
2. Edit Popup Content
3. Edit Feature appearance (Marker)
4. Edit Feature appearance (Line, Polygone ...)

## Upgrade Notice ##

This Plugin is still in early development. Reality might be in movement.


## Changelog ##

0.1.1
- Fixed error on archive pages;
- Read the commit massages for further details;

0.1.0
- compatible with wp 4.9.8 and gb 3.4.0;
- Added use of post_status for geom_features ( 'publish', 'draft' and 'trash' );
- restructuring blockUi;
- ui: merged FeatureListPanel and its Feature Pool into one component FeatureList;

0.0.10
- compatible with gutenberg 3.3.0;
- lazyloading scripts using load-js on frontend and admin;
- New style for block panels;
- Read the commit massages for further details;

0.0.9
- Use Images/Videos/Audios inside the Popup-Content;
- Read the commit massages for further details;

0.0.8
- Dynamic PopupOptions, MapOptions, MapDimensions;
- Edit Appearance for Polyline inherited Features, most https://leafletjs.com/reference-1.3.0.html#polyline-option now accessable;
- fixed: choose icon and shadow;
- Read the commit massages for further details;

0.0.7
- fix: geomData.api.root was still hardcoded;

0.0.6
- copmatible with gb 3.2.0 and wp 4.9.7;
- fix: Plugin ensures function exist;
- fix: use geomData.api enstead of wpApiSettings;
- fix: removed Backbone.Memento from frontend;

0.0.5
Edit Popup, WysiwygControl works
Added Plugin assets
Updates grunt environment. Integrated updates from generator-pluginboilerplate 1.2.0

0.0.4


0.0.3
edited readme.

0.0.2
first stable version.
edited readme.
removed 'beautiful-dnd' and using 'react-virtualized' instead.

0.0.1
added custom_post_type geom_feature and started block geom/map
block not finished

