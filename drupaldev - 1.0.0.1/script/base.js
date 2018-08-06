/**
 * Custom javascript functions for the Scarlet theme.
 */
 
 var PageManager = new function () {  

    this.activeLeftMenu = function () {  
		var href = document.location.href;
		var lastPathSegment = href.substr(href.lastIndexOf('/') + 1);
        //alert(lastPathSegment);
		
		// hide all sub menu
		var menuControl =jQuery("#leftmenuPanel");
		menuControl.find('a').removeClass('active-trail').removeClass('active');
		menuControl.find('li').removeClass('active-trail').removeClass('active');
		menuControl.find('.expanded').removeClass('expanded').addClass('collapsed');
		
		// active current menu
		var activeMenu = menuControl.find("a[href$='"+ lastPathSegment +"']");
		activeMenu.addClass('active-trail').addClass('active');
		
		// show parent and active parent if active menu is a sub
		activeMenu.parent().parent().addClass('active-trail').addClass('active');
		activeMenu.parent().addClass('active-trail').addClass('active').removeClass('collapsed').addClass('expanded');
		
		
		activeMenu.parent('li').parent('ul').parent('li').addClass('active-trail').addClass('active').removeClass('collapsed').addClass('expanded');
		activeMenu.parent('li').parent('ul').parent('li').find('a').first().addClass('active-trail');;
		//activeMenu.parent().parent().parent().find('a').first().addClass('active-trail');
		
		
		menuControl.find('.expanded').find('.menu').show();		
		menuControl.find('.collapsed').find('.menu').hide();
    };
	
	this.activeTopMenu = function (menu) {  		
		var menuControl =jQuery("#topMenuPanel");
		menuControl.find('a').removeClass('active-trail');
		
		// active current menu
		var activeMenu = menuControl.find("a[href$='"+ menu +".html']");
		activeMenu.addClass('active-trail');
    };
 };

/**
 * Base functions.
 */
(function($) {

  // Set layout size and trigger events bound to the layout.
  var respSize = function() {	  
    // Check for the respSize div in the page, which contains the size. This
    // is more accurate than checking the window size.
    // Remove quotes, if they are there.
    respSize = $('#respSize').css('font-family');
    // If this is the initial page load, current doesn't exist.
    if (typeof current === 'undefined') current = respSize;
    $.event.trigger('responsivelayout', {from: current, to: respSize});
    current = respSize;
  }; 

  // Execute layout changes.
  // Set the initial size and execute bound functions.
  $(document).ready(respSize); // window.load isn't fast enough.
  // Check for resizing.
  $(window).resize(respSize);

  // Mobile menu toggle button.
  Drupal.behaviors.RUMenuToggle = {
    attach: function (context, settings) {
      // e = event, d = data.
      $('body').bind('responsivelayout', function (e, d) {
        if (d.to == 'desktop') {
          $('.sliver-menu').removeClass('visuallyhidden');
          $('.sliver-menu').css('display', 'inherit');
          $('.masthead .block-menu-block').removeClass('visuallyhidden');
          $('.masthead .block-menu-block').css('display', 'inherit');
        } else if (!$('.sliver-menu').hasClass('opened')) {
          $('.sliver-menu').addClass('visuallyhidden');
          $('.masthead .block-menu-block').addClass('visuallyhidden');
        };
      });
      // Click function for the menu toggle button.
      // The redundant display: none lines are to avoid starting in a
      // visibilityhidden state, or starting with display: none in CSS.
      // This is for accessbility and to fail open.
      $('.menu-toggle').click(function() {
        if ($('.sliver-menu').hasClass('visuallyhidden')) {
          $('.sliver-menu').css('display', 'none');
          $('.sliver-menu').removeClass('visuallyhidden closed');
          $('.sliver-menu').addClass('opened');
          $('.sliver-menu').slideToggle('fast');
          $('.masthead .block-menu-block').css('display', 'none');
          $('.masthead .block-menu-block').removeClass('visuallyhidden closed');
          $('.masthead .block-menu-block').addClass('opened');
          $('.masthead .block-menu-block').slideToggle('fast');
        } else {
          $('.sliver-menu').slideToggle('fast');
          $('.sliver-menu').removeClass('opened');
          $('.masthead .block-menu-block').slideToggle('fast');
          $('.masthead .block-menu-block').removeClass('opened');
        };
      });
    }
  };
})(jQuery);

/**
 * Search box functions.
 */
(function($) {
  // Modify the submit URL based on select choice.
  RUSearchSubmitAlter = function(url) {
    document.rusearch.action = url;
  },
  // Clear search box on click.
  Drupal.behaviors.RUSearchClear = {
    attach: function(context, settings) {
      $('input#rusearchbox').focus(function() {
        if ($(this).val() == 'SEARCH') {
          $(this).val('');
        }
      });
      $('input#rusearchbox').blur(function() {
        if ($(this).val() == '') {
          $(this).val('SEARCH');
        }
      });
    }
  }
  // append the site url for local site searches.
  Drupal.behaviors.RUSearchAppend = {
    attach: function(context, settings) {
      $('#rusearch').submit(function () {
        if ($('#rusearchselect option:selected').text() == 'This site') {
          $('#rusearchbox').val($('#rusearchbox').val().concat(' site:', $(location).attr('hostname')));
        };
      });
    }
  }
})(jQuery);

/**
 * Tag the very last menu item. This is hard to do in CSS because of nesting.
 */
(function($) {
  Drupal.behaviors.RULastMenuItem = {
    attach: function(context, settings) {
      $('.block-menu-block').each(function(){
        $(this).find('li').last().addClass('verylast');
      });
      $('.block-menu').each(function(){
        $(this).find('li').last().addClass('verylast');
      });
    }
  }
})(jQuery);

/**
 * Custom JS for the collapsible lists.
 */
(function($) {
  Drupal.behaviors.RUCollapsible = {
    attach: function(/*context, settings*/) {
      $('table.collapsible > tbody > tr > td')
        .children().not('.collapsible-title')
        .attr('aria-hidden', 'true')
        .hide();
      $('table.collapsible > tbody > tr > td')
        .addClass('collapsed')
        .attr('aria-expanded', 'false');
      $('table.collapsible > tbody > tr > td')
        .prepend('<div class="open-icon"></div>');
      var toggleTableDatum = function() {
        $(this).siblings().not('.open-icon, .collapsible-title')
          .toggle()
          .each(function(index, ele) {
            var $ele = $(ele);
            if ($ele.is(':hidden')) {
              $ele.attr('aria-hidden', 'true');
            } else {
              $ele.attr('aria-hidden', 'false');
            }
          });
        if ($(this).parent().hasClass('collapsed')) {
          $(this).parent().removeClass('collapsed').addClass('open')
            .attr('aria-expanded', 'true');
        } else {
          $(this).parent().removeClass('open').addClass('collapsed')
            .attr('aria-expanded', 'false');
        }
      };
      $('table.collapsible td .collapsible-title, table.collapsible td .open-icon')
        .click(toggleTableDatum);

      /* Wrap all tables in a div for convenience: */
      var $collapsibleTables = $('table.collapsible');
      $collapsibleTables
        .wrap('<div class="collapsible-table-controls"></div>');

      /* Add an "expand all" link to the beginning of the table: */
      var expandAllButton = '<button class="expand-table">Expand all</button>';
      var collapseAllButton = '<button class="collapse-table">Collapse all</button>';
      $collapsibleTables
        .filter('.extra-controls')
        .before(expandAllButton, collapseAllButton)
        .after(expandAllButton, collapseAllButton);

      $('.expand-table')
        .click(function(/*event*/) {
          $(this)
            .parent('.collapsible-table-controls')
            .find('table.collapsible td.collapsed .open-icon')
            .click();
        });
      $('.collapse-table')
        .click(function(/*event*/) {
          $(this)
            .parent('.collapsible-table-controls')
            .find('table.collapsible td.open .open-icon')
            .click();
        });

      /* Add a procedural ID to any tables that don't already have one: */
      $('.collapsible-table-controls')
        .each(function(index, ele) {
          var $ele = $(ele);
          /* There should only be 1 table and two buttons: */
          var $table = $ele.find('table.collapsible').first();
          var $buttons = $ele.find('button');
          var tableId = $table.attr('id');
          if (!tableId) {
            tableId = 'ex-table-' + index;
            $table.attr('id', tableId);
          }
          $buttons.attr('aria-controls', tableId);
        });

      /* Add tab  and arrow-key navigation to the table, and allow hitting enter
       * and spacebar to function identically to clicking: */
      $('table.collapsible td')
        .attr('tabindex', '0')
        .keydown(function(event) {
          /* Arrow key navigation: */
          var $tds;
          var $containingTable = $(this)
            .closest('table.collapsible');
          if ($containingTable.hasClass('contain-arrow-nav')) {
            $tds = $containingTable.find('td');
          } else {
            $tds = $('table.collapsible td');
          }
          var getNextCollapsibleTD = (function(n) {
            let index = $tds.index(this) + n;

            /* Disable negative index wrap-around: */
            if (index < 0 || index >= $tds.length) {
              index = $tds.length;
            } else {
              event.preventDefault();
            }
            return $tds.eq(index);
          }).bind(this);

          //37 = left-arrow, 38 = up-arrow
          const arrowPrev = (event.which == 37 || event.which == 38);
          //39 = right-arrow, 40 = down-arrow
          const arrowNext = (event.which == 39 || event.which == 40);
          if (arrowPrev || arrowNext){
            getNextCollapsibleTD(arrowPrev ? -1 : 1).focus();
            return;
          }

          /* If the focused element is not the row itself: */
          if (this !== event.target) return;

          if (event.which == 13 || event.which == 32) {//enter or space
            $(this).find('.open-icon').click();
          }
        });
    }
  };
}(jQuery));
/*
(function($) {
  Drupal.behaviors.RUCollapsible = {
    attach: function(context, settings) {
      $('table.collapsible > tbody > tr > td').children().not('.collapsible-title').hide();
      $('table.collapsible > tbody > tr > td').addClass('collapsed');
      $('table.collapsible > tbody > tr > td').prepend('<div class="open-icon"></div>');
      $('table.collapsible td .collapsible-title, table.collapsible td .open-icon').click(function() {
        $(this).siblings().not('.open-icon, .collapsible-title').toggle();
        if ($(this).parent().hasClass('collapsed')) {
          $(this).parent().removeClass('collapsed').addClass('open');
        } else {
          $(this).parent().removeClass('open').addClass('collapsed');
        };
      });
    }
  }
})(jQuery);
*/
