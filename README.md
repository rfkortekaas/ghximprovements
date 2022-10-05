# GHX Improvements for UvA and HvA:

- Install [TamperMonkey](https://www.tampermonkey.net/) in your browser
- Install the GHX Improvements (A TamperMonkey install screen will appear to install the userscript).
  - [GHX Improvements](https://github.com/rfkortekaas/ghximprovements/blob/master/GHX%20Improvements.user.js?raw=true)
- After clicking install the tab closes automatically and the userscript is installed
- You can verify the installation using the TamperMonkey dashboard (Click on the tampermonkey icon <img width="16" alt="image" src="https://user-images.githubusercontent.com/1042678/146504143-95bfacf3-d9af-4d0d-8490-f43430d86638.png"> and then `Dashboard`). 


Updates will be installed automatically if new improvements are added.

### Improvements
- Added a configuration menu for the userscript
  - When clicking the tampermonkey icon <img width="16" alt="image" src="https://user-images.githubusercontent.com/1042678/146504143-95bfacf3-d9af-4d0d-8490-f43430d86638.png"> a configuration option appears under the active userscript
- Added a configuration option to select the used account types (UvAnetID/HvA-ID and/or groupaccount)
  - This will add an additional button to the login page (UvAnetID/HvA-ID Login) to go to the Single sign-on page and login via your UvAnetID or HvA-ID
  - Logging in with the groupaccount can be done using the GHX login form
- Added a configuration option to change the default delivery location
- Added a configuration option to set a default order unit for Free text requests
- Added a configuration option to set a default cost type for Free text requests
- Added a configuration option to select a default VAT amount
- Added a configuration option to open the PunchOut Webstores in a tab instead of a new window
- Improved the layout for a free text request order item
- Added a price modal to be able to fill in prices including VAT and automatically calculating the price without VAT.
- Redirect to the correct website when using the old URL or when on the wrong login page
- Added a validate function to replace a comma with a dot on the price field
- Add search bar to supplier field to New Request, Supplier Information and Searching for orders.
  - The supplier field in GHX is a standard select fiels in which you only can search with the starting letter of a supplier (and due to case and sorting this doesn't work optimal). This change adds a search bar to the supplier field and allows you to search case-insensitive for a part of the suppliers name.
- Improved visibility in the Shopping Cart (WBS-Element)
  - The WBS-Element in the Shopping Cart view is not completly visisble (input field is to small). This improvement changes the width of the WBS-Element input field. 
- Improved functionality for Farnell: Ability to change quantity to 0 to be able to delete an item. 
  - By default the Farnell integration doesn't support deleting an item or changing the quantity for an item. With this improvement you are able to change the quantity of an item and also change it to 0 to delete an item from the shopping cart
- Improved `Orders in bewerking` to change the default from date to current date minus 100 days.
  - The `Orders in bewerking` overview has a limited date range which causes that orders not finished will disappear in the view over time. This fix prevents long open orders to disappear
- Added a configuration option for the pilot hardware orders (CMDB registered orders)
  - When enabled a popup will show when creating a new order. The popup will asks for the HvA-ID/UvAnetID and the MyPUP-ID. If data is filled it will be added to the order fields and the title will be `Pilot ` with the HvA-ID/UvAnetID. If no MyPUP-ID is entered the original delivery location will be used (either from the profile or the delivery location configuration option)