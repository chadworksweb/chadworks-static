<?php
/**
 * Plugin Name: LEIT Hide Login (chadworks)
 * Description: Renames wp-login.php to a secret slug. 404s direct /wp-login.php and /wp-admin for non-logged-in users.
 * Version: 1.1.0
 *
 * The slug is NOT stored in this file. It is read from the
 * LEIT_HIDE_LOGIN_SLUG constant in wp-config.php, which stays on the server
 * and is never committed. That is what lets this plugin live in git.
 *
 * If the constant is missing the plugin goes fully inert and wp-login.php
 * behaves normally. That is deliberate: a typo or a half-restored wp-config
 * must never be able to lock everyone out of a site whose only door is a
 * secret URL. Obscurity is defence in depth here, not the security control;
 * the real controls are the wp-login rate limit, the user-enum block, and
 * password strength. An inert run is recorded in the PHP error log.
 */

if ( ! defined( 'ABSPATH' ) ) exit;

class LEIT_Hide_Login {

    /**
     * The secret login slug, or '' when unconfigured.
     */
    public static function slug() {
        return defined( 'LEIT_HIDE_LOGIN_SLUG' ) ? (string) LEIT_HIDE_LOGIN_SLUG : '';
    }

    public static function init() {
        if ( '' === self::slug() ) {
            error_log( 'LEIT Hide Login: LEIT_HIDE_LOGIN_SLUG is not defined in wp-config.php. Plugin inert, wp-login.php is reachable.' );
            return;
        }

        // WP core redirects /login, /admin and /dashboard to the login URL
        // (wp_redirect_admin_locations, template_redirect priority 1000).
        // Combined with the login_url filter below, that redirect points AT the
        // secret slug: guessing /login hands the secret to an anonymous
        // visitor and defeats the whole plugin. Those paths should just 404.
        remove_action( 'template_redirect', 'wp_redirect_admin_locations', 1000 );

        add_action( 'init',       [ __CLASS__, 'handle_request' ], 0 );
        add_action( 'wp_loaded',  [ __CLASS__, 'block_wp_admin' ], 1 );

        add_filter( 'site_url',         [ __CLASS__, 'filter_url' ], 10, 4 );
        add_filter( 'network_site_url', [ __CLASS__, 'filter_url' ], 10, 3 );
        add_filter( 'wp_redirect',      [ __CLASS__, 'filter_redirect' ], 10, 2 );
        add_filter( 'login_url',        [ __CLASS__, 'filter_simple_url' ], 10, 1 );
        add_filter( 'logout_url',       [ __CLASS__, 'filter_simple_url' ], 10, 1 );
        add_filter( 'lostpassword_url', [ __CLASS__, 'filter_simple_url' ], 10, 1 );
        add_filter( 'register_url',     [ __CLASS__, 'filter_simple_url' ], 10, 1 );
    }

    public static function handle_request() {
        $request = $_SERVER['REQUEST_URI'] ?? '';
        $path    = trim( parse_url( $request, PHP_URL_PATH ) ?? '', '/' );

        // Direct wp-login.php request -> 404 (unless already routed through our slug)
        if ( preg_match( '#^wp-login\.php#i', $path ) && empty( $GLOBALS['leit_hide_login_internal'] ) ) {
            self::not_found();
        }

        // Secret slug -> load wp-login.php
        if ( $path === self::slug() ) {
            $GLOBALS['leit_hide_login_internal'] = true;
            $qs = $_SERVER['QUERY_STRING'] ?? '';
            $_SERVER['REQUEST_URI']  = '/wp-login.php' . ( $qs ? '?' . $qs : '' );
            $_SERVER['SCRIPT_NAME']  = '/wp-login.php';
            $_SERVER['PHP_SELF']     = '/wp-login.php';
            require ABSPATH . 'wp-login.php';
            exit;
        }
    }

    public static function block_wp_admin() {
        if ( ! is_admin() )                 return;
        if ( is_user_logged_in() )          return;
        if ( wp_doing_ajax() )              return;
        if ( defined( 'DOING_CRON' ) )      return;

        $script = basename( $_SERVER['SCRIPT_NAME'] ?? '' );
        if ( in_array( $script, [ 'admin-ajax.php', 'admin-post.php' ], true ) ) return;

        self::not_found();
    }

    public static function filter_url( $url, $path = '', $scheme = null, $blog_id = null ) {
        return self::rewrite( $url );
    }

    public static function filter_simple_url( $url ) {
        return self::rewrite( $url );
    }

    public static function filter_redirect( $location, $status ) {
        return self::rewrite( $location );
    }

    private static function rewrite( $url ) {
        if ( is_string( $url ) && strpos( $url, 'wp-login.php' ) !== false ) {
            return str_replace( 'wp-login.php', self::slug(), $url );
        }
        return $url;
    }

    private static function not_found() {
        status_header( 404 );
        nocache_headers();
        if ( function_exists( 'get_404_template' ) ) {
            $template = get_404_template();
            if ( $template ) include $template;
        } else {
            echo '<!DOCTYPE html><html><head><title>404</title></head><body><h1>404 Not Found</h1></body></html>';
        }
        exit;
    }
}

LEIT_Hide_Login::init();
