# dnd_jfx-js
Test drag'n'drop between JavaFX and HTML5 embedded inside a WebView

I'm investigating the Drag & Drop possibilities between JavaFX and HTML5 code running within the JavaFX WebView.

The purpose is to transfer though D'n'D Person objects. Person is a class containing 2 String properties (firstName and lastName).

I will try standard data types such as :
 - DataFormat#PLAIN_TEXT ("text/plain")
 - DataFormat#FILES
 - "text/customPerson" (my own data type)
