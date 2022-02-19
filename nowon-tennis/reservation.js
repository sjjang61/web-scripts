// 최초페이지 이동
// https://reservation.nowonsc.kr/sports/courtReserve_date?cate1=1&cate2=16

// 예약정보 입력 (날짜만 바꿔주시면 됩니다.)
var params = {
	dateList : [ '2022-03-24' ], 
	timeList : [ 10, 11 ],
	courtList : [ 7, 8 ],	
};

// 메뉴 구성
$("body").append("<div id='popup' style='position:absolute; left : 1100px; top : 50px ; width : 200px; height : 200px ; background-color:orange'><div style='position:relative; top:100px'>예약날짜<input type='text' id='reserve_date' value='2022-03-24'/><input type='button' id='reservation' value='예약실행' style='margin: 5px 70px 5px 70px;'/></div></div>");

// event handler 설정
$(document).on( "click", "#reservation", function(){
	// 1. 다음달로 변경
	$("div.clndr-control-button.rightalign span").trigger("click");
	setTimeout( auto_reservation, 500 );
});

// 예약 실행 로직
function auto_reservation(){
			
	var date = $("#reserve_date").val();
		
	// 1. 날짜선택 (여러날짜 중복 불가)
	$(`#reserve_${date} span`).trigger("click");
	
	setTimeout( function(){					
		for( var j  = 0 ; j < params.timeList.length ; j++ ){
			// 2. 시간선택
			var timeNum = params.timeList[j];		
			
			for( var k  = 0 ; k < params.courtList.length ; k++ ){
				// 3. 코트선택
				var courtNum = params.courtList[k];		
				
				var timeRowIndex = timeNum - 6 + 2;
				var courtColIndex = (courtNum - 1 ) * 2;
				var courtNextColIndex = courtColIndex + 1;
				
				var isFinish = $("div.table_wrap table").find(`tr:eq(${timeRowIndex})`).find(`td:eq(${courtNextColIndex}) span`).hasClass("finish");
				if ( isFinish ){
					var finishTime = $("div.table_wrap table").find(`tr:eq(${timeRowIndex})`).find(`td:eq(${courtNextColIndex}) span`).text();
					alert("예약 완료된 시간이 존재합니다." + finishTime);
				}
				else{
					$("div.table_wrap table").find(`tr:eq(${timeRowIndex})`).find(`td:eq(${courtColIndex}) input`).trigger("click");
				}
				
				
				// 4. 종료체크
				if ( j == params.timeList.length -1 &&  k == params.courtList.length - 1 ){
					// 5. 예약버튼
					$("#reserved_submit").trigger("click");
				}
			}
		}	
	}, 500 );	
}
