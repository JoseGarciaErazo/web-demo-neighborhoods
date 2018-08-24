var userAgent, ieReg, ie;
userAgent = window.navigator.userAgent;
ieReg = /msie|Trident.*rv[ :]*11\./gi;
ie = ieReg.test(userAgent);

/*----------------------------------------------------------------------------------*/
/* Funcion que carga las imagenes (validación para explorer)
/*----------------------------------------------------------------------------------*/
function loadImage(element){
	if(ie) {
		element.css("backgroundImage", 'url(' + element.find('.gs-lazy').attr('data-lazy') + ')');
		element.find('.gs-lazy').remove();
		if(!element.hasClass('loaded')) element.addClass('loaded');
	}else{
		if(!element.hasClass('loading')) element.addClass('loading');
			element.find('.gs-lazy').attr('src', element.find('.gs-lazy').attr('data-lazy'));
			element.find('.gs-lazy').on('load', function(){
				element.removeClass('idx-blazy loading');
				element.find('.gs-lazy').removeAttr('data-lazy');
				if(!element.hasClass('loaded')) element.addClass('loaded');
		});
	}
}

/*----------------------------------------------------------------------------------*/
/* Construyendo el slider en la propiedad
/*----------------------------------------------------------------------------------*/
function loadPropertySlider(element){
	var $idxGsSlider = $('#'+element);
	$idxGsSlider.removeClass('idx-blazy');
	if($idxGsSlider.length){
		var $idxGsSliderGen = $idxGsSlider.greatSlider({
			type: 'swipe',
			nav: false,
			navSpeed: 500,
			lazyLoad: true,
			bullets: true,
			items: 1,
			layout: {
				bulletDefaultStyles: false,
				wrapperBulletsClass: 'idx-gs-wrapper-bullets',
			},
			onInited: function(){

				$a = 0; //Contador de index para cada Bullet
				$imgCount = 0, //Contador de imagenes
				$mapCount = 0; //Contador de imagenes de mapa
				$vidCount = 0; //Contador de videos

				$htmlButtonImg = ""; //Boton de acción para las imagenes
				$htmlButtonMap = ""; //Boton de acción para los mapas
				$htmlButtonVid = ""; //Boton de acción para los videos

				$idxGsSlider.find('.img-slider').each(function(){
					var $thumbUrl = $(this).attr('data-lazy'); // Recorremos los items del slider y obtenemos la ruta de la imagen
					
					//Contamos los items de cada caso
					if($(this).hasClass('idx-img-map')){
						$idxGsSlider.find('.gs-bullet:eq('+$a+')').css({'background':'url('+$thumbUrl+')'}); //Asignamos las imagenes de fondo a los bullets
						$mapCount+=1;	
					}else if($(this).hasClass('idx-img-vid')){
						$idxGsSlider.find('.gs-bullet:eq('+$a+')').addClass("idx-ico-play").html("<span></span>"); //Asignamos las imagenes de fondo a los bullets
						$vidCount+=1;
					}else{
						$idxGsSlider.find('.gs-bullet:eq('+$a+')').css({'background':'url('+$thumbUrl+')'}); //Asignamos las imagenes de fondo a los bullets
						$imgCount+=1;
					}

					//Inicializamos el conteno de los index por cada bullet
					$a+=1;
				});

				//Generando los botones de acción para el nav del slider
				if($imgCount>0){ $htmlButtonImg = '<button id="idx-btn-img" class="idx-btn-nav idx-icon-img active"><span>Photos<label>('+$imgCount+')</label></span></button>' }
				if($mapCount>0){ $htmlButtonMap = '<button id="idx-btn-map" class="idx-btn-nav idx-icon-map"><span>Mapa<label>('+$mapCount+')</label></span></button>' }
				if($vidCount>0){ $htmlButtonVid = '<button id="idx-btn-vid" class="idx-btn-nav idx-icon-vid"><span>Video<label>('+$vidCount+')</label></span></button>' }

				//Asignamos los botones en el contenedor
				$(".idx-media-nav").html($htmlButtonImg+$htmlButtonMap+$htmlButtonVid);

				//Obtenemos el primer item correspondiente al mapa y video
				var $itemMap = $idxGsSlider.find('.idx-img-map:eq(0)').parents('.gs-item-slider').index() + 1;
				var $itemVid = $idxGsSlider.find('.idx-img-vid:eq(0)').parents('.gs-item-slider').index() + 1;

				//Asignamos la acción al botones de navegación en el slider
				$(document).on('click', '.idx-media-nav .idx-btn-nav', function(){
					$(".idx-media-nav .idx-btn-nav").removeClass("active");
					$(this).addClass("active");
					switch ($(this).attr('id').split(' ')[0]){
						case 'idx-btn-img':
							$idxGsSliderGen.goTo(1);
							break
						case 'idx-btn-map':
							$idxGsSliderGen.goTo($itemMap);
							break
						case 'idx-btn-vid':
							$idxGsSliderGen.goTo($itemVid);
							break
					}
				});

				//Asignamos los botones de navegación
				var $navButtons = $idxGsSlider.find('.gs-container-items');
				$("<div class='idx-gs-nav-btn'><button class='gs-prev-arrow'><span></span></button><button class='gs-next-arrow'><span></span></button></div>").appendTo($navButtons);

				//Asignamos la acción al boton de "NEXT"
				$('.idx-gs-nav-btn .gs-next-arrow').click(function(){
					$idxGsSliderGen.goTo('next');
				});

				//Asignamos la acción al boton de "PREV"
				$('.idx-gs-nav-btn .gs-prev-arrow').click(function(){
					$idxGsSliderGen.goTo('prev');
				});
			}
		});
	}
}

/*----------------------------------------------------------------------------------*/
/* Construyendo slider general
/*----------------------------------------------------------------------------------*/
function loadGenSlider(element){
	var $generalSlider = $('#'+element);
	if($generalSlider.length) {
		var $generalSliderGen = $generalSlider.greatSlider({
			type: 'swipe',
			nav: false,
			lazyLoad: true,
			bullets: false,
			items: 1,
			layout: {
				arrowDefaultStyles: false,
				itemLoadingClass: ''
			},
			breakPoints: {
				640: {
					items: 2,
					nav: true,
				},
				1100: {
					items: 3
				},
				1400: {
					items: 4
				}
			},
			onInited: function(){
				setTimeout(function(){ 
					loadActiveItem();
				}, 300);

				$generalSlider.find('.idx-grid-ng-img').each(function(){
					loadImage($(this));
				});
			},
			onStepStart: function(){
				loadActiveItem();
			},
			onResized: function(){
				setTimeout(function(){ 
					loadActiveItem();
				}, 300);
			}
		})

		function loadActiveItem(){
			$generalSlider.find('.gs-item-slider').removeClass('gs-item-active-b');
			var x = 0;
			var itemActivo = $generalSliderGen.getActive();
			var itemActiveIndex = itemActivo.index;
			var itemsShow = $generalSliderGen.getItems();
			var countItems = itemActiveIndex - (itemsShow - 1);
			if(itemActiveIndex == 1){ itemActiveIndex = 2; }
			if(itemsShow > 1){
				for (x = countItems; x <= itemActiveIndex; x++) { 
					$generalSlider.find('.gs-item-slider:nth-child('+x+')').addClass('gs-item-active-b');
				}
			}
		}
	}
}

/*----------------------------------------------------------------------------------*/
/* Generador de Gráficas
/*----------------------------------------------------------------------------------*/
function graphGenerator(graphElement){
	var graphElementData = JSON.parse($("#"+graphElement).attr('data-element'));
	var graphElementLabels = JSON.parse($("#"+graphElement).attr('data-labels'));
	var graphElementColors = $("#"+graphElement).attr('data-color');
	var ctx = document.getElementById(graphElement).getContext('2d');
	
	var r = parseInt(graphElementColors.substring(0,2), 16);
	var g = parseInt(graphElementColors.substring(2,4), 16);
	var b = parseInt(graphElementColors.substring(4,6), 16);
	var color = 'rgba(' + r + ', ' + g + ', ' + b + ',0.3)';

	var myChart = new Chart(ctx, {
	    type: 'bar',
	    responsive: true,
	    data: {
        labels: graphElementLabels,
        datasets: [{
          label: "",
          data: graphElementData,
          backgroundColor: color,
          borderWidth: 2,
        }]
	    },
	    options: {
        scaleFontColor: 'red',
        scales: {
          yAxes: [{
              ticks: {
                  beginAtZero:true,
                  fontColor: "#FFF"
              }
          }],
          xAxes: [{
            ticks: {
              fontColor: "#FFF"
            }
          }],
        },
        legend: {
          display: false
        },
        tooltips: {
          yAlign: 'bottom',
          displayColors: false,
          callbacks: {
            label: function(tooltipItem, data) {
                return data.labels[tooltipItem.index] + ': ' + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
            },
            title: function(tooltipItem, data) {
              return;
            }
          }
        }
	    }
	});
}

/*----------------------------------------------------------------------------------*/
/* Mostrar Video
/*----------------------------------------------------------------------------------*/
function creaIframeVideo(elBoton){
  var $urlVideo = elBoton.attr('data-video');
  if ($urlVideo !== undefined) {
    var $urlVideo = $urlVideo.toString();
    if ($urlVideo.indexOf('youtube') !== -1) { // es un video de Youtube, EJM: https://www.youtube.com/watch?v=9RBSH7Xvn3Q
      // primer limpiesa
      var et = $urlVideo.lastIndexOf('&')
      if(et !== -1){
        $urlVideo = $urlVideo.substring(0, et)
      }
      var embed = $urlVideo.indexOf('embed');
      if (embed !== -1) {
        $urlVideo = 'https://www.youtube.com/watch?v=' + $urlVideo.substring(embed + 6, embed + 17);
      }
      var srcVideo = 'https://www.youtube.com/embed/' + $urlVideo.substring($urlVideo.length - 11, $urlVideo.length) + '?autoplay=1';
    } else if ($urlVideo.indexOf('vimeo') !== -1) { // es un video de Vimeo, EJM: https://vimeo.com/206418873
      var srcVideo = 'https://player.vimeo.com/video/' + $urlVideo.substring(($urlVideo.indexOf('.com') + 5), $urlVideo.length).replace('/', '');
    } else {
      alert('The video assigned is not from Youtube or Vimeo, remember to enter the correct complete link of the video .\n - Youtube: https://www.youtube.com/watch?v=9RBSH7Xvn3Q\n - Vimeo: https://vimeo.com/206418873');
      return false;
    }
    return '<iframe src="' + srcVideo + '" frameborder="0" allowfullscreen></iframe>';
  } else {
    alert('No video assigned.');
    return false;
  }
}

/*----------------------------------------------------------------------------------*/
/* Activar item del menú según se hace scroll
/*----------------------------------------------------------------------------------*/
function onScroll(event){
  var scrollPos = $(document).scrollTop();
  $('#idx-internal-nav li a').each(function () {
  	var $elementSection = $($(this).attr('href'));
  	if(($elementSection.offset().top-60) <= scrollPos && ($elementSection.offset().top-60) + ($elementSection.height() - 60) > scrollPos){
			$('#idx-internal-nav li a').removeClass("active");
			$(this).addClass("active");
  	}else{
  		$(this).removeClass("active");
  	}
  });
}

/*----------------------------------------------------------------------------------*/
/* Carga por demanda
/*----------------------------------------------------------------------------------*/
function loadElement(theItem) {

	theItem.each(function(){
		var $lazyType = $(this).attr('data-type').split(' ')[0];

		switch ($lazyType){
			case 'img':
				loadImage($(this))
				break
			case 'graph':
				graphGenerator($(this).find('canvas').attr('id'));
				break
			case 'main-slider':
				loadPropertySlider($(this).attr('id'))
				break
			case 'gen-slider':
				loadGenSlider($(this).attr('id'))
				break
		}
	});
}

(function($) {

	$(document).on("load, scroll", onScroll);

	/*----------------------------------------------------------------------------------*/
	/* Mostrar más propiedades
	/*----------------------------------------------------------------------------------*/
	$(document).on('click', '.idx-btn-sm', function(){
		$(this).toggleClass('active');
		$(this).parents('.idx-wrap').find('.idx-basic-list').toggleClass('active');
	});

	/*----------------------------------------------------------------------------------*/
	/* Navegacion interna
	/*----------------------------------------------------------------------------------*/
  $(document).on('click', '#idx-internal-nav li a', function(e) {
		e.preventDefault();
    $(document).off("scroll");
    $('#idx-internal-nav li a').each(function () {
        $(this).removeClass('active');
    })
    $(this).addClass('active');
    var target = this.hash, menu = target;
    $target = $(target);
    $('html, body').stop().animate({
        'scrollTop': $target.offset().top-30
    }, 500, 'swing', function () {
      //window.location.hash = target;
      $(document).on("scroll", onScroll);
    });
  });

	/*----------------------------------------------------------------------------------*/
	/* Mostrar y cerrar video
	/*----------------------------------------------------------------------------------*/
	$(document).on('click', '.idx-btn-play', function(e) {
    e.preventDefault();
    var $iframeVideo = creaIframeVideo($(this));
    if ($iframeVideo) {
      var $wrapperVideo = $('#idx-wrap-video');
      $wrapperVideo = $("body");
      $wrapperVideo.append('<div class="idx-video-inside"><div class="idx-iframe"><div class="idx-wrap-iframe">' + $iframeVideo + '</div></div><button class="idx-modal-close"><span></span></button><div class="idx-modal-bg-close"></div></div>');
      setTimeout(function(){
        $wrapperVideo.find('.idx-video-inside').addClass('active');
      }, 500)
    }
  });

  $(document).on('click', '.idx-modal-close, .idx-modal-bg-close', function(){
    var $elParent = $(this).parent();
    $("body").find('.idx-video-inside').removeClass('active');
    setTimeout(function(){
      $elParent.remove();
    }, 500)
  });

	/*----------------------------------------------------------------------------------*/
	/* Cargando secciones por demanda
	/*----------------------------------------------------------------------------------*/
  var ultimoScroll = 0;
  $(window).on('load scroll', function(){
	  var scrollPos = $(document).scrollTop();
	  $('.idx-load-element').each(function () {
	  	var $contentId = $("#"+$(this).attr('id'));
	  	if(($contentId.offset().top-700) <= scrollPos ){
	  		var $lazyElement = $contentId.find('.idx-blazy');
	      if ($lazyElement.length) {
	        if (!$lazyElement.hasClass('loaded')) {
            $lazyElement.addClass('loaded');
            loadElement($lazyElement);
          }
	      }	
	  	}
	  });
	});

}(jQuery));