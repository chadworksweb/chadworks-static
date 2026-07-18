<?php
/**
 * Plugin Name: LEIT Anti-Spam Contact Form
 * Description: Honeypot + timestamp + gibberish detection + rate limiting for Fusion Builder contact forms.
 * Version: 1.0.0
 * Author: LEIT
 */

if ( ! defined( 'ABSPATH' ) ) exit;

// ── Inject honeypot + timestamp fields into Fusion forms via JS ──

add_action( 'wp_footer', 'leit_contact_antispam_inject_fields' );

function leit_contact_antispam_inject_fields() {
    ?>
    <script>
    (function(){
        var forms = document.querySelectorAll('.fusion-form form');
        if (!forms.length) return;
        forms.forEach(function(form){
            // Honeypot — hidden field bots will fill
            var hp = document.createElement('div');
            hp.style.cssText = 'position:absolute;left:-9999px;top:-9999px;';
            hp.setAttribute('aria-hidden', 'true');
            hp.innerHTML = '<label for="leit_company_url">Company Website</label><input type="text" name="leit_company_url" id="leit_company_url" value="" autocomplete="off" tabindex="-1" />';
            form.appendChild(hp);

            // Timestamp token
            var ts = document.createElement('input');
            ts.type = 'hidden';
            ts.name = 'leit_cf_ts';
            ts.value = btoa(String(Math.floor(Date.now() / 1000)));
            form.appendChild(ts);
        });
    })();
    </script>
    <?php
}

// ── Intercept Fusion form AJAX before it processes ──

add_action( 'wp_ajax_nopriv_fusion_form_submit_ajax', 'leit_contact_antispam_check', 5 );
add_action( 'wp_ajax_fusion_form_submit_ajax', 'leit_contact_antispam_check', 5 );

function leit_contact_antispam_check() {
    $form_data_raw = isset( $_POST['formData'] ) ? wp_unslash( $_POST['formData'] ) : '';
    parse_str( $form_data_raw, $fields );

    // 1. Honeypot — if filled, it's a bot
    if ( ! empty( $fields['leit_company_url'] ) ) {
        leit_contact_antispam_die( 'honeypot', $fields );
    }

    // 2. Timestamp — reject if submitted in under 3 seconds
    if ( ! empty( $fields['leit_cf_ts'] ) ) {
        $submitted = (int) base64_decode( $fields['leit_cf_ts'] );
        if ( $submitted > 0 && ( time() - $submitted ) < 3 ) {
            leit_contact_antispam_die( 'too_fast', $fields );
        }
    }

    // 3. Rate limit — 5 submissions per IP per hour
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $transient_key = 'leit_cf_' . md5( $ip );
    $count = (int) get_transient( $transient_key );
    if ( $count >= 5 ) {
        leit_contact_antispam_die( 'rate_limit', $fields );
    }
    set_transient( $transient_key, $count + 1, HOUR_IN_SECONDS );

    // 4. Content checks — gibberish detection
    // Fusion Builder field keys vary — search all fields for name/message patterns
    $name    = leit_find_field( $fields, [ 'name', 'your_name', 'full_name', 'your-name', 'full-name' ] );
    $message = leit_find_field( $fields, [ 'message', 'your_message', 'your-message', 'comments', 'msg' ] );

    if ( $name && leit_is_gibberish( $name ) ) {
        leit_contact_antispam_die( 'gibberish_name', $fields );
    }

    if ( $message && leit_is_gibberish( $message ) ) {
        leit_contact_antispam_die( 'gibberish_message', $fields );
    }

    // 5. Name must contain a space (first + last name pattern)
    if ( $name && strlen( $name ) > 2 && strpos( trim( $name ), ' ' ) === false ) {
        // Single-word names are suspicious for a tree service contact form
        // but not blocking — combined with other signals
        if ( leit_has_no_vowel_pattern( $name ) ) {
            leit_contact_antispam_die( 'no_vowels_name', $fields );
        }
    }

    // Passed all checks — let Fusion Builder handle normally
}

/**
 * Find a field value by trying multiple possible key names (case-insensitive).
 */
function leit_find_field( $fields, $candidates ) {
    // Try exact matches first
    foreach ( $candidates as $key ) {
        if ( isset( $fields[ $key ] ) && $fields[ $key ] !== '' ) {
            return $fields[ $key ];
        }
    }
    // Try case-insensitive match on all field keys
    foreach ( $fields as $key => $value ) {
        $lower = strtolower( $key );
        foreach ( $candidates as $candidate ) {
            if ( $lower === $candidate || str_contains( $lower, $candidate ) ) {
                return $value;
            }
        }
    }
    return '';
}

/**
 * Detect gibberish strings: high consonant clusters, no real words, random casing.
 */
function leit_is_gibberish( $text ) {
    $text = trim( $text );

    // Too short to judge
    if ( strlen( $text ) < 6 ) return false;

    // Check consonant-to-vowel ratio
    $lower    = strtolower( preg_replace( '/[^a-zA-Z]/', '', $text ) );
    if ( strlen( $lower ) < 4 ) return false;

    $vowels     = preg_match_all( '/[aeiou]/', $lower );
    $consonants = strlen( $lower ) - $vowels;

    // Extreme consonant ratio (normal English ~60% consonants, gibberish often 75%+)
    if ( $consonants / strlen( $lower ) > 0.78 ) return true;

    // Long consonant clusters (4+ consonants in a row is rare in English)
    if ( preg_match( '/[^aeiou\s]{5,}/i', $lower ) ) return true;

    // Excessive uppercase mixing in a single "word" (e.g., SYpKZlUnqhewyzMgVn)
    $words = preg_split( '/\s+/', trim( $text ) );
    foreach ( $words as $word ) {
        if ( strlen( $word ) < 4 ) continue;
        $uppers = preg_match_all( '/[A-Z]/', $word );
        $lowers = preg_match_all( '/[a-z]/', $word );
        // More than 30% uppercase in a word longer than 6 chars (not all-caps or all-lower)
        if ( strlen( $word ) > 6 && $uppers > 0 && $lowers > 0 && $uppers / strlen( $word ) > 0.3 ) {
            return true;
        }
    }

    return false;
}

/**
 * Check if a string has suspiciously few vowels.
 */
function leit_has_no_vowel_pattern( $text ) {
    $alpha = preg_replace( '/[^a-zA-Z]/', '', $text );
    if ( strlen( $alpha ) < 4 ) return false;
    $vowels = preg_match_all( '/[aeiou]/i', $alpha );
    return ( $vowels / strlen( $alpha ) ) < 0.15;
}

/**
 * Kill the request with a generic error (don't reveal spam detection).
 */
function leit_contact_antispam_die( $reason, $fields ) {
    leit_contact_antispam_log( $reason, $fields );

    $response = [
        'status'  => 'error',
        'info'    => 'error',
        'message' => '<div class="fusion-form-response"><span>Sorry, your message could not be sent. Please call us instead.</span></div>',
    ];
    die( wp_json_encode( $response ) );
}

/**
 * Log blocked attempts when WP_DEBUG is on.
 */
function leit_contact_antispam_log( $reason, $fields ) {
    if ( ! defined( 'WP_DEBUG' ) || ! WP_DEBUG ) return;
    error_log( sprintf(
        '[LEIT-AntiSpam-Contact] Blocked (%s): name=%s, email=%s, ip=%s',
        $reason,
        sanitize_text_field( $fields['name'] ?? $fields['your_name'] ?? 'unknown' ),
        sanitize_email( $fields['email'] ?? $fields['email_address'] ?? '' ),
        $_SERVER['REMOTE_ADDR'] ?? 'unknown'
    ) );
}
