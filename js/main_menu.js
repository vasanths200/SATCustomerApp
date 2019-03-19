<!-- BEGIN SHOW/HIDE MAIN MENU -->
jQuery('.material-main-menu-button-wrapper, .material-main-menu-activator').on('touchstart click', function(e) {
'use strict';

	e.preventDefault();
		if(jQuery('.material-main-wrapper').hasClass('material-main-wrapper-active'))
		{		
			/* hide material slide */
			jQuery('.material-main-wrapper').removeClass('material-main-wrapper-active');
			/* hide material background */
			jQuery('.material-main-background').removeClass('material-main-background-active');
			/* hide background overlay */
			jQuery('.material-background-overlay').removeClass('material-background-overlay-active');
					
			/* when menu de-activated, animate main menu items */
			jQuery('.material-menu-wrapper').removeClass('material-menu-wrapper-active');
						
			jQuery("#menu_toggle_icn").find(".btn.leftArrow").removeClass("leftArrow").addClass("menu");			
			
			/* hide search field close button */
			jQuery('.material-search-close-wrapper').removeClass('material-search-close-wrapper-active');
			/* hide search field */
			jQuery('.material-search-wrapper').removeClass('material-search-wrapper-active');
			jQuery('.material-search-wrapper #searchform #s').blur();
			/* show search button */
			jQuery('.material-search-button').removeClass('material-search-button-hidden');
			
			/* hide secondary menu */
			jQuery('.material-secondary-menu-wrapper').removeClass('material-secondary-menu-wrapper-active');
			/* secondary menu button inactive state */
			jQuery('.material-secondary-menu-button').removeClass('material-secondary-menu-button-active');
			
			
		} else {		
					
			jQuery("#menu_toggle_icn").find(".btn.menu").removeClass("menu").addClass("leftArrow");
		
			/* show material slide */
			jQuery('.material-main-wrapper').addClass('material-main-wrapper-active');
			/* show material background */
			jQuery('.material-main-background').addClass('material-main-background-active');
			/* show background overlay */
			jQuery('.material-background-overlay').addClass('material-background-overlay-active');				
			
			/* when menu activated, animate main menu items */
			jQuery('.material-menu-wrapper').addClass('material-menu-wrapper-active');
		}
});
<!-- END SHOW/HIDE MAIN MENU -->

<!-- BEGIN SHOW/HIDE SECONDARY MENU -->
jQuery('.material-secondary-menu-button svg').on('touchstart click', function(e) {
'use strict';
	e.preventDefault();
		if(jQuery('.material-secondary-menu-wrapper').hasClass('material-secondary-menu-wrapper-active'))
		{		
			/* hide secondary menu */
			jQuery('.material-secondary-menu-wrapper').removeClass('material-secondary-menu-wrapper-active');
			/* secondary menu button inactive state */
			jQuery('.material-secondary-menu-button').removeClass('material-secondary-menu-button-active');
		} else {		
			/* show secondary menu */
			jQuery('.material-secondary-menu-wrapper').addClass('material-secondary-menu-wrapper-active');
			/* secondary menu button active state */
			jQuery('.material-secondary-menu-button').addClass('material-secondary-menu-button-active');
			
			/* hide search field close button */
			jQuery('.material-search-close-wrapper').removeClass('material-search-close-wrapper-active');
			/* hide search field */
			jQuery('.material-search-wrapper').removeClass('material-search-wrapper-active');
			jQuery('.material-search-wrapper #searchform #s').blur();
			/* show search button */
			jQuery('.material-search-button').removeClass('material-search-button-hidden');
		}
});
<!-- END SHOW/HIDE SECONDARY MENU -->

// -- BEGIN HIDE MENU WHEN OVERLAY CLICKED/TAPPED 
jQuery('.material-background-overlay').on('touchstart click', function(e) {
'use strict';
	e.preventDefault();
		/* hide material slide */
		jQuery('.material-main-wrapper').removeClass('material-main-wrapper-active');
		/* hide material background */
		jQuery('.material-main-background').removeClass('material-main-background-active');
		/* hide background overlay */
		jQuery('.material-background-overlay').removeClass('material-background-overlay-active');
		/* hide expanded menu button */
		jQuery('.material-main-menu-button-wrapper').removeClass('material-menu-active');
	
		/* hide secondary menu */
		jQuery('.material-secondary-menu-wrapper').removeClass('material-secondary-menu-wrapper-active');
		/* secondary menu button inactive state */
		jQuery('.material-secondary-menu-button').removeClass('material-secondary-menu-button-active');
		
		/* hide search field close button */
		jQuery('.material-search-close-wrapper').removeClass('material-search-close-wrapper-active');
		/* hide search field */
		jQuery('.material-search-wrapper').removeClass('material-search-wrapper-active');
		jQuery('.material-search-wrapper #searchform #s').blur();
		/* show search button */
		jQuery('.material-search-button').removeClass('material-search-button-hidden');
		
		/* when menu de-activated, animate main menu items */
		jQuery('.material-menu-wrapper').removeClass('material-menu-wrapper-active');		
		
		jQuery("#menu_toggle_icn").find(".btn.leftArrow").removeClass("leftArrow").addClass("menu");
});
// -- END HIDE MENU WHEN OVERLAY CLICKED/TAPPED -