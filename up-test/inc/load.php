<?php
/********
  //Подключения дополнительных файлов компонента
  $more = array(
    'js' => 'scrip_moret.js',
    'css' => 'style_more.css'
  );
  //Подключения компонента С дополнтельными файлами
  Load::component('price', $more);
  
  //Подключения компонента без дополнительный файлов
  Load::component('faq');




*********/

class Load {
  //УРЛ сайта
  static $addr = '/coincube/';

  function component( $name, $dop = false ){
    $file_url = $_SERVER['DOCUMENT_ROOT'] . self::$addr . 'component/' . $name . '/index.php';
    //Подключаем стили
    echo self::render($name);
    include($file_url);

    if(!empty( $dop )) {
      foreach ($dop as $key => $value) {
        echo self::render($name, $key, $value);
      }
    }

    echo self::render($name, 'js');
  }

  //Генерирует ссылку на фалй
  function get_style( $name, $type = 'css', $file_name_add = false ){
    if($type == 'css')
      $file_name = 'css.css';
    else
      $file_name = 'script.js';

    //если есть нужда в подключении ополнительного файла
    if($file_name_add) 
      $file_name = $file_name_add;

    $url = self::$addr . 'component/' . $name . '/' . $file_name;
    $file_url = $_SERVER['DOCUMENT_ROOT'] . self::$addr . 'component/' . $name . '/' . $file_name;

    if( file_exists( $file_url ) )
      return $url;
  }

  function render( $name, $type = 'css', $file_name_add = false   ) {
    $url = self::get_style( $name, $type, $file_name_add );

    if( $url && $type == 'css' )
      return "\n" . '<link rel="stylesheet" type="text/css" href="' . $url . '">' . "\n";

    if( $url && $type == 'js' )
      return "\n" . '<script src="' . $url . '"></script>' . "\n";
  }

}

# in your PHP code:
ini_set('display_errors', '0');     # don't show any errors...
error_reporting(E_ALL | E_STRICT);  # ...but do log them
?>