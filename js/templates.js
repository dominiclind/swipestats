function templateExercise(obj){
	
	var template_exercise = '<li class="card exercise" data-exercise="'+ obj.name +'" data-performing="'+ obj.performing +'">';
		template_exercise +=		'<div class="perform-q">';
		template_exercise +=		    '<h1>'+ obj.name +'</h1>';
		template_exercise +=		    '<a href="#" class="button" data-action="perform-exercise">perform</a>';
		template_exercise +=		'</div>'
		template_exercise += '<div class="inner">';
		template_exercise		+=	'<h1>'+ obj.name +'</h1>';
		template_exercise		+=	'<div class="toggler">'
		template_exercise			+=	'<a href="#" class="entypo perform selected" data-action="toggle-tab">📋</a>';
		template_exercise			+=	'<a href="#" class="entypo sets" data-action="toggle-tab">☰</a>';
		template_exercise			+=	'<div class="cBoth"></div>';
		template_exercise		+= '</div>';
		template_exercise		+=	'<div class="perform-tab">';
		
		$.each(obj.sets, function(k,v){
			var setnr = k + 1;
			var classes = 'set-container';
			if(setnr == obj.sets.length){
				classes += ' current';
			}

			template_exercise       +=  '<div class="'+classes+'" data-saved="'+v.saved+'" data-set="'+setnr+'">';
				template_exercise		+=	'<div class="saved">';
				template_exercise				+=  '<h1>SAVED</h1>';
				template_exercise				+=	'<a href="#" class="button add-set" data-action="add-set">Add Set</a>';
				template_exercise       +=  '</div>';
				template_exercise           +=  '<div class="fade">';
					template_exercise			+=	'<div class="add-w input-w">';
					template_exercise				+=	'<h2>weight</h2>';
					template_exercise				+=	'<div class="inner-w">';
					template_exercise					+=	'<a href="#" class="entypo sub">➖</a>';
					template_exercise					+=	'<a href="#" class="entypo add">➕</a>';
					template_exercise					+=	'<input type="tel" class="number" maxlength="3" value="'+v.weight+'"/>';
					template_exercise					+=	'<div class="cBoth"></div>';
					template_exercise				+=	'</div>';
					template_exercise			+=	'</div>';
					template_exercise			+=	'<div class="add-r input-w">';
					template_exercise				+=	'<h2>reps</h2>';
					template_exercise				+=	'<div class="inner-w">';
					template_exercise					+=	'<a href="#" class="entypo sub">➖</a>';
					template_exercise					+=	'<a href="#" class="entypo add">➕</a>';
					template_exercise					+=	'<input type="tel" class="number" maxlength="3" value="'+v.reps+'"/>';
					template_exercise					+=	'<div class="cBoth"></div>';
					template_exercise				+=	'</div>';
					template_exercise			+=	'</div>';
					template_exercise			+=	'<div class="btns">';
					template_exercise				+=	'<a href="#" class="save-set"><span class="text">Save Set</span></a>';
					template_exercise			+=	'</div>';
				template_exercise       	+=  '</div>';
			template_exercise       	+=  '</div>';

		});
		template_exercise		+=	'</div>';
		//sets
		template_exercise       += '<div class="sets-tab">';
			template_exercise += '<ul>';
			$.each(obj.sets, function(k,v){
				var setnr = k + 1;
				if(setnr == obj.sets.length){
					template_exercise += '<li class="current" data-set="'+ setnr +'">Set '+ setnr +'<span class="c">CURRENT</span><span class="numbers"><span class="weight">'+ v.weight +'</span>kg * <span class="reps">'+ v.reps +'</span></span></li>';
				}else{
					template_exercise += '<li data-set="'+ setnr +'">Set '+ setnr +'<span class="numbers"><span class="weight">'+ v.weight +'</span>kg * <span class="reps">'+ v.reps +'</span></span></li>';
				}
			});
			template_exercise += '</ul>';
		template_exercise       += '</div>';
		//sets
		template_exercise		+=	'</div>';
		template_exercise	+=	'</li>';

		return template_exercise;
}

function templatePerformSet(set,obj){
	var template_exercise       =  '<div class="set-container current" data-saved="false" data-set="'+set+'">';
			template_exercise		+=	'<div class="saved">';
			template_exercise				+=  '<h1>SAVED</h1>';
			template_exercise				+=	'<a href="#" class="button add-set" data-action="add-set">Add Set</a>';
			template_exercise       +=  '</div>';
			template_exercise           +=  '<div class="fade">';
				template_exercise			+=	'<div class="add-w input-w">';
				template_exercise				+=	'<h2>weight</h2>';
				template_exercise				+=	'<div class="inner-w">';
				template_exercise					+=	'<a href="#" class="entypo sub">➖</a>';
				template_exercise					+=	'<a href="#" class="entypo add">➕</a>';
				template_exercise					+=	'<input type="tel" class="number" maxlength="3" value="'+ obj.weight +'"/>';
				template_exercise					+=	'<div class="cBoth"></div>';
				template_exercise				+=	'</div>';
				template_exercise			+=	'</div>';
				template_exercise			+=	'<div class="add-r input-w">';
				template_exercise				+=	'<h2>reps</h2>';
				template_exercise				+=	'<div class="inner-w">';
				template_exercise					+=	'<a href="#" class="entypo sub">➖</a>';
				template_exercise					+=	'<a href="#" class="entypo add">➕</a>';
				template_exercise					+=	'<input type="tel" class="number" maxlength="3" value="'+ obj.reps +'"/>';
				template_exercise					+=	'<div class="cBoth"></div>';
				template_exercise				+=	'</div>';
				template_exercise			+=	'</div>';
				template_exercise			+=	'<div class="btns">';
				template_exercise				+=	'<a href="#" class="save-set"><span class="text">Save Set</span></a>';
				template_exercise			+=	'</div>';
			template_exercise       	+=  '</div>';
		template_exercise       	+=  '</div>';

	return template_exercise;
}

function templateListSet(set){
	var template = '<li class="current" data-set="'+ set +'">Set '+ set +'<span class="c">CURRENT</span><span class="numbers"><span class="weight">0</span>kg * <span class="reps">0</span></span></li>';
	return template;
}

function templateMeal(meal,percent){
	var template  = '<li class="first" data-meal="'+ meal +'">'
			template +=	'<div class="parappa">'
				template +=	'<a href="#">'+ meal +'</a>'
				template +=	'<div class="chart" data-percent="'+ percent +'"></div>'
			template +=	'</div>'
		template +=	 '</li>'
	return template;
}

function templateSummary(){
	var template = '<div id="workout-summary"><ul class="list"></ul></div>';
	return template;
}

var template_modal  = '<div id="dimmer"></div><div id="modal">';
	template_modal += '<h1></h1>';
	template_modal += '<a href="#" data-action="modal-yes">yes</a>';
	template_modal += '<a href="#" data-action="modal-no">no</a>';
	template_modal += '</div>';


