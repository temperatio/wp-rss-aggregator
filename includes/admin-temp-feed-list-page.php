<?php

/**
 * Registers the temp feed list page.
 *
 * @since [*next-version*]
 */
add_action('admin_menu', function () {
    add_submenu_page(
        null,
        __('Feed Items', WPRSS_TEXT_DOMAIN),
        __('Feed Items', WPRSS_TEXT_DOMAIN),
        'manage_options',
        'wpra-feed-items',
        'wprss_render_feed_items_page'
    );
});

/**
 * Renders the feed items page.
 *
 * @since [*next-version*]
 *
 * @throws Twig_Error_Loader
 * @throws Twig_Error_Runtime
 * @throws Twig_Error_Syntax
 */
function wprss_render_feed_items_page()
{
    wprss_update_previous_update_page_version();

    wprss_plugin_enqueue_app_scripts('wpra-feed-items', WPRSS_JS . 'feed-items.min.js', array(), '0.1', true);
    wprss_plugin_enqueue_app_styles('wpra-feed-items', WPRSS_CSS . 'feed-items.min.css');

    $defaultColumns = array(
        'enabled' => array(
            'label' => ''
        ),
        'source' => array(
            'label' => 'Source',
            'sortable' => true,
        ),
        'processing' => array(
            'label' => 'Feed Processing',
        ),
        'imported' => array(
            'label' => 'Imported Items',
        ),
    );

    wp_localize_script('wpra-feed-items', 'WpraFeed', array(
        'columns' => apply_filters('wpra_feed_columns', $defaultColumns)
    ));

    echo wprss_render_template('admin-feed-items-page.twig', array(
        'wpra_feed_columns_markup' => apply_filters('wpra_feed_columns_markup', '')
    ));
}

function wpra_insert_column ($columns, $position, $name, $column) {
    return array_slice($columns, 0, $position, true) +
        array($name => $column) +
        array_slice($columns, $position, count($columns) - $position, true);
}
