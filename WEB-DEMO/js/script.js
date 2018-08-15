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
		//$idxGsSlider.greatSlider({
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
			onInited: ()=>{
				//recorremos ls imagenes
				$a = 0; $b = 0, $c = 0;
				var $itemMap = $idxGsSlider.find('.idx-img-map:eq(0)').parents('.gs-item-slider').index() + 1;

				//var $itemMap = $idxGsSlider.find('.idx-img-map:eq(0)').parents().html();
				console.log($itemMap);
				
				$idxGsSlider.find('.img-slider').each(function(){
					var $thumbUrl = $(this).attr('data-lazy');
					$idxGsSlider.find('.gs-bullet:eq('+$a+')').css({'background':'url('+$thumbUrl+')'});
					$a+=1;
					if($(this).hasClass('idx-img-map')){
						$c+=1;	
					}else{
						$b+=1;
					}
				});

				$("<label>("+$b+")</label>").appendTo('#idx-nph span');
				$("<label>("+$c+")</label>").appendTo('#idx-nmp span');

				if($itemMap>0){
					$('#idx-nmp').click(()=>{
						$idxGsSliderGen.goTo($itemMap);
					});
				}

				$('#idx-nph').click(()=>{
					$idxGsSliderGen.goTo(1);
				});

				$('.idx-gs-nav-btn .gs-next-arrow').click(()=>{
					$idxGsSliderGen.goTo('next');
				});

				$('.idx-gs-nav-btn .gs-prev-arrow').click(()=>{
					$idxGsSliderGen.goTo('prev');
				});
			}
		});
	}

}(jQuery));

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