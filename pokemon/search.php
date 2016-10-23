<!DOCTYPE html>
<html lang="uk">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1.0,user-scalable=no">
         </head>
 <form action="" method="post" >
      <input type="search" name="s" class="search" placeholder="Пошук">
        <input type="submit" class="button"  name="submit" value=" ">
       </form>
<hr>
  <link href="<?= bloginfo('template_directory'); ?>/style3.css" rel="stylesheet" type="text/css" />
<div id="content">
    <div id="center">
        <h1><?php echo 'Результат пошуку: ' . '<span>' . get_search_query() . '</span>'; ?></h1>
        <?php
        if (have_posts()) :
            while (have_posts()) : the_post();
                ?>
                <div id="posts">
                    <h2><a href="<?php the_permalink() ?>"><?php the_title() ?></a></h2>
                    <div id="post_info">
                        <div>Автор: <?php the_author() ?></div>
                        <div>Дата добавлення: <?php the_date() ?></div>
                        
                    </div>
                    <p><?php the_excerpt() ?></p>
                   
                </div>
            <?php endwhile; ?>
        <?php
        else :
            echo "<b>Нічого не знайдено</b>";
        endif;
        ?>
    </div>
 <hr>
    <br>
  <?php get_footer()?>    