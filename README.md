[![Build Status](https://github.com/oaf-project/oaf-routing/actions/workflows/main.yml/badge.svg)](https://github.com/oaf-project/oaf-routing/actions/workflows/main.yml)
[![type-coverage](https://img.shields.io/badge/dynamic/json.svg?label=type-coverage&prefix=%E2%89%A5&suffix=%&query=$.typeCoverage.atLeast&uri=https%3A%2F%2Fraw.githubusercontent.com%2Foaf-project%2Foaf-routing%2Fmaster%2Fpackage.json)](https://github.com/plantain-00/type-coverage)
[![codecov](https://codecov.io/gh/oaf-project/oaf-routing/branch/master/graph/badge.svg?token=wFig0PYrK1)](https://codecov.io/gh/oaf-project/oaf-routing)
[![Mutation testing badge](https://img.shields.io/endpoint?style=flat&url=https%3A%2F%2Fbadge-api.stryker-mutator.io%2Fgithub.com%2Foaf-project%2Foaf-routing%2Fmaster)](https://dashboard.stryker-mutator.io/reports/github.com/oaf-project/oaf-routing/master)
[![Known Vulnerabilities](https://snyk.io/test/github/oaf-project/oaf-routing/badge.svg?targetFile=package.json)](https://snyk.io/test/github/oaf-project/oaf-routing?targetFile=package.json)
[![npm](https://img.shields.io/npm/v/oaf-routing.svg)](https://www.npmjs.com/package/oaf-routing)

# Oaf Routing

Common code for building accessible SPA router wrappers.

## Compatibility

For IE support you will need to polyfill [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map#Browser_compatibility). Using [core-js](https://github.com/zloirock/core-js):

```javascript
import "core-js/es6/map";
```

If you use the `smoothScroll` option of `RouterSettings`, you may want to use iamdunstan's [smoothscroll polyfill](https://github.com/iamdustan/smoothscroll). See [MDN's `scrollIntoView` browser compatibility](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView#Browser_compatibility).

## Libraries that use Oaf Routing
* [Oaf React Router](https://github.com/oaf-project/oaf-react-router) for [React Router](https://github.com/ReactTraining/react-router).
* [Oaf Next.js Router](https://github.com/oaf-project/oaf-next.js-router) for [Next.js](https://github.com/zeit/next.js/).
* [Oaf Navi](https://github.com/oaf-project/oaf-navi) for [Navi](https://github.com/frontarm/navi).
* [Oaf Vue Router](https://github.com/oaf-project/oaf-vue-router) for [Vue Router](https://router.vuejs.org/).
* [Oaf Angular Router](https://github.com/oaf-project/oaf-angular-router) for [Angular's Router](https://angular.io/guide/router).
* [Oaf Svelte Routing](https://github.com/oaf-project/oaf-svelte-routing) for [Svelte Routing](https://github.com/EmilTholin/svelte-routing).
* [Oaf Ember Routing](https://github.com/oaf-project/oaf-ember-routing) for [Ember](https://guides.emberjs.com/release/routing/).
* [Your accessible SPA router wrapper here?](https://github.com/oaf-project/oaf-routing/labels/new-impl)

## See also
* https://www.gatsbyjs.org/blog/2019-07-11-user-testing-accessible-client-routing/
* https://www.gatsbyjs.com/blog/2020-02-10-accessible-client-side-routing-improvements/
* [Single Page Apps routers are broken](https://medium.com/@robdel12/single-page-apps-routers-are-broken-255daa310cf)
* [Accessible page titles in a Single Page App](https://hiddedevries.nl/en/blog/2018-07-19-accessible-page-titles-in-a-single-page-app)
* [Single page applications, Angular.js and accessibility](http://simplyaccessible.com/article/spangular-accessibility)
* [Creating accessible React apps](https://simplyaccessible.com/article/react-a11y/)
* [Accessible React Router navigation with ARIA Live Regions and Redux](https://almerosteyn.com/2017/03/accessible-react-navigation)
* [Oaf Side Effects](https://github.com/oaf-project/oaf-side-effects)
* https://kit.svelte.dev/docs/accessibility
