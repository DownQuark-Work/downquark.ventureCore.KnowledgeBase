https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json
https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/connect
https://extensionworkshop.com/documentation/develop/
https://developer.chrome.com/docs/extensions/reference/
https://developer.chrome.com/docs/extensions/reference/scripting/
• https://developer.chrome.com/docs/extensions/reference/tabs/
  - https://github.com/GoogleChrome/chrome-extensions-samples <<
  -- need bookmark permissions, but:  <<<<<<
  - https://developer.chrome.com/docs/extensions/reference/bookmarks/#method-getTree
  - https://developer.chrome.com/docs/extensions/reference/bookmarks/#method-getSubTree
• https://github.com/GoogleChrome/chrome-extensions-samples/tree/main/apps
- https://github.com/GoogleChrome/chrome-extensions-samples/tree/main/api
https://developer.chrome.com/docs/extensions/mv3/richNotifications/


https://developers.google.com/web/fundamentals
- https://developers.google.com/web/fundamentals/architecture/app-shell | Start here(ish)
- https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle
- https://developers.google.com/web/fundamentals/web-components/best-practices

https://developers.google.com/web/updates/2015/12/getting-started-pwa
https://developers.google.com/web/ilt/pwa/setting-up-the-labs
https://medium.com/google-developers/instant-loading-web-apps-with-an-application-shell-architecture-7c0c2f10c73#.1s0o3w42k

https://web.dev/pwa-checklist/
- https://developers.google.com/web/ilt/pwa/introduction-to-progressive-web-app-architectures#pwa_architectural_patterns
- https://developers.google.com/web/ilt/pwa/introduction-to-progressive-web-app-architectures#what_is_an_application_shell !
  - https://developers.google.com/web/ilt/pwa/introduction-to-progressive-web-app-architectures#patternstable
- https://developers.google.com/web/ilt/pwa/introduction-to-progressive-web-app-architectures#caching_the_app_shell_manually

https://github.com/GoogleChromeLabs
- https://github.com/GoogleChromeLabs/application-shell
- https://github.com/orgs/GoogleChromeLabs/repositories?type=all
https://w3c.github.io/manifest/
https://github.com/GoogleChromeLabs/sw-precache/blob/master/demo/app/js/service-worker-registration.js#L25

https://brucelawson.github.io/manifest/ | manifest generator
https://web.dev/offline-cookbook/

https://github.com/GoogleChromeLabs/gulliver << PWA EXAMPLES
https://github.com/GoogleChromeLabs/tasklets

https://reference.codeproject.com/dom/document_object_model/traversing_an_html_table_with_javascript_and_dom_interfaces

https://reference.codeproject.com/dom/web_workers_api/functions_and_classes_available_to_workers
https://html.spec.whatwg.org/multipage/web-messaging.html#examples-5

https://github.com/trekhleb/javascript-algorithms
https://developer.mozilla.org/en-US/docs/WebAssembly/Using_the_JavaScript_API
https://github.com/mdn/webassembly-examples

chrome.tabs.highlight(
    {tabs:[0]},
  (cb)=>console.log('cb',cb),
)


Dynamic module loading - (from example.mjs)
```
// `import('..').then(_=>{})
triangleBtn.addEventListener('click', () => {
  import('./modules/triangle.js').then((Module) => {
    let triangle1 = new Module.Triangle(myCanvas.ctx, myCanvas.listId, 100, 75, 190, 'yellow');
    triangle1.draw();
    triangle1.reportArea();
    triangle1.reportPerimeter();
  })
});
```

Fun `Reflect` usage:
`Reflect.ownKeys(Reflect)`