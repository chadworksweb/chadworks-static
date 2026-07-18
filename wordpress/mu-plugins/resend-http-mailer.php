<?php
/**
 * Plugin Name: Resend HTTP Mailer
 * Description: Overrides wp_mail() to send via Resend HTTP API (port 443), bypassing SMTP port restrictions.
 * Version: 1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// Requires RESEND_API_KEY, RESEND_FROM_EMAIL, RESEND_FROM_NAME in wp-config.php
add_filter( 'pre_wp_mail', 'resend_http_send', 10, 2 );

function resend_http_send( $null, $atts ) {
    $api_key = defined( 'RESEND_API_KEY' ) ? RESEND_API_KEY : '';
    if ( empty( $api_key ) ) {
        return $null; // Fall through to default wp_mail if no key configured
    }

    $to         = $atts['to'];
    $subject    = $atts['subject'];
    $message    = $atts['message'];
    $headers    = isset( $atts['headers'] ) ? $atts['headers'] : '';
    $attachments = isset( $atts['attachments'] ) ? $atts['attachments'] : [];

    // Normalize $to to array
    if ( ! is_array( $to ) ) {
        $to = array_map( 'trim', explode( ',', $to ) );
    }

    // Parse headers
    $from_email = defined( 'RESEND_FROM_EMAIL' ) ? RESEND_FROM_EMAIL : 'wordpress@' . wp_parse_url( home_url(), PHP_URL_HOST );
    $from_name  = defined( 'RESEND_FROM_NAME' ) ? RESEND_FROM_NAME : get_bloginfo( 'name' );
    $content_type = 'text/plain';
    $reply_to   = '';
    $cc         = [];
    $bcc        = [];

    if ( ! is_array( $headers ) ) {
        $headers = explode( "\n", str_replace( "\r\n", "\n", $headers ) );
    }

    foreach ( $headers as $header ) {
        $header = trim( $header );
        if ( empty( $header ) ) {
            continue;
        }
        if ( strpos( $header, ':' ) === false ) {
            continue;
        }

        list( $name, $value ) = explode( ':', $header, 2 );
        $name  = strtolower( trim( $name ) );
        $value = trim( $value );

        switch ( $name ) {
            case 'from':
                // Parse "Name <email>" or just "email"
                if ( preg_match( '/(.+)<(.+)>/', $value, $m ) ) {
                    $from_name  = trim( $m[1], ' "' );
                    $from_email = trim( $m[2] );
                } else {
                    $from_email = trim( $value );
                }
                break;
            case 'content-type':
                if ( stripos( $value, 'text/html' ) !== false ) {
                    $content_type = 'text/html';
                }
                break;
            case 'reply-to':
                $reply_to = $value;
                break;
            case 'cc':
                $cc = array_merge( $cc, array_map( 'trim', explode( ',', $value ) ) );
                break;
            case 'bcc':
                $bcc = array_merge( $bcc, array_map( 'trim', explode( ',', $value ) ) );
                break;
        }
    }

    $from = $from_name ? "{$from_name} <{$from_email}>" : $from_email;

    $body = [
        'from'    => $from,
        'to'      => $to,
        'subject' => $subject,
    ];

    if ( $content_type === 'text/html' ) {
        $body['html'] = $message;
    } else {
        $body['text'] = $message;
    }

    if ( ! empty( $reply_to ) ) {
        $body['reply_to'] = $reply_to;
    }
    if ( ! empty( $cc ) ) {
        $body['cc'] = $cc;
    }
    if ( ! empty( $bcc ) ) {
        $body['bcc'] = $bcc;
    }

    // Attachments
    if ( ! empty( $attachments ) ) {
        $attach_data = [];
        foreach ( (array) $attachments as $file ) {
            if ( is_file( $file ) ) {
                $attach_data[] = [
                    'filename' => basename( $file ),
                    'content'  => base64_encode( file_get_contents( $file ) ),
                ];
            }
        }
        if ( ! empty( $attach_data ) ) {
            $body['attachments'] = $attach_data;
        }
    }

    $response = wp_remote_post( 'https://api.resend.com/emails', [
        'headers' => [
            'Authorization' => 'Bearer ' . $api_key,
            'Content-Type'  => 'application/json',
        ],
        'body'    => wp_json_encode( $body ),
        'timeout' => 30,
    ] );

    if ( is_wp_error( $response ) ) {
        error_log( '[Resend HTTP] wp_remote_post error: ' . $response->get_error_message() );
        do_action( 'wp_mail_failed', new WP_Error( 'resend_http_error', $response->get_error_message(), $atts ) );
        return false;
    }

    $code = wp_remote_retrieve_response_code( $response );
    $resp_body = wp_remote_retrieve_body( $response );

    if ( $code >= 200 && $code < 300 ) {
        return true;
    }

    $error_msg = "[Resend HTTP] API returned {$code}: {$resp_body}";
    error_log( $error_msg );
    do_action( 'wp_mail_failed', new WP_Error( 'resend_http_error', $error_msg, $atts ) );
    return false;
}
