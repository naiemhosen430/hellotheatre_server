import { jwtTokenSercretKey } from "../../secret.js";

import jwt from "jsonwebtoken";

export const authentication = (req, res, next) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        statusCode: 401,
        message: "JWT is required for accessing the route",
      });
    }

    jwt.verify(token, jwtTokenSercretKey, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          statusCode: 401,
          message: "Invalid JWT token",
        });
      }

      req.user = decoded;

      next();
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      statusCode: 500,
      message: "Internal server error",
    });
  }
};

// // ------------------------------------------

// <!-- wp:template-part {"slug":"header","theme":"twentytwentyfour"} /-->

// <!-- wp:group {"tagName":"main","layout":{"inherit":true,"type":"constrained"}} -->
// <main class="wp-block-group"><!-- wp:woocommerce/order-confirmation-status {"fontSize":"large"} /-->

// <!-- wp:woocommerce/order-confirmation-summary /-->

// <!-- wp:woocommerce/order-confirmation-totals-wrapper {"align":"wide"} -->
// <!-- wp:heading {"level":3,"style":{"typography":{"fontSize":"24px"}}} --><h3 class="wp-block-heading" style="font-size:24px">Order details</h3><!-- /wp:heading -->

// <!-- wp:woocommerce/order-confirmation-totals {"lock":{"remove":true}} /-->
// <!-- /wp:woocommerce/order-confirmation-totals-wrapper -->

// <!-- wp:woocommerce/order-confirmation-downloads-wrapper {"align":"wide"} -->
// <!-- wp:heading {"level":3,"style":{"typography":{"fontSize":"24px"}}} --><h3 class="wp-block-heading" style="font-size:24px">Downloads</h3><!-- /wp:heading -->

// <!-- wp:woocommerce/order-confirmation-downloads {"lock":{"remove":true}} /-->
// <!-- /wp:woocommerce/order-confirmation-downloads-wrapper -->

// <!-- wp:columns {"align":"wide","className":"woocommerce-order-confirmation-address-wrapper"} -->
// <div class="wp-block-columns alignwide woocommerce-order-confirmation-address-wrapper">
//   <!-- wp:column -->
//   <div class="wp-block-column">
//     <!-- wp:woocommerce/order-confirmation-shipping-wrapper {"align":"wide"} -->
//     <!-- wp:heading {"level":3,"style":{"typography":{"fontSize":"24px"}}} --><h3 class="wp-block-heading" style="font-size:24px">Shipping address</h3><!-- /wp:heading -->

//     <!-- wp:woocommerce/order-confirmation-shipping-address {"lock":{"remove":true}} /-->
//     <!-- /wp:woocommerce/order-confirmation-shipping-wrapper -->
//   </div>
//   <!-- /wp:column -->

//   <!-- wp:column -->
//   <div class="wp-block-column">
//     <!-- wp:woocommerce/order-confirmation-billing-wrapper {"align":"wide"} -->
//     <!-- wp:heading {"level":3,"style":{"typography":{"fontSize":"24px"}}} --><h3 class="wp-block-heading" style="font-size:24px">Billing address</h3><!-- /wp:heading -->

//     <!-- wp:woocommerce/order-confirmation-billing-address {"lock":{"remove":true}} /-->
//     <!-- /wp:woocommerce/order-confirmation-billing-wrapper -->
//   </div>
//   <!-- /wp:column -->
// </div>
// <!-- /wp:columns -->

// <!-- wp:woocommerce/order-confirmation-additional-fields-wrapper {"align":"wide"} -->
// <!-- wp:heading {"level":3,"style":{"typography":{"fontSize":"24px"}}} --><h3 class="wp-block-heading" style="font-size:24px">Additional information</h3><!-- /wp:heading -->
// <!-- wp:woocommerce/order-confirmation-additional-fields /-->
// <!-- /wp:woocommerce/order-confirmation-additional-fields-wrapper -->

// <!-- wp:woocommerce/order-confirmation-additional-information /-->
// </main>
// <!-- /wp:group -->

// <!-- wp:template-part {"slug":"footer","theme":"twentytwentyfour"} /-->

// --------------------- function.php

// <?php
// /**
//  * Twenty Twenty-Four functions and definitions
//  *
//  * @link https://developer.wordpress.org/themes/basics/theme-functions/
//  *
//  * @package Twenty Twenty-Four
//  * @since Twenty Twenty-Four 1.0
//  */

// /**
//  * Register block styles.
//  */

// if ( ! function_exists( 'twentytwentyfour_block_styles' ) ) :
// 	/**
// 	 * Register custom block styles
// 	 *
// 	 * @since Twenty Twenty-Four 1.0
// 	 * @return void
// 	 */
// 	function twentytwentyfour_block_styles() {

// 		register_block_style(
// 			'core/details',
// 			array(
// 				'name'         => 'arrow-icon-details',
// 				'label'        => __( 'Arrow icon', 'twentytwentyfour' ),
// 				/*
// 				 * Styles for the custom Arrow icon style of the Details block
// 				 */
// 				'inline_style' => '
// 				.is-style-arrow-icon-details {
// 					padding-top: var(--wp--preset--spacing--10);
// 					padding-bottom: var(--wp--preset--spacing--10);
// 				}

// 				.is-style-arrow-icon-details summary {
// 					list-style-type: "\2193\00a0\00a0\00a0";
// 				}

// 				.is-style-arrow-icon-details[open]>summary {
// 					list-style-type: "\2192\00a0\00a0\00a0";
// 				}',
// 			)
// 		);
// 		register_block_style(
// 			'core/post-terms',
// 			array(
// 				'name'         => 'pill',
// 				'label'        => __( 'Pill', 'twentytwentyfour' ),
// 				/*
// 				 * Styles variation for post terms
// 				 * https://github.com/WordPress/gutenberg/issues/24956
// 				 */
// 				'inline_style' => '
// 				.is-style-pill a,
// 				.is-style-pill span:not([class], [data-rich-text-placeholder]) {
// 					display: inline-block;
// 					background-color: var(--wp--preset--color--base-2);
// 					padding: 0.375rem 0.875rem;
// 					border-radius: var(--wp--preset--spacing--20);
// 				}

// 				.is-style-pill a:hover {
// 					background-color: var(--wp--preset--color--contrast-3);
// 				}',
// 			)
// 		);
// 		register_block_style(
// 			'core/list',
// 			array(
// 				'name'         => 'checkmark-list',
// 				'label'        => __( 'Checkmark', 'twentytwentyfour' ),
// 				/*
// 				 * Styles for the custom checkmark list block style
// 				 * https://github.com/WordPress/gutenberg/issues/51480
// 				 */
// 				'inline_style' => '
// 				ul.is-style-checkmark-list {
// 					list-style-type: "\2713";
// 				}

// 				ul.is-style-checkmark-list li {
// 					padding-inline-start: 1ch;
// 				}',
// 			)
// 		);
// 		register_block_style(
// 			'core/navigation-link',
// 			array(
// 				'name'         => 'arrow-link',
// 				'label'        => __( 'With arrow', 'twentytwentyfour' ),
// 				/*
// 				 * Styles for the custom arrow nav link block style
// 				 */
// 				'inline_style' => '
// 				.is-style-arrow-link .wp-block-navigation-item__label:after {
// 					content: "\2197";
// 					padding-inline-start: 0.25rem;
// 					vertical-align: middle;
// 					text-decoration: none;
// 					display: inline-block;
// 				}',
// 			)
// 		);
// 		register_block_style(
// 			'core/heading',
// 			array(
// 				'name'         => 'asterisk',
// 				'label'        => __( 'With asterisk', 'twentytwentyfour' ),
// 				'inline_style' => "
// 				.is-style-asterisk:before {
// 					content: '';
// 					width: 1.5rem;
// 					height: 3rem;
// 					background: var(--wp--preset--color--contrast-2, currentColor);
// 					clip-path: path('M11.93.684v8.039l5.633-5.633 1.216 1.23-5.66 5.66h8.04v1.737H13.2l5.701 5.701-1.23 1.23-5.742-5.742V21h-1.737v-8.094l-5.77 5.77-1.23-1.217 5.743-5.742H.842V9.98h8.162l-5.701-5.7 1.23-1.231 5.66 5.66V.684h1.737Z');
// 					display: block;
// 				}

// 				/* Hide the asterisk if the heading has no content, to avoid using empty headings to display the asterisk only, which is an A11Y issue */
// 				.is-style-asterisk:empty:before {
// 					content: none;
// 				}

// 				.is-style-asterisk:-moz-only-whitespace:before {
// 					content: none;
// 				}

// 				.is-style-asterisk.has-text-align-center:before {
// 					margin: 0 auto;
// 				}

// 				.is-style-asterisk.has-text-align-right:before {
// 					margin-left: auto;
// 				}

// 				.rtl .is-style-asterisk.has-text-align-left:before {
// 					margin-right: auto;
// 				}",
// 			)
// 		);
// 	}
// endif;

// add_action( 'init', 'twentytwentyfour_block_styles' );

// /**
//  * Enqueue block stylesheets.
//  */

// if ( ! function_exists( 'twentytwentyfour_block_stylesheets' ) ) :
// 	/**
// 	 * Enqueue custom block stylesheets
// 	 *
// 	 * @since Twenty Twenty-Four 1.0
// 	 * @return void
// 	 */
// 	function twentytwentyfour_block_stylesheets() {
// 		/**
// 		 * The wp_enqueue_block_style() function allows us to enqueue a stylesheet
// 		 * for a specific block. These will only get loaded when the block is rendered
// 		 * (both in the editor and on the front end), improving performance
// 		 * and reducing the amount of data requested by visitors.
// 		 *
// 		 * See https://make.wordpress.org/core/2021/12/15/using-multiple-stylesheets-per-block/ for more info.
// 		 */
// 		wp_enqueue_block_style(
// 			'core/button',
// 			array(
// 				'handle' => 'twentytwentyfour-button-style-outline',
// 				'src'    => get_parent_theme_file_uri( 'assets/css/button-outline.css' ),
// 				'ver'    => wp_get_theme( get_template() )->get( 'Version' ),
// 				'path'   => get_parent_theme_file_path( 'assets/css/button-outline.css' ),
// 			)
// 		);
// 	}
// endif;

// add_action( 'init', 'twentytwentyfour_block_stylesheets' );

// /**
//  * Register pattern categories.
//  */

// if ( ! function_exists( 'twentytwentyfour_pattern_categories' ) ) :
// 	/**
// 	 * Register pattern categories
// 	 *
// 	 * @since Twenty Twenty-Four 1.0
// 	 * @return void
// 	 */
// 	function twentytwentyfour_pattern_categories() {

// 		register_block_pattern_category(
// 			'twentytwentyfour_page',
// 			array(
// 				'label'       => _x( 'Pages', 'Block pattern category', 'twentytwentyfour' ),
// 				'description' => __( 'A collection of full page layouts.', 'twentytwentyfour' ),
// 			)
// 		);
// 	}
// endif;

// add_action( 'init', 'twentytwentyfour_pattern_categories' );
