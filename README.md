BPM - The Browser's Package Manager
-----------------------------------
_bpm_ is a very early attempt at bringing some notion of package management to the browser. At this point it should merely be considered as a proof-of-concept, as it is a long ways away from prime time. If you decide to use it, please understand that you are using it at your own risk, but your feedback is totally welcome.

Rationale
---------
"Why another package manager" you may ask? Well, for starters, every mature runtime seems to have one except for browser-based JavaScript. Now, before you get your panties in a knot: I have not been living under a rock, I am fully aware of Isaac's [npm](http://npmjs.org/) and all of it's JS packaging glory. However, I am of the opinion that npm, as it stands, is not a good solution for sharing browser-targeted JavaScript with developers. For starters, it relies on [NodeJS](http://nodejs.org/) which, for how awesome it is, should not be a prerequisite for importing JavaScript into the browser. The browser already has a JavaScript runtime, why install another just to import packages? In addition, the current npm ecosystem does not make any guarantees that the imported packages will even work outside of Node's V8 runtime! npm's packaging metaphor is key to its versatility, but its generality and lack of scoping really only makes it ideal for use in the node ecosystem.

So the, what makes a "package" ideal for the browser? Well, while I can't speak for everyone, my experience is that "packages" in the browser are really just compiled JavaScript libraries. Some libraries can have dependencies, while others just need basic browser APIs, Also, depending on my development environment, these libraries tend to either be minified or completely uncompressed. So, at the very least, it seems like a browser-based package manager would have to be able to support these metaphors, and do so in a way that actually improves prototyping workflow. At first thought, something like the [Google Libraries API](http://code.google.com/apis/libraries/devguide.html) already provides this functionality. Unfortunately, the walled garden of google's CDN and the lack of obvious dependency management limited its potential. To work around Google's restrictions, some folks decided to forgo dealing with google's CDN and host their libraries on a more open CDNs like [cdnjs.com](http://www.cdnjs.com/) (I am sure there are others). While these "open" CDNs succeeded in allowing distribution of less ubiquitous libraries, they were never created with the intent of serving packages like the aforementioned Google libraries did.

_bpm_ is, essentially, an attempt to cover these basic use cases, and improve upon them with tools to expedite prototyping.

Goals
-----
_bpm_ aims to be *the* package manager for the browser. To accomplish this, it was created with these goals in mind:

- Packages are to be simple, only versioning and CDN information are required to be part of the package repository
- The package repository is open; additions to the repository are made via pull-request
- Installing a package results in the downloading of a single script. Depending on bpm's "mode" this can be a minified or uncompressed version.
- Packages are to be installed as efficiently as possible, making heavy use of caching where possible.
- Packages can have optional prerequisites; they are defined in the same syntax a user would use to install packages.
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

_bpm_ goes above and beyond to be as useful as possible, in some cases correcting user-error by suggesting possible misspelling in package names or incorrect version numbers. You can play around with this functionality by using the `suggest` method, or you may even use the `list` method to quickly view the entire package catalog.

```javascript
bpm.suggest('jqury'); // outputs "jquery"
bpm.list();           // outputs a comma separated list of packages
bpm.manifest();       // outputs a list of packages you installed in the current browser session
```

The Package Manager API
-----------------------
`bpm.install` ( `request`, `onsuccess` )

 - Installs one or more packages from the repository.
 - `request` `array|string|object` The request object is a message of intent to the installer. It can be a string name of a package to load, and object with a `key` and and optional `version` property, or an array of any either two. Note that you may omit the `version` property in the object to implicitly request the latest version of the library. Using the string form, or explicitly requesting 'latest' as the version has the same effect.
 - `onsuccess` `function` A function to be called when the request is fully processed.
 
`bpm.suggest` ( `key` )

 - Uses a [levenshtein](http://en.wikipedia.org/wiki/Levenshtein_distance) distance calculation to determine the closest match to a package search term
 - `key` `string` a required string to search for
 
