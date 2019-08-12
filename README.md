# Actual Menubar

A [menubar](https://github.com/maxogden/menubar) for your [Actual Budget](https://actualbudget.com) app powered by the [Actual Budget API](https://github.com/actualbudget/node-api).

## Setup
* `yarn`
* Change `await actual.init("My-Stash");` in `actual-menubar-main/main.js` to match your Budget ID. Get this from `Advanced` in the settings screen.
* `yarn workspace actual-menubar-main start`
* In a separate tab: `yarn workspace actual-menubar-frontend start`