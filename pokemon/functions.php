<?php 
// регистриція стилів + скріптів
function style_script_load() {
wp_enqueue_style( 'style', get_stylesheet_uri());
    
    
	
wp_enqueue_script( 'jquery-3.0.0.min', get_template_directory_uri() . '/jquery-3.0.0.min.js');

wp_enqueue_script( 'jquery.glide', get_template_directory_uri() . '/jquery.glide.js');    
    
}    
add_action( 'wp_enqueue_scripts', 'style_script_load' );

// регистриція мініатюр
add_theme_support( 'post-thumbnails' );


 



