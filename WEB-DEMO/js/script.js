(function($) {

	var graphElement1 = "chart1";
	graphGenerator(graphElement1);

	var graphElement2 = "chart2";
	graphGenerator(graphElement2);

	var graphElement3 = "chart3";
	graphGenerator(graphElement3);

	/*----------------------------------------------------------------------------------*/
	/* Construyendo el slider en la propiedad
	/*----------------------------------------------------------------------------------*/
	var $idxGsSlider = $('#idx-gs-slider');
	if($idxGsSlider.length){
		let $idxGsSliderGen = $idxGsSlider.greatSlider({
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
				if($imgCount>0){ $htmlButtonImg = '<button id="idx-btn-img" class="idx-btn-nav idx-icon-img"><span>Photos<label>('+$imgCount+')</label></span></button>' }
				if($mapCount>0){ $htmlButtonMap = '<button id="idx-btn-map" class="idx-btn-nav idx-icon-map"><span>Mapa<label>('+$mapCount+')</label></span></button>' }
				if($vidCount>0){ $htmlButtonVid = '<button id="idx-btn-vid" class="idx-btn-nav idx-icon-vid"><span>Video<label>('+$vidCount+')</label></span></button>' }

				//Asignamos los botones en el contenedor
				$(".idx-media-nav").html($htmlButtonImg+$htmlButtonMap+$htmlButtonVid);

				//Obtenemos el primer item correspondiente al mapa y video
				var $itemMap = $idxGsSlider.find('.idx-img-map:eq(0)').parents('.gs-item-slider').index() + 1;
				var $itemVid = $idxGsSlider.find('.idx-img-vid:eq(0)').parents('.gs-item-slider').index() + 1;

				//Asignamos la acción al boton de "Imagenes"
				$('#idx-btn-img').click(()=>{
					$idxGsSliderGen.goTo(1);
				});

				//Asignamos la acción al boton de "Mapas"
				$('#idx-btn-map').click(()=>{
					$idxGsSliderGen.goTo($itemMap);
				});

				//Asignamos la acción al boton de "Videos"
				$('#idx-btn-vid').click(()=>{
					$idxGsSliderGen.goTo($itemVid);
				});

				//Asignamos los botones de navegación
				var $navButtons = $idxGsSlider.find('.gs-container-items');
				$("<div class='idx-gs-nav-btn'><button class='gs-prev-arrow'><span></span></button><button class='gs-next-arrow'><span></span></button></div>").appendTo($navButtons);

				//Asignamos la acción al boton de "NEXT"
				$('.idx-gs-nav-btn .gs-next-arrow').click(()=>{
					$idxGsSliderGen.goTo('next');
				});

				//Asignamos la acción al boton de "PREV"
				$('.idx-gs-nav-btn .gs-prev-arrow').click(()=>{
					$idxGsSliderGen.goTo('prev');
				});
			}
		});
	}

	/*----------------------------------------------------------------------------------*/
	/* Construyendo slider general
	/*----------------------------------------------------------------------------------*/
	var $generalSlider = $(".idx-general-slider");
	let $generalSliderGen;
	if($generalSlider.length) {
		$generalSliderGen = $generalSlider.greatSlider({
			type: 'swipe',
			nav: false,
			lazyLoad: true,
			bullets: false,
			items: 1,
			layout: {
				arrowDefaultStyles: false
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

	/*----------------------------------------------------------------------------------*/
	/* Mostrar más propiedades
	/*----------------------------------------------------------------------------------*/
	$(document).on('click', '.idx-btn-sm', function(){
		$(this).toggleClass('active');
		$(this).parents('.idx-wrap').find('.idx-basic-list').toggleClass('active');
	});

}(jQuery));

/*----------------------------------------------------------------------------------*/
/* Funcion carga por demanda
/*----------------------------------------------------------------------------------*/

/*----------------------------------------------------------------------------------*/
/* Generador de Gráficas
/*----------------------------------------------------------------------------------*/
function graphGenerator(graphElement){
	var graphElementData = JSON.parse($("#"+graphElement).attr('data-element'));
	var graphElementLabels = JSON.parse($("#"+graphElement).attr('data-labels'));
	var ctx = document.getElementById(graphElement).getContext('2d');
	var myChart = new Chart(ctx, {
	    type: 'bar',
	    responsive: true,
	    data: {
        labels: graphElementLabels,
        datasets: [{
          label: "",
          data: graphElementData,
          backgroundColor: "rgba(101, 131, 193, 0.3)",
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