'use strict';

function portalView() {
  
  const viewHTML = `
  <!DOCTYPE html>

    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        
        <title>Board Match Portal</title>
        <meta name="description" content="A place for service-minded individuals to
                                          connect with local non-profits in search
                                          of board members and other support">
        
        <!-- CSS Reset -->
        <link rel="stylesheet" type="text/css" href="styles/reset.css">
        
        <!-- Custom styles -->
        <link rel="stylesheet" type="text/css" href="styles/layout.css">
        <link rel="stylesheet" type="text/css" href="styles/typography.css">
        
      </head>
      
      <body>
        <header>
          <h1>Board Match Portal</h1>
          <nav class="header-nav js-header-nav">
            This will be the Header Nav
          </nav>
        </header>
        
        <nav class="tab-nav">
          This will be the TabBar Nav
        </nav>
        
        <main role="main">
          This will be the main content area
        </main>
    
        <!-- Load jQuery -->
        <script src="https://code.jquery.com/jquery-3.3.1.min.js"
                integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8="
                crossorigin="anonymous"></script>
        <script type="text/javascript" src="js/portal.js"></script>
      </body>
    </html>`;
    
    return viewHTML;
  
}


module.exports = {
  portalView
};