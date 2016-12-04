<?php get_header(); ?>
    <!-- button up -->
    <div class="up" id="up">
        <a href="#header">
            <div class="block"></div>
        </a>
    </div>
    <!-- button up end-->
    <!-- section about-my-->
    <section class="section-services" id="services">
        <div class="container">
            <h2>Про мене</h2>
            <h2 class="my-name">Богдан Бардахівський</h2> <img src="/img/my-foto.jpg" width="219" height="219" alt="my-foto"> <span> <b> Мені </b>26 років .<br>
           <b> Проживаю </b>в місті Львів.<br>
           <b>  Маю досвід роботи</b> оператором ЧПУ<b> 3 роки.</b> <br>
             Закінчив Національний університет <b> «Львівська політехніка».</b> <br>
             <b> Здобув освіту</b> магістр з управління якістю.
             <br>
             Без шкідливих звичок.
             <br>
            Неодружений.
             <br>
             Протягом останніх 8 місяців активно вивчаю <b> Web</b> розробку.
             <br>
             Маю велике бажання розвиватись в цьому напрямку.
              </span> </div>
    </section>
    <!-- section about-my end-->
    <!-- section scills-->
    <section class="section-skills" id="skills">
        <div class="container">
            <h2>Навики</h2>
            <p> HTML5 </p><span> Оформлення текстів.<br>Позиціювання. <br>Форми.  <br>
             
              Правильне вкладення тегів.
                <br>
               Блочна верстка.
                </span>
            <br>
            <p>CSS3 </p><span> Знання псевдокласів , селекторів. <br>Анімація CSS.<br> Адаптивна верстака.<br>Тіні.<br>Градієнти.<br>Плавні переходи. <br> CSS фільтри. </span>
            <p>Bootstrap 3 </p><span>  Використання сітки.  </span>
            <p>Less</p> <span>Змінні.<br>
            Вкладення CSS правил.<br>
           
            </span>
            <p>jQuery</p> <span>Початкові знання. </span>
            <p>Photoshop</p> <span>Рівень створення простих PSD макетів.</span>
            <p>WordPress</p> <span>Знайомий з інтерфейсом та базовими функціями.</span> </div>
    </section>
    <!-- section scills end-->
    <!-- section portfolio-->
    <section class="portfolio" id="portfolio">
        <div class="container">
            <h2>Portfolio</h2>
            <div class="port ">
                <a href="https://bohdan-barda.github.io/daylite/"><img src="/img/day-lit.png" width="262" ; height="502" alt="img"></a>
            </div>
            <div class="port">
                <a href="https://bohdan-barda.github.io/blue-isea/"><img src="/img/blue-is.jpg" width="261" ; height="502" alt="img-1"></a>
            </div>
            <div class="port">
                <a href="https://bohdan-barda.github.io/test/#"><img src="/img/pokemo.jpg" width="259" ; height="500" alt="img-2"></a>
            </div>
        </div>
    </section>
    <!-- section portfolio end-->
    <!-- section contct-->
    <section class="contact-us" id="contact">
        <div class="container">
            <h2>Contact us</h2>
            <h3 class="ic-envelope-square">Email</h3> <span>Bohdbard@gmail.com</span>
            <h3 class="ic-phone-square">Tel.</h3> <span>+0985476485</span>
            <form action="get">
                <input type="text" placeholder="your Name *">
                <br>
                <input type="email" placeholder="your e-mail *">
                <br>
                <textarea placeholder="Your message *" rows="5" cols="23"></textarea>
                <br>
                <button class="btn btn-default center " type="submit">Send Message</button>
            </form>
        </div>
        </div>
    </section>
    <!-- section contct end-->
    <?php get_footer(); ?>