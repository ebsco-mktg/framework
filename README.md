EBSCO Framework
===============

Order of operation:
-------------------
    <link rel="stylesheet" href="css/normalize.css">
    <link rel="stylesheet" href="css/framework.css">
    <link rel="stylesheet" href="css/patterns.css">
    <link rel="stylesheet" href="css/skins.css">
    <link rel="stylesheet" href="css/main.css">

Assumed Markup
--------------
    <body>
        <div class="page">
            <header></header>
            <section class="container">
                <div class="inner">
                    <div class="content">
                        <div class="inner">
                            <!-- content goes here -->
                        </div>
                    </div>
                </div>
            </section>
            <footer></footer>
        </div>
    </body>

Notes (by class):
-----------------
* .page = Contains any overflow / offscreen elements
* .container = Defines large &lt;section&gt;s
* .container > .inner = Non-padded, centered fluid width block with clearfix
* .content = A left floating element
* .content > .inner = Padded block with clearfix

* temp
