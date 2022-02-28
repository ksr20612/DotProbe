var counter =0;
var proCount =0;
window.addEventListener('wheel',function(event){
  if (event.deltaY < 0) {

		counter += 60;
		proCount += 1;
		//console.log(counter2)
		$(".turn_table").css({"transform":"rotate("+counter+"deg"});
		$(".card").removeClass('active');
		if(proCount > 5){proCount = 0}
		$(".card").eq(proCount).addClass('active');
		
	}else if (event.deltaY > 0) {	

		counter -= 60;
		proCount -= 1;
		//console.log(counter2)
		$(".turn_table").css({"transform":"rotate("+counter+"deg"});
		$(".card").removeClass('active');
		if(proCount < -5 ){proCount = 0}
		$(".card").eq(proCount).addClass('active');

	}
})