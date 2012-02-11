BPM - The Browser's Package Manager
===================================
_bpm_ is a very early attempt at bringing some notion of package management to the browser. At this point it should merely be considered as a proof-of-concept, as it is a long ways away from prime time. If you decide to use it, please understand that you are using it at your own risk, but your feedback is totally welcome.

Rationale
---------
"Why another package manager" you may ask? Well, for starters, every mature runtime seems to have one except for browser-based JavaScript. Now, before you get your panties in a knot: I have not been living under a rock, I am fully aware of Isaac's [npm](http://npmjs.org/) and all of it's JS packaging glory. However, I am of the opinion that npm, as it stands, is not a good solution for sharing browser-targeted JavaScript with developers. For starters, it relies on [NodeJS](http://nodejs.org/) which, for how awesome it is, should not be a prerequisite for importing JavaScript into the browser. The browser already has a JavaScript runtime, why install another just to import packages? In addition, the current npm system does not make any guarantees that the imported packages will even work outside of Node's V8 runtime! npm's packaging metaphor is key to its versatility, but its generality and lack of scoping take away from its utility outside the node ecosystem.

So then, what makes a "package" ideal for the browser? Well, while I can't speak for everyone, my experience is that "packages" in the browser are really just compiled JavaScript libraries. Some libraries can have dependencies, while others just depend on basic browser APIs. Also, depending on my development environment, these libraries tend to either be minified or completely uncompressed. So, at the very least, it seems like a browser-centric package manager would have to be able to support these metaphors, and do so in a way that actually improves prototyping workflow. At first thought, something like the [Google Libraries API](http://code.google.com/apis/libraries/devguide.html) seems to solve this nicely. Unfortunately, the walled garden of google's CDN and the lack of obvious dependency management limited its potential. To work around Google's restrictions, some folks decided to forgo dealing with google's CDN and host their libraries on a more "open" CDNs like [cdnjs.com](http://www.cdnjs.com/). While these "open" CDNs succeeded in allowing distribution of less ubiquitous libraries, they were never created with the intent of serving packages like the aforementioned Google libraries did.

_bpm_ is, essentially, an attempt to cover these basic use cases, and improve upon them with tools to expedite prototyping.

Goals
-----
_bpm_ aims to be *the* package manager for the browser. To accomplish this, it was created with these goals in mind:

- Packages are to be simple, only versioning and CDN information are required to be part of the package repository
- The package repository is open; additions to the repository are made via pull-request
- Installing a package results in the downloading of a single script. Depending on bpm's "mode" this can be a minified or uncompressed version.
- Packages are to be installed as efficiently as possible, making heavy use of caching where possible.
- Packages can define optional prerequisites; they are defined in the same syntax a user would use to install packages.
- The package manager API can be run interactively, through the JavaScript console; or statically as an included script.
- The package manager can display information about what scripts were loaded, and provide tools to re-import the included scripts without the package manager.

Getting Started
---------------
The API is meant to be as intuitive and straight forward as it can be without sacrificing functionality. To start using the API, you first need to import _bpm_ into your browser's runtime. This is the only step that has to be done statically, as _bpm_ can load packages dynamically afterwords. To do this, just import _bpm_ as you would any other script.

```html
<!-- use this version in development -->
<script src="http://azoff.github.com/bpm/bpm.js"></script>
<!-- use this version in production -->
<script src="http://azoff.github.com/bpm/bpm.min.js"></script>
```

After bpm is included in your page, you will immediately have access to the interactive API via your browser's JavaScript console. The same API will also be available via any scripts loaded after _bpm_. For more info on the API, refer to the API section. For those of you who like the quick-and-dirty approach, here is an example of how to use _bpm_ to load jQuery:

```javascript
bpm.install('jquery', function(){
    console.log("I just used bpm to load jQuery!")
    $(document).ready(function(){
        console.log("I just used jQuery!")
    });
});
```
_bpm_'s utility does not stop there. Once you are done prototyping, you can then prepare the scripts you included for use in a production
environment. Run the `manifest` command to see a list of scripts you included, or run `combine` to produce a link packaging all of the scripts into one master script

The Package Manager API
-----------------------
The following commands comprise the public _bpm_ API.

- `bpm.install` ( `request`, `onsuccess` )
   - Installs one or more packages from the repository.
   - `request` `array|string|object` The request object is a message of intent to the installer. It can be a string name of a package to load, and object with a `key` and and optional `version` property, or an array of any either two. Note that you may omit the `version` property in the object to implicitly request the latest version of the library. Using the string form, or explicitly requesting 'latest' as the version has the same effect.
   - `onsuccess` `function(matches,urls)` A listener that is called when the package is installed. The listener takes two parameters: a list of match objects (output of bpm.match) and the final URLs for the downloaded packages. If no packages are installed, these parameters will be empty.
   - `onerror` `function(error,match)` A listener that is called when the package install is aborted. The listener takes two parameters: a simple error string and the match object that triggered the error. If there are no packages to install (i.e. if they have already been loaded), the onerror function will be called with the error parameter set to 'noop' and the match will be null;   

- `bpm.installed` ( `key` )
   - Checks if a package is installed by key.
   - `key` `string` The key to search packages with

- `bpm.addListener` ( `event`, `listener` )
   - Adds an event listener to the bpm packager.
   - `event` Can be "install" or "installed": install occurs at the beginning of every request, and installed occurs only when packages are actually installed. 
   - `listener` `function(matches,urls)` A listener that is called when the package is installed. The listener takes two parameters: a list of match objects (output of bpm.match) and the final URLs for the downloaded packages. Install events only provide the first parameter.
 
- `bpm.removeListener` ( `event`, `listener` )
   - Removes an event listener from the bpm packager
   - `event` Can be "install" or "installed": install occurs at the beginning of every request, and installed occurs only when packages are actually installed.
   - `listener` `function(matches,urls)` A listener to remove that was previously bound using bpm.addListener
 
- `bpm.suggest` ( `key` )
   - Uses a [levenshtein distance](http://en.wikipedia.org/wiki/Levenshtein_distance) calculation to determine the closest match to a package search term
   - `key` `string` A required string to search for
 
- `bpm.combine` ( )
  - Provides a combined link for all of the script added in the manifest.
  
- `bpm.list` ( )
    - Outputs a list of available packages available to install
   
- `bpm.manifest` ( )
   - Outputs a list of installed packages and their URLs
   
- `bpm.ready` ( `onready` )
   - Insulates any code from running until all the package definitions are ready
   - `onready` `function` A function that is called when _bpm_'s internal database is fully initialized
   
- `bpm.load` ( `request` )
   - An alias for `window.yepnope`, a script loader used internally by _bpm_. See the [official site](http://yepnopejs.com/) for usage.
   
- `bpm.url` ( `key`, `version` )
   - Returns the CDN URL for a package given its version and package key
   - `key` `string` The unique package key
   - `version` `string` The unique package version

- `bpm.usage` ( )
   - Outputs a usage string for bpm. Basically exposes all callable methods on bpm.
   
- `bpm.requires` ( `key` )
   - Outputs a list of requirements given a package key
   - `key` `string` The package to search requirements for 
   
- `bpm.latest` ( `key` )
   - Outputs the latest version number for a given package
   - `key` `string` The package to search for the latest version of
   
- `bpm.versions` ( `key` )
   - Outputs the versions for a given package
   - `key` `string` The package to search for the versions of
   
- `bpm.match` ( `request` )
  - Takes a request object (like the one passed into `install`) and returns an object that exposes request matches.
  - `request` `object|string` The request object to use in search
  
- `bpm.lookup` ( `key` )
  - Takes a key and returns its definition
  - `key` `string` The key to look up
  
- `bpm.define` ( `key`, `definition` )
  - Adds a package to the current bpm session
  - `key` `string` The unique package key
  - `definition` `object` The package definition (requires, cdn urls, etc.)
  
The Package Repository
----------------------
The package repository is simply a JavaScript file that is loaded via JSONP onto any requesting _bpm_ session. As may seem obvious, the package repository is named [packages.js](https://github.com/azoff/bpm/blob/master/packages.js), and can be found in the root of the repository. The production version of the repository is actually hosted by the GitHub CDN in the `gh-pages` branch of this repository. To contribute to the repository, just simply submit a pull request for that file, and I'll run some quick tests, and push it live. Packages are keyed on unique property names, so it's first come, first serve. The syntax is pretty simple, each package is a key/value pair, with the key being the unique identifier:

```javascript
{
    
 // ...
 
 myplugin: {
     
     // an optional list of requirements, this should be a 
     // request object, like the one passed into bpm.install
     requires: ['anotherplugin', { key: 'jquery', version: '1.7.0' }],
     
     // an optional list of versions supported by your CDN
     // if you do not provide this, ${v} will not be replaced in
     // the CDN links
     versions: ['1.0.0', '1.1.0', '1.1.2b'],
     
     // you can also just use one link, if you do not differentiate your modes
     // cdn: 'https://mycdn.com/${v}/myplugin.js'
     cdn: {
         dev:  'https://mycdn.com/${v}/myplugin.js',    // a development version
         prod: 'https://mycdn.com/${v}/myplugin.min.js' // a minified, production version
     }
     
 },
 
 // ...   
    
}
```   

I like to keep the packages alphabetical, and versions in order, so that the client doesn't have to sort at runtime. Please keep this in mind when submitting pull requests.

TODOs
-----
I still plan on doing a lot more to make _bpm_ awesome. Here are some of the things coming up:

- Investigate reading loaded script source
- Investigate combining scripts into base64 encoded blobs
- Stop the autofocus feature of jqconsole
- Add credits and notable projects
- Add documentation for utils and flags
- Add tests for auxiliary and prototyping functions
- Tag beta release version
- Add a custom domain for the home page
- Link to this plug-in from azoffdesign.com
- Investigate the heroku addon option
- Browser testing (also make note in readme)
- Release the hounds


Issues
------
There will be bugs. Please submit them on the [official tracker](https://github.com/azoff/bpm/issues).

License
-------
Licensed under [WTFPL](http://sam.zoy.org/wtfpl/), do with it as you please. If you like the idea, please fork or contribute. Even adding a test, or submitting a library can go a long way.