$(document).ready(function(){

	//store variables
	var wrapper      = $('#wrapper'),
		wwidth       = 0,
		wheight      = 0,
		deck         = $('.deck'),
		cardh        = $('.card h1'),
		cardp        = $('.card p'),
		indicators   = $('.indicators'),
		speed        = 300,
		currentIndex = 0,
		ease         = 'ease-out',
		isanim       = false,
		wip          = false,
		moving       = false,
		week         = ['Sunday','Monday','Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
		x,y,mx,my,
		pageX,
		pageY,
		deltaX,
		deltaY,
		moveY,
		isScrolling,
		scrollvert   = false,
		scrollhori   = false,
		logmealarr = [
			'eat',
			'consume',
			'devour',
			'feast on',
			'stuff face',
			'inject'
		],
		base_exercises = {
			date_modified : 0,
			e : {
				back : {
					arr : ['Pullup','Deadlift','Row','Seated row']
				},
				
				legs : {
					arr : ['Squat','Front Squat']
				},
				
				chest : {
					arr : ['Barbell Bench Press','Dumbbell Bench Press','Flyes']
				},
				
				bicep : {
					arr : ['Close Grip Pullup', 'Dumbbell Curl','Barbell Curl']
				},

				tricep : {
					arr : ['Dips', 'Pushdown']
				},
				
				shoulder : {
					arr : ['Side Raise','Standing Press']
				}
			}
		},
		app = {
			state : {
				date_modified       : new Date().getTime(),
				current_workout     : null,
				workout_in_progress : false,
				workout_start       : null,
				section             : null,
				slide               : null
			},
			app :{
				goals : {
					meals : {
						'Breakfast' :  1,
						'Lunch' : 1,
						'Dinner' : 1,
						'Snack' : 2,
						'Protein' : 2
					}
				},
				workouts : {

				},
				meals : {

				},
				overview : {

				}
			}
		};

		var y = moment().year();
    	
    	if(moment().month()+1 < 10){
    		var mo = moment().month()+1;
    		var m = '0'+mo;
    	}else{
    		var m = moment().month()+1;
    	}
    	if(moment().date() < 10){
    		var d = '0'+moment().date();
    	}else{
    		var d = moment().date();
    	}
    	
    	var date = ''+y + ''+ m +''+d;

	
	function toggleTab(elementclicked){
		if(elementclicked.hasClass('selected')){
			return false;
		}else{
			$('.toggler a').removeClass('selected');
			elementclicked.addClass('selected');
		}
	}
        
    function matrixToArray(matrix) {
    	return matrix.substr(7, matrix.length - 8).split(', ');
    }

    function getCurrentScreen(){
    	return {
    		transform : matrixToArray($('#vertical-slider').css('-webkit-transform')),
    		index     : -parseInt(matrixToArray($('#vertical-slider').css('-webkit-transform'))[5])/wheight 
    		}
    }
    
    function setExerciseAsPerforming(exercise){ 
	    $('.exercise[data-exercise="'+exercise+'"] .perform-q').transition({
	    	opacity : 0
	    },200, 'ease', function(){
	    	
	    	$(this).css('visibility', 'hidden');
	    	$('.exercise[data-exercise="'+exercise+'"] .inner').css('visibility', 'visible').transition({
	    		opacity : 1
	    	},250, 'ease', function(){
	    		$('.exercise[data-exercise="'+exercise+'"]').data('performing', true);
	    		app.app.workouts[app.state.current_workout].exercises[exercise].performing = true;

	    		localStorage.setItem('app_stats', JSON.stringify(app));
	    	});
	    	
	    })
    };

    function updateTimer(){
    	//pop timer
		var minutes_elapsed = Number(moment(moment(new Date())).diff(app.state.workout_start, 'minutes'));
    	var wop = minutes_elapsed % 60;
    	var hours_elapsed   = Math.floor(Number(minutes_elapsed) / 60);

    	//append
    	$('#time-elapsed #hours').text(hours_elapsed);
    	$('#time-elapsed #minutes').text(wop);
    }

    //update timer
    window.setInterval(function(){
    	updateTimer();
    },30000)	

    function showModal(action){
    	
    	$('#wrapper').append(template_modal);
    	
    	switch(action) {
    		case 'perform-workout':
    			$('#modal h1').text('Perform Workout?');
    			$('#modal').attr('data-action', 'perform-workout');
    			$('#dimmer').css('display', 'block').transition({
    				opacity : 1
    			},200,'ease');

    			$('#modal').transition({
    				'-webkit-transform' : 'translateY(0px)'
    			},300,'ease');
    		
    		break;
    	}
    };

    function resumeWorkout(){
    	//create appending string
    	var appendme = '';
    	$.each(app.app.workouts[app.state.current_workout].exercises, function(k,v){
    		var obj = {
    			name       : k,
    			performing : v.performing,
    			sets       : v.sets
    		}
			appendme += templateExercise(obj);
    	});
    	
    	//add slides
		addSlides(appendme, app.state.slide);
		updateSlider('workouts-slider', app.state.slide);
		
		$('.card.first .initial').css('visibility', 'hidden');
		$('.card.first .inner').css({
			'visibility' : 'visible',
			'opacity'    : 1
		});

		$('.card.exercise').each(function(k,v){
			if($(v).data('performing') == true){
				$(v).find('.perform-q').css({
					'visibility' : 'hidden',
					'opacity'    : 0
				});
				$(v).find('.inner').css({
					'visibility' : 'visible',
					'opacity'    : 1
				});
			}
		});

		
		updateTimer();
    }

    function startWorkout(){
		
    	app.state.workout_in_progress = true;
    	app.state.workout_start       = new Date().getTime();

    	if(app.app.workouts == undefined){
    		app.app.workouts = {};
    	}
    	app.state.current_workout = date;
    	app.app.workouts[date] = {
    		exercises : {

    		}
    	};

		//create appending string
    	var appendme = '';
    	$.each(JSON.parse(localStorage.getItem('exercises')), function(k,v){
    		$.each(v, function(k,v){
    			$.each(v, function(k,v){
    				for(var i = 0; i < v.length; i++){
    					
    					//each exercise
    					var obj = {
			    			name       : v[i],
			    			sets       : [{ weight : 80, reps : 10 , saved : false}]
			    		}

			    		appendme += templateExercise(obj);
						
    					app.app.workouts[date].exercises[obj.name] = {
    						sets : [
    							{
    								weight : 80,
    								reps   : 10,
    								saved  : false
    							}
    						],
    						performing : false
    					};

    				};
    			})
    			
    		})
    	});

    	//add slides
		addSlides(appendme, 0);
		//start timer
		updateTimer();

		//user feedback, anims
    	$('.card.first .initial').transition({
    		opacity : 0
    	},500, 'ease', function(){
    		$(this).css('visibility', 'hidden');
    		$('.card.first .inner').css('visibility','visible').transition({
    			opacity : 1
    		}, 350, 'ease', function(){
	    		
    		});
    	});


    	// save to localstorage
    	localStorage.setItem('app_stats', JSON.stringify(app));
    };


    function move(direction){
	    if(direction == 'up'){
	    	var cur    = currentIndex-1,
	    		isanim = true;
	    	if(currentIndex == 0 || currentIndex < 0){
				$('#vertical-slider').transition({
					'-webkit-transform' : 'translate3d(0,0px,0)'
				},speed,ease, function(){
					isanim = false;
					showIndicators();
				});
	    	}else{
	    		$('#vertical-slider').transition({
					'-webkit-transform' : 'translate3d(0,'+ (cur*-wheight) +'px,0)'
				},speed,ease, function(){
					isanim = false;
					showIndicators();
				});
	    	}
	    }
	    if(direction == 'down'){
	    	var cur    = currentIndex+1,
	    		isanim = true;
	    	if(currentIndex == 2 || currentIndex > 2 || currentIndex == 1){
				$('#vertical-slider').transition({
					'-webkit-transform' : 'translate3d(0,'+ (2*-wheight) +'px,0)'
				},speed,ease, function(){
					isanim = false;
					showIndicators();
				});
			}
			if(currentIndex == 0 || currentIndex < 0){
				$('#vertical-slider').transition({
					'-webkit-transform' : 'translate3d(0,'+ (1*-wheight) +'px,0)'
				},speed,ease, function(){
					isanim = false;
					showIndicators();	
				});
			}
	    }
	    if(direction == 'back'){
	    	isanim = true;    	
			$('#vertical-slider').transition({
			    '-webkit-transform' : 'translate3d(0,'+ currentIndex*-wheight +'px,0)'
			},speed,ease, function(){
			    isanim = false;
				showIndicators();
			});  
	    }

	    currentIndex = getCurrentScreen().index;

    }
    
	function updateSlider(slider, startslide){
			var options = {
					callback : function(e,i){
						updateIndicator(e,i);					
					}
				};
		if(startslide !== undefined){
			options.startSlide = startslide
		}
		if(window.mySwipe !== undefined){
			window.mySwipe.kill();
		}
		if($('.card').length == 1){
			$('#'+slider+' .swipe-wrap').css('width' , '100%');
		}else{
			window.mySwipe = new Swipe(document.getElementById(slider),options);
		}
		calcDimensions();
	}

	function addSlides(slides, startslide){
		$('#workouts-slider ul').append(slides);
		
		$('#indicators').transition({
			'-webkit-transform' : 'translate3d(0,50px,0)'
		},speed,ease, function(){
			popIndicators('workouts-slider');
			updateSlider('workouts-slider', startslide);
			updateIndicator(startslide,startslide);
			$('#indicators').transition({
				'-webkit-transform' : 'translate3d(0,-6px,0)'
			},speed,ease);
		});	
	
	}
	

	function popIndicators(slider){
		$('#indicators ul').empty();
		var h = '';
		$('#'+slider+ ' .card').each(function(k,v) {
		    $(this).find('.numba').text(k);
		    if( k == 0){
		    	h += '<li class="flag current" data-index="'+ k +'"><span class="entypo">⚑</span></li>';
		    }else{
			    h += '<li class="indicator" data-index="'+ k +'"></li>';
		    }
		});
		$('#indicators ul').append(h);
	};
	
	function getRandomInt(min,max){
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function updateMealsChart(i,e){
		var chart = $(e).find('.chart');

		$('.chart').transition({
			opacity : 0
		},150,'ease');

		$('#blue-btn').transition({
			opacity : 0
		},200,'ease', function(){
			$('#log-meal').text(logmealarr[getRandomInt(0, logmealarr.length)]);
		});

		//add current class
		$('#meals-slider li').removeClass('current');
		$('#meals-slider li[data-index="'+ i +'"]').addClass('current');

		window.setTimeout(function(){
			
			//enable chart
			chart.easyPieChart({
		    	barColor   : 'white',
		    	trackColor : 'rgba(255,255,255,0.1)',
		    	scaleColor : false,
		    	size       : 200
			});
			chart.transition({
				opacity : 1
			},400);

			window.setTimeout(function(){
				$('#blue-btn').transition({
					opacity : 1
				},400);
			},200)

		},500);

	}

	function endWorkout(){
		var appendme  = '<div id="workout-summary">';
				appendme += '<h1>Workout summary</h1>';
				appendme += '<p class="dur">Duration : '+ moment(moment(new Date())).diff(app.state.workout_start, 'minutes') +' min</p>';
				appendme += '<a href="#" id="close-sum">close</a>';
				appendme += '<div class="l-wrap">';
				appendme += '<ul class="list">';
					$.each(app.app.workouts[date].exercises, function(k,v){
						if(v.performing == true){
							appendme += '<li>';
								appendme += '<h2>'+ k +'</h2>';
								appendme += '<ul class="sub">';
									$.each(v.sets, function(k,v){
										appendme += '<li><p class="set">SET '+ Number(k+1) +'</p><p class="n">'+ v.weight +'kg * '+ v.reps +'</p></li>';
									});
								appendme += '</ul>';
							appendme +='</li>';
						}
					});
				appendme += '<li><p style="padding:10px 0; opacity:0;">good job</p></li>';
				appendme += '</ul>';

				appendme += '</div>';
			appendme += '</div>';

		$('#wrapper').append(appendme);
		$('.l-wrap').css({
			height : wheight-60
		});
		$('#workout-summary').transition({
			'-webkit-transform' : 'translateY(0%)'
		},350,'ease');
	}

	function updateIndicator(i,e){
		$('.indicator, .flag').removeClass('current');
		if(i == 0){
			$('.flag').addClass('current');
		}else{
			$('.indicator[data-index='+i+']').addClass('current');
		}
		app.state.slide = i;
		localStorage.setItem('app_stats', JSON.stringify(app));
	}
	
	function showIndicators(){
		if(getCurrentScreen().index == 0){
			$('#indicators').css('opacity' , 1);
		}else{
			$('#indicators').css('opacity' , 0);
		}

		if(getCurrentScreen().index == 3){
			app.state.section = 2;
		}else{
			app.state.section = getCurrentScreen().index;
		}

		localStorage.setItem('app_stats', JSON.stringify(app));
	}

	function logMeal(meal){

		//if first meal of day; i.e no day exists -> create
		if(app.app.meals[date] == undefined){
			app.app.meals[date] = {}
		}

		//if already eaten
		var eaten,
			goal  = Number(app.app.goals.meals[meal]);
	
		(app.app.meals[date][meal] == undefined) ? eaten = 0 : eaten = app.app.meals[date][meal];
		var numbertoadd = Number(eaten)+1;
		var percent = (numbertoadd/goal) * 100;

		//user feedback, anims
		$('li[data-meal="'+meal+'"] .chart').data('easyPieChart').update(percent);
		
		//save
		app.app.overview[date].last_meal       = meal;
		app.app.meals[date][meal]              = numbertoadd;
		localStorage.setItem('app_stats', JSON.stringify(app));

		renderCharts();
	
	}

	function renderMeals(){
		//pop other meals
		var mealsappend = '';
		$.each(app.app.goals.meals, function(k,v){
			var meal = k,
				goal = Number(v);

			if(app.app.meals[date] == undefined){
				mealsappend += templateMeal(meal,0);
			}else{
				var eaten;
				(app.app.meals[date][meal] == undefined) ? eaten = 0 : eaten = app.app.meals[date][meal];
				var percent = (eaten/goal) * 100;
				mealsappend += templateMeal(meal,percent);
			}
		});
		
		//append & calc
		$('#meals-slider .swipe-wrap').html(mealsappend);
		calcDimensions();

		var options = {
			callback : function(e,i){
				updateMealsChart(e,i);					
			}
		};
		
		//enable chart
		$('li[data-meal="Breakfast"]').addClass('current').find('.chart').easyPieChart({
	    	barColor   : 'white',
	    	trackColor : 'rgba(255,255,255,0.1)',
	    	scaleColor : false,
	    	size       : 200
		});
		$('li[data-meal="Breakfast"]').find('.chart').transition({
			opacity : 1
		},400);

		$('#blue-btn').css('display', 'block').transition({
			opacity : 1
		},400);

		window.mealsSwipe = new Swipe(document.getElementById('meals-slider'),options);
	}


	function calcDimensions(){
		//calc dimensions
		wwidth  = $(window).width(),
		wheight = $(window).height(),
		wrapper.css('height', wheight);
		$('.card').css({
			'height' : wheight,
			'width'  : wwidth
		});
		$('#meals-slider li').css({
			'height' : wheight-87,
			'width'  : wwidth
		});


		/*deck.css('width' , wwidth * card.length);*/	
	}
	
	//vid resize
	function resizeStuff() {
		calcDimensions();

		/*$('#vertical-slider').transition({
			'-webkit-transform' : 'translate3d(0,'+ (Math.floor(currentIndex)*-wheight) +'px,0)'
		},speed,ease, function(){
			isanim = false;
			showIndicators();
		});*/
	}
	
	var TO = false;
	$(window).resize(function(){
		calcDimensions();
		if(TO !== false)
		clearTimeout(TO);
		TO = setTimeout(resizeStuff, 200); //200 is time in miliseconds
	});

	function renderCharts(){
		//if any overview IS SAVED TODAY
		if(app.app.overview[date] == undefined){
			app.app.overview[date] = {};
		}

		//weight line chart
		//Get context with jQuery - using jQuery's .get() method.
		var ctx = $("#weight-chart").get(0).getContext("2d");
	
		var data = {
			labels : ["20120201","20120301","20120401","20120501","20120601"],
			datasets : [
				{
					fillColor : "#3e3e47",
					strokeColor : "#3e3e47",
					pointColor : "rgba(220,220,220,1)",
					pointStrokeColor : "",
					data : [79,80,82,83,85]
				}
			]
		},
		options = {
			scaleShowGridLines : false
		}

		var myNewChart = new Chart(ctx).Line(data, options);

		//last run -> SEPERATE checkNikePlus function

		//last workout:

		if(Object.keys(app.app.workouts).length > 0){
			var latestDate = Math.max.apply(this, Object.keys(app.app.workouts));
			var day        = moment(String(latestDate), "YYYYMMDD").day();
			$('#last-workout p').text(week[day]);
		}else{
			$('#last-workout p').text('Never');
		}

		//meals today:
		var meals_today = 0;
		for(meal in app.app.meals[date]){
			meals_today += app.app.meals[date][meal];
		}
		$('#meals-today p').text(meals_today);

		//last meal:
		var last_meal;
		(app.app.overview[date].last_meal == undefined) ? last_meal = 'None Today' : last_meal = app.app.overview[date].last_meal;
		$('#last-meal p').text(last_meal);
	}

	function checkNikePlus(){
		$('#last-run').removeClass('reload');
		if(app.app.overview[date].last_run == undefined){
			var opts = {
			  lines: 13, // The number of lines to draw
			  length: 0, // The length of each line
			  width: 4, // The line thickness
			  radius: 21, // The radius of the inner circle
			  corners: 1, // Corner roundness (0..1)
			  rotate: 0, // The rotation offset
			  color: '#fff', // #rgb or #rrggbb
			  speed: 1.5, // Rounds per second
			  trail: 36, // Afterglow percentage
			  shadow: false, // Whether to render a shadow
			  hwaccel: false, // Whether to use hardware acceleration
			  className: 'spinner', // The CSS class to assign to the spinner
			  zIndex: 2e9, // The z-index (defaults to 2000000000)
			  top: 'center', // Top position relative to parent in px
			  left: 'center' // Left position relative to parent in px
			};

			var target = document.getElementById('#last-run');
			var spinner = new Spinner(opts).spin(target);
			$('#last-run').append(spinner.el);
			$.ajax({
				url     : 'api/api.php?type=mostrecent',
				timeout : 10000,
				success: function(d) {
					var o = JSON.parse(d);
					var day = moment(o.activity.startTimeUtc).day();
					
					$('.spinner').transition({
						opacity : 0
					},200,'ease', function(){
						
						$('#last-run p').text(week[day]).transition({
							opacity : 1
						},300,'ease');
					
					});

					//save
					app.app.overview[date].last_run = week[day];
					localStorage.setItem('app_stats', JSON.stringify(app));
				},
				error: function(d,xhr,status) {
					if(status == 'timeout'){
						$('.spinner').transition({
							opacity : 0
						},200,'ease', function(){

							$('#reload-nike').transition({
								opacity : 1
							},300,'ease');

							$('#last-run').addClass('reload');
						});
					}
				},
			});
		}else{
			$('#last-run p').text(app.app.overview[date].last_run).transition({
				opacity : 1
			},300,'ease');
		}
	}
			
	function init(){
		calcDimensions();
		if(localStorage.getItem('app_stats') == undefined){
			//if first time
			localStorage.setItem('exercises', JSON.stringify(base_exercises));
			localStorage.setItem('app_stats', JSON.stringify(app));
			console.log('Tomt!');
			$('#vertical-slider').css('-webkit-transform', 'translate3d(0,'+-wheight+'px,0)');
			
		}else{
			//sync localStorage with local app
			app = JSON.parse(localStorage.getItem('app_stats'));

			//if workout is in progress
			if(app.state.workout_in_progress == true){
				console.log("workout in progress");
				
				$('#vertical-slider').css('-webkit-transform', 'translate3d(0,0px,0)');
				resumeWorkout();
			}else{
				console.log("no workout in progress, clean start");
				var height = wheight * app.state.section;
				$('#vertical-slider').css('-webkit-transform', 'translate3d(0,'+-height+'px,0)');
			}

		}
		currentIndex = getCurrentScreen().index;
		//init meals slider
		renderMeals();
		renderCharts();
		checkNikePlus();
		/*readDeviceOrientation();
		window.onorientationchange = readDeviceOrientation;
		*/

    	if(app.app.workouts[date] !== undefined && app.state.workout_in_progress == false){
    		$('.card.first .performed').show();
    		$('.card.first #perform-workout').hide();
    	}

    	//if screen is workout
    	showIndicators();
    	
		$('#wrapper').transition({
			opacity: 1
		},700,'ease-out');

		console.log(app);
	}
	
	//init
	init();
	

	$('body').on('touchmove', function(e){
	    e.preventDefault();
	    return false;
	});
					
	//scroll logic	
	$('.first').on('touchstart', function(e){
		e.preventDefault();
		if(isanim == false){
			pageY    = e.originalEvent.touches[0].pageY,
			pageX    = e.originalEvent.touches[0].pageX;
			deltaX   = 0;
			deltaY   = 0;
			currentY = parseInt(getCurrentScreen().transform[5]);
			poop     = getCurrentScreen().index;
			currentIndex = Math.round(poop);
			
			 // used for testing first onTouchMove event
			 isScrolling = undefined;
		}else{
			return false;
		}
	}).on('touchmove', function(e){
		//e.preventDefault();
		if(isanim == false){
			deltaY = e.originalEvent.touches[0].pageY - pageY;
			deltaX = e.originalEvent.touches[0].pageX - pageX;
			// determine if scrolling test has run - one time test
		    if (isScrolling == undefined) {
		      isScrolling = !!( isScrolling || Math.abs(deltaY) < Math.abs(e.originalEvent.touches[0].pageX - pageX) );
		    }
		    
		    if (!isScrolling) {
			    e.preventDefault();
			    if(currentIndex == 0 && deltaY > 0){
			    	deltaY = deltaY / (Math.abs(deltaY) / wheight + 2 );
			    }
			    if(currentIndex == 2 && deltaY < 0){
			    	deltaY = deltaY / (Math.abs(deltaY) / wheight + 2 );
			    }
			    var dist = currentY+deltaY;
			    $('#vertical-slider').css('-webkit-transform', 'translate3d(0,'+ dist +'px,0)');
			    //$('#indicators').css('opacity', 0.4);
		    }
		}
	}).on('touchend', function(e){
		e.preventDefault();
		if(deltaY > wheight/2 || deltaY > 100){
		    move('up');
		}else if(deltaY < -wheight/2 || deltaY < -100){
		    move('down');
		}else{
			if( deltaY > 1 || deltaY < -1){
			    move('back');
			}
		}
		
	});
	
	//add-subtract input
	var timer  = Timer('100ms'),
		ticked = false;
	$('.swipe-wrap').on('touchstart', '.inner-w a', function(e){
		e.preventDefault();
		$(this).addClass('down');

		var input = $(this).parent().find('.number'),
		   _this  = $(this);
		
		input.blur();
		timer.start();
		timer.every('100ms', function(e){
			if(e.ticks > 5 && e.ticks < 20){
				ticked = true;
				
				var val = input.val();
				if(_this.hasClass('sub')){
					if(val > 0){
				    	input.val(Number(val)-1);
				    }
				}else{
					input.val(Number(val)+1);
				}
				
			}
			if(e.ticks > 20){
				var val = input.val();
				
				if(_this.hasClass('sub')){
					if(val > 0 && val > 4){
				    	input.val(Number(val)-5);
				    }
				}else{
					input.val(Number(val)+5);
				}
			}
		});
	})
	.on('touchmove', '.inner-w a', function(e){
		mx = e.originalEvent.touches[0].pageX - x;
		my = e.originalEvent.touches[0].pageX - y;
		timer.stop();
		$(this).removeClass('down');
	})
	.on('touchend', '.inner-w a', function(e){
		e.preventDefault();
		$(this).removeClass('down');
		if((my == 0 && mx == 0)){
			var input = $(this).parent().find('.number'),
				_this = $(this);
				
			timer.stop();
			timer.reset();
			timer.clear();
			var val = input.val();
			if(ticked == false){
				if(_this.hasClass('sub')){
					if(val > 0){
				    	input.val(Number(val)-1);
				    }
				}else{
					if(Number(val) < 999){
				    	input.val(Number(val)+1);
					}
				}
			}
			ticked = false;

			//save value
			
			/*
			var exercise = $(this).parent().parent().parent().parent().parent().data('exercise');
			var type     = $(this).parent().parent().find('h2').text();
			var set      = $(this).parent().parent().parent().parent().parent().find('.sets-tab').find('.current').data('set');
			
			$(this).parent().parent().parent().parent().parent().find('.sets-tab').find('.current').find('.numbers .weight').text(weight)
			console.log("current exercise : " + exercise);
			console.log("current type of value : " + type);
			console.log("current set : " + set);
			*/

		}
		mx = 0,
		my = 0,
		x  = 0,
		y  = 0;
	});


	/*modal*/
	$('#wrapper').on('touchstart', '#modal a', function(e){
		e.preventDefault();
		$(this).addClass('down');
		mx = 0,
		my = 0,
		x  = 0,
		y  = 0;
	})
	.on('touchmove', '#modal a', function(e){
		mx = e.originalEvent.touches[0].pageX - x;
		my = e.originalEvent.touches[0].pageX - y;
		$(this).removeClass('down');
	})
	.on('touchend', '#modal a', function(e){
		$(this).removeClass('down');
		if((my == 0 && mx == 0)){
			switch($(this).data('action')){
				case 'modal-no':
					$('#dimmer').transition({
						opacity : 0,
					},100,'ease', function(){
						$(this).remove();
					});
					$('#modal').transition({
						'-webkit-transform' : 'translateY(-340px)',
					},300,'ease', function(){
						$(this).remove();
					});
				break;
				case 'modal-yes': 
					
					switch($(this).parent().data('action')){
						
						case 'perform-workout':
							$('#dimmer').transition({
								opacity : 0,
							},100,'ease', function(){
								$(this).remove();
							});
							$('#modal').transition({
								'-webkit-transform' : 'translateY(400px)',
							},300,'ease', function(){
								$(this).remove();
							});
							startWorkout();
						break;
					
					};			
				
				break;
			}
		}
		mx = 0,
		my = 0,
		x  = 0,
		y  = 0;
	});



	//perform workout
	$('#perform-workout').on('touchstart',function(e){
		e.preventDefault();
		$(this).addClass('down');
		mx = 0,
		my = 0,
		x  = 0,
		y  = 0;
	})
	.on('touchmove', function(e){
		mx = e.originalEvent.touches[0].pageX - x;
		my = e.originalEvent.touches[0].pageX - y;
		$(this).removeClass('down');
	})
	.on('touchend', function(e){
		e.preventDefault();
		$(this).removeClass('down');
		if((my == 0 && mx == 0)){
			showModal('perform-workout');
		}
		mx = 0,
		my = 0,
		x  = 0,
		y  = 0;
	});

	//perform-exercise / end workout
	$('.swipe-wrap').on('touchstart', '.button' ,function(e){
		e.preventDefault();
		$(this).addClass('down');		
		mx = 0,
		my = 0,
		x  = 0,
		y  = 0;

	})
	.on('touchmove', '.button' , function(e){
		mx = e.originalEvent.touches[0].pageX - x;
		my = e.originalEvent.touches[0].pageX - y;
		$(this).removeClass('down');
	})
	.on('touchend', '.button',  function(e){
		$(this).removeClass('down');
		if((my == 0 && mx == 0)){
			switch($(this).data('action')){
				
				case 'end-workout':
					console.log('end-w');
					//test purposes
					app.state.workout_in_progress = false;
					localStorage.setItem('app_stats', JSON.stringify(app));
					endWorkout();
				break;

				case 'perform-exercise':
					setExerciseAsPerforming($(this).parent().parent().data('exercise'));
				break;


				case 'add-set':
					console.log('add set');

					console.log($(this).parent().parent());
					var exercise         = $(this).parent().parent().parent().parent().parent().data('exercise');
					var thisset          = $(this).parent().parent().parent().parent().parent().find('.set-container.current');
					var performcontainer = $(this).parent().parent().parent().parent().parent().find('.perform-tab');
					var setscontainer    = $(this).parent().parent().parent().parent().parent().find('.sets-tab ul');
					var weight           = $(this).parent().parent().find('.add-w .number').val();
					var reps             = $(this).parent().parent().find('.add-r .number').val();
					var currentset       = Number($(this).parent().parent().data('set'));
					var newset           = Number($(this).parent().parent().data('set'))+1;
					
					var currSet = {
						weight : weight,
						reps   : reps
					}

					thisset.css({
						visibility : 'hidden',
						opacity    : 0
					}).removeClass('current');

					console.log(weight);
					console.log(reps);
					
					console.log(setscontainer.find('li.current'));
					setscontainer.find('li.current .numbers .weight').text(weight);
					setscontainer.find('li.current .numbers .reps').text(reps);
					setscontainer.find('li.current').removeClass('current');

					performcontainer.append(templatePerformSet(newset, currSet));
					setscontainer.append(templateListSet(newset));
				break;

			}
		}
		mx = 0,
		my = 0,
		x  = 0,
		y  = 0;
	});

	//toggle set/perform view
	$('.swipe-wrap').on('touchstart', '.toggler a' ,function(e){
		e.preventDefault();
		
		if(!$(this).hasClass('selected')){
			$(this).addClass('down');
			mx = 0,
			my = 0,
			x  = 0,
			y  = 0;
		}else{
			return false;
		}
	})
	.on('touchmove', '.toggler a' , function(e){
		mx = e.originalEvent.touches[0].pageX - x;
		my = e.originalEvent.touches[0].pageX - y;
		$(this).removeClass('down');
	})
	.on('touchend', '.toggler a',  function(e){
		$(this).removeClass('down');
		if((my == 0 && mx == 0)){
			if(!$(this).hasClass('selected')){
				$(this).parent().parent().parent().find('.toggler a').removeClass('selected');
				$(this).addClass('selected');
				switch($(this).hasClass('perform')){
					case true:
						// clicking perform
						$(this).parent().parent().parent().find('.perform-tab').css('visibility', 'visible');
						$(this).parent().parent().parent().find('.sets-tab').css('visibility', 'hidden');

					break;
					case false:
						// clicking sets
						$(this).parent().parent().parent().find('.sets-tab').css('visibility', 'visible');
						
						$(this).parent().parent().parent().find('.perform-tab').css('visibility', 'hidden');
					break;
				}

			}else{
				return false;
			}
		}
		mx = 0,
		my = 0,
		x  = 0,
		y  = 0;
	});


	//save set
	$('.swipe-wrap').on('touchstart', '.btns a' ,function(e){
		e.preventDefault();
		
		$(this).addClass('down');
		mx = 0,
		my = 0,
		x  = 0,
		y  = 0;
	})
	.on('touchmove', '.btns a' , function(e){
		mx = e.originalEvent.touches[0].pageX - x;
		my = e.originalEvent.touches[0].pageX - y;
		$(this).removeClass('down');
	})
	.on('touchend', '.btns a' ,  function(e){
		$(this).removeClass('down');
		if((my == 0 && mx == 0)){	
			switch($(this).hasClass('save-set')){
				case true:
					// save set
					console.log('save set');
					//save value
					
					console.log($(this).parent().parent().parent());
					var exercise = $(this).parent().parent().parent().parent().parent().parent().data('exercise');
					var weight   = $(this).parent().parent().parent().find('.add-w .number').val();
					var reps     = $(this).parent().parent().parent().find('.add-r .number').val();
					var set      = $(this).parent().parent().parent().parent().parent().parent().find('.sets-tab').find('.current').data('set');
					
					var index = set-1;
					
					app.app.workouts[app.state.current_workout].exercises[exercise].sets[index] = { 
						weight : Number(weight), 
						reps   : Number(reps),
						saved  : true
					};

					//save to localStorage
					localStorage.setItem('app_stats', JSON.stringify(app));

					//user feedback anims
					$('.card.exercise[data-exercise="'+exercise+'"] .saved').css('visibility', 'visible').transition({
						opacity : 1
					},300,'ease', function(){
						$('.card.exercise[data-exercise="'+exercise+'"] .set-container[data-set="'+set+'"]').attr('data-saved', 'true');
					});
									
				break;
			}
		}
		mx = 0,
		my = 0,
		x  = 0,
		y  = 0;
	});


	//log meal
		/*modal*/
	$('#log-meal').on('touchstart', function(e){
		e.preventDefault();
		$(this).addClass('down');
		mx = 0,
		my = 0,
		x  = 0,
		y  = 0;
	})
	.on('touchmove', function(e){
		mx = e.originalEvent.touches[0].pageX - x;
		my = e.originalEvent.touches[0].pageX - y;
		$(this).removeClass('down');
	})
	.on('touchend', function(e){
		$(this).removeClass('down');
		if((my == 0 && mx == 0)){
			var meal = $('#meals-slider li.current').data('meal');
			logMeal(meal);
		}
		mx = 0,
		my = 0,
		x  = 0,
		y  = 0;
	});

	/*EDIT WEIGHT*/
	$('#edit-weight').on('touchstart', function(e){
		e.preventDefault();
		$(this).addClass('down');
		mx = 0,
		my = 0,
		x  = 0,
		y  = 0;
	})
	.on('touchmove', function(e){
		mx = e.originalEvent.touches[0].pageX - x;
		my = e.originalEvent.touches[0].pageX - y;
		$(this).removeClass('down');
	})
	.on('touchend', function(e){
		$(this).removeClass('down');
		if((my == 0 && mx == 0)){
			$('#dimmer').css('display', 'block').transition({
				opacity : 1
			},200,'ease');
			$('#change-weight').transition({
				'-webkit-transform' : 'translateY(0)'
			},200,'ease');
		}
		mx = 0,
		my = 0,
		x  = 0,
		y  = 0;
		
	});

	/*reload nike sync*/
	$('#last-run').on('touchstart', function(e){
		e.preventDefault();
		$(this).addClass('down');
		mx = 0,
		my = 0,
		x  = 0,
		y  = 0;	
	})
	.on('touchmove', function(e){
		mx = e.originalEvent.touches[0].pageX - x;
		my = e.originalEvent.touches[0].pageX - y;
		$(this).removeClass('down');
	})
	.on('touchend', function(e){ 
		$(this).removeClass('down');
		if((my == 0 && mx == 0)){
			if($(this).hasClass('reload')){
				console.log("reload nikeplus");
				$('#reload-nike').transition({
					opacity : 0
				},200,'ease', function(){
					checkNikePlus();
				});
			}
		}
		mx = 0,
		my = 0,
		x  = 0,
		y  = 0;	
	});

	/*close summary*/
	$('#wrapper').on('touchstart', '#close-sum', function(e){
		e.preventDefault();
		$(this).addClass('down')
		mx = 0,
		my = 0,
		x  = 0,
		y  = 0;	
	})
	.on('touchmove', '#close-sum', function(e){
		mx = e.originalEvent.touches[0].pageX - x;
		my = e.originalEvent.touches[0].pageX - y;
		$(this).removeClass('down');
	})
	.on('touchend', '#close-sum', function(e){
		$(this).removeClass('down');
		if((my == 0 && mx == 0)){
			location.reload();
		}
		mx = 0,
		my = 0,
		x  = 0,
		y  = 0;	
	});
	
	

});