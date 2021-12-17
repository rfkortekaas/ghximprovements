# GHX Improvements for UvA

- Install [TamperMonkey](https://www.tampermonkey.net/) in your browser
- Choose one of the following links to install the GHX Improvements (A TamperMonkey install screen will appear to install the userscript).
  - [GHX Improvements with UvANetID Login](https://github.com/rfkortekaas/ghximprovements/blob/master/GHX%20Improvements%20UvANetID.user.js?raw=true)
  - [GHX Improvements with direct login (group account)](https://github.com/rfkortekaas/ghximprovements/blob/master/GHX%20Improvements.user.js?raw=true)
- After clicking install the tab closes automatically and the userscript is installed
- You can verify the installation using the TamperMonkey dashboard (Click on the tampermonkey icon <img width="16" alt="image" src="https://user-images.githubusercontent.com/1042678/146504143-95bfacf3-d9af-4d0d-8490-f43430d86638.png"> and then `Dashboard`). 


Updates will be installed automatically if new improvements are added.

## The following improvements are part of the latest version:

### Version specific improvements
- UvaNetID version
  - Redirect to the correct website when using the old URL
- Non-UvANetId 
  - Redirect to the correct website when using the old URL or when on the wrong login page (the login page differs from the UvANetID login page)

### Other improvements
- Add search bar to supplier field to New Request, Supplier Information and Searching for orders.
  -	The supplier field in GHX is a standard select fiels in which you only can search with the starting letter of a supplier (and due to case and sorting this doesn't work optimal). This change adds a search bar to the supplier field and allows you to search case-insensitive for a part of the suppliers name.
- Improved visibility in the Shopping Cart (WBS-Element)
  - The WBS-Element in the Shopping Cart view is not completly visisble (input field is to small). This improvement changes the width of the WBS-Element input field. 
- Improved functionality for Farnell: Ability to change quantity to 0 to be able to delete an item. 
  - By default the Farnell integration doesn't support deleting an item or changing the quantity for an item. With this improvement you are able to change the quantity of an item and also change it to 0 to delete an item from the shopping cart
- Improved `Orders in bewerking` to change the default from date to current date minus 100 days.
  - The `Orders in bewerking` overview has a limited date range which causes that orders not finished will disappear in the view over time. This fix prevents long open orders to disappear
