// 최초페이지 이동
// https://reservation.nowonsc.kr/leisure/camping_date?cate1=2#

var params = {
	dowList : [],
	dateList : [],
	duration : 1, 		 // 숙박일 : 1박 2일
	site : 'village04', // 시설 : 캐빈 캠핑 빌리지,

	map_info : {
		'village01' : { "type" : "vil_p", "list" : [] },  // 'chk_39'
		'village02' : { "type" : "vil_t", "list" : [] },
		'village03' : { "type" : "vil_h", "list" : [] },
		'village04' : { "type" : "vil_c", "list" : [] } //'chk_91', 'chk_92', 'chk_93'
	}
};

// 메뉴 구성
var ui_html = "";
ui_html += "<div id='popup' style='position:absolute; left : 1100px; top : 50px ; width : 250px; height : 360px ; padding : 0 10px 0 10px; background-color:orange'>";
ui_html += "	<div style='position:relative; top:100px'>";
ui_html += "		1) 예약날짜 <font size='2'>(날짜입력 우선)</font><p>";
ui_html += "		<input type='text' id='reserve_date' value='2023-10-04,2023-10-05'/>";
ui_html += "		2) 예약요일 <font size='2'>(날짜입력 없을때만 활성화)</font><p>";
ui_html += "		<input type='checkbox' name='dow' id='reserve_dow_sun' value='0' style='width:15px;height:25px' checked><label for='reserve_dow_sun'>일</label>";
ui_html += "		<input type='checkbox' name='dow' id='reserve_dow_mon' value='1' style='width:15px;height:25px'><label for='reserve_dow_mon'>월</label>";
ui_html += "		<input type='checkbox' name='dow' id='reserve_dow_tue' value='2' style='width:15px;height:25px'><label for='reserve_dow_tue'>화</label>";
ui_html += "		<input type='checkbox' name='dow' id='reserve_dow_wed' value='3' style='width:15px;height:25px'><label for='reserve_dow_wed'>수</label>";
ui_html += "		<input type='checkbox' name='dow' id='reserve_dow_thu' value='4' style='width:15px;height:25px'><label for='reserve_dow_thu'>목</label>";
ui_html += "		<input type='checkbox' name='dow' id='reserve_dow_fir' value='5' style='width:15px;height:25px'><label for='reserve_dow_fri'>금</label>";
ui_html += "		<input type='checkbox' name='dow' id='reserve_dow_sat' value='6' style='width:15px;height:25px' checked><label for='reserve_dow_sat'>토</label>";
ui_html += "		<p>3) 장소 <p>";
ui_html += "		<select id='reserve_site'>";
ui_html += "			<option value='village04'>캐빈캠핑빌리지</option>";
ui_html += "			<option value='village01'>파크캠핑</option>";
ui_html += "			<option value='village02'>테라스캠핌</option>";
ui_html += "			<option value='village03'>힐링캠핑</option>";
ui_html += "		</select>"
ui_html += "		<select id='reserve_dur'>";
ui_html += "			<option value='1'>1박2일</option>";
ui_html += "			<option value='2'>2박3일</option>";
ui_html += "		</select>"
ui_html += "		<input type='button' id='reservation' value='예약실행' style='margin: 10px 70px 5px 90px;'/>";
ui_html += "	</div>";
ui_html += "</div>";
$("body").append( ui_html );


// event handler 설정
$(document).on( "click", "#reservation", function(){

	init_params();
	var now_date = new Date();
	var cal = $("div.month").data()

	// 현재 캘린더가 다음달의 캘린더일 경우
	if ( cal['nowyear'] == now_date.getFullYear() && cal['nowmonth'] == now_date.getMonth() + 2 ){
		// skip
	}
	else{
		// 2. 다음달로 변경
		$("div.clndr-control-button.rightalign span").trigger("click");
	}

    reserve_waiting_list = [];
	setTimeout( auto_reservation, 500, 0, params.dateList.length );
});

/**
 * UI 입력파라미터 초기화
 */
function init_params(){

	params.dateList = get_date_list();
	params.site = $("#reserve_site").val();
	params.duration = $("#reserve_dur").val();
	console.log( "date_list = ", params.dateList );


	// 지도속의 아이콘 리스트 초기화 (id)
	var map_list = $("div.village_bg ul li label");
	for ( var i = 0 ; i < map_list.length; i++ ){
		var el = $( map_list[i] );
		var ele_id = el.attr( "for" );
		var site_type = el.data( "set" );
		//console.log( ele_id, site_type );

		for ( key in params.map_info ){
			if ( site_type == params.map_info[key].type  ){
				params.map_info[key].list.push( ele_id );
			}
		}
	}
	console.log( params );
}

/**
 * 후보군 날짜 조회
 * @returns
 */
function get_date_list(){

	// 날짜 선택
	var input_date = $("#reserve_date").val();
	var date_list = [];

	if ( input_date.trim().length > 0 ) {
		// 날짜 선택 모드
		date_list = input_date.split(",");
		return date_list;
	}

	// 요일 선택 모드 (다음달의 날짜를 자동으로 선택)
	return get_dow_date_list();
}

/**
 * 요일모드를 지정했을 경우(날짜입력 빈값) 후보군 날짜 조회
 * @param {*} dow_list
 * @returns
 */
function get_dow_date_list( dow_list ){

	var date_list = [];
	var input_dow_list = [];
	$('input:checkbox[name=dow]').each(function() {
        if($(this).is(":checked")==true){
            input_dow_list.push( Number( $(this).val()) );
        }
    });

	// 기준일 : 다음달의 1일
	var basis_date = new Date();
	basis_date.setDate(1);
	basis_date.setMonth( basis_date.getMonth() + 1 );
	var basis_month = ( basis_date.getMonth() );

	// 조건에 맞는 날짜 계산
	for ( var i = 0 ; i < 32 ; i++ ){
		basis_date.setDate(1+i);
		if ( basis_month == basis_date.getMonth()){
			var dow = basis_date.getDay();
			if ( input_dow_list.includes( dow )){
				date_list.push( basis_date.toISOString().substring( 0, 10) );
			}
			//console.log( "date = " + basis_date + ", dow = " + dow );
		}

		//else{
		//	console.log( "[SKIP]date = " + basis_date + ", dow = " + basis_date.getDay() );
		//}
	}

	return date_list;
}

// 전역변수 선언
var reserve_waiting_list = [];

/**
 * 예약 실행 로직 (날짜를 for 문으로 돌수없음, 비동기로 실행되기에 한날짜가 종료된 이후에, 다음 날짜 체크 필요함)
 * @param {*} idx : dateList 후보군의 index
 * @param {*} last_idx : dateList 후보군의 마지막 index
 */
function auto_reservation( idx, last_idx ){

	var dateList = params.dateList;
	var reserve_site = params.site;
	var reserve_dur = params.duration;

	var elTdList = $("table.clndr-table tbody tr td");
    var date = dateList[idx];

    // 1. 날짜선택 (여러날짜 중복 불가)
    for ( var j = 0 ; j < elTdList.length ; j++ ){
        var el = $(elTdList[j]);
        if ( el.data("day") == date ){
            el.trigger("click");

            // 숙박일 : 1박2일(1), 2박3일(2) 선택
            $("#srch_sel").val( reserve_dur ).trigger("click");;

            // 시설선택 : 파크캠핑(village01), 테라스캠핌(village02), 힐링캠핑(village03), 캐빈캠핑(village04)
            //$("#" + reserve_site).prop('checked', true);
            $("#" + reserve_site).trigger("click");
            break;
        }
    }

    setTimeout( function(){

        // 지도에서 케빈캠핑빌리지 선택 화면
        var map_id_list = params.map_info[reserve_site ].list;
        var waiting_list = [];

        for ( var k = 0 ; k < map_id_list.length ; k++ ){
            var map_id = map_id_list[k];
            var elMapLoc = $("#" + map_id );

            // 예약마감 안된 항목 탐색
            if ( elMapLoc.attr("disabled") != "disabled" ){
                //console.log("FIND!!! date = " + date  + ", idx = " + k );
                waiting_list.push( { 'date' : date, 'map_id' : map_id} );

                // 동일 날짜에서는 한개만 탐색
                break;
            }
        }

        // 최종 예약 요청 (첫번째값)
        console.log("예약가능 확인, 날짜 = " + date + ", 가능여부 건수 = " + waiting_list.length );
        reserve_waiting_list += waiting_list;

        // 예약 가능한 자리가 한개라도 존재할 경우 예약요청
        if ( waiting_list.length > 0 ){
            $( "#"+waiting_list[0].map_id ).trigger("click");
            setTimeout( function(){
                $("#reserved_submit").trigger("click");
            }, 400 );
        }
        else{

            if ( idx+1 < last_idx ){
                auto_reservation( idx+1, last_idx );
            }
        }

        /*
        if ( reserve_waiting_list.length > 0  ){
            $( "#"+reserve_waiting_list[0].map_id ).trigger("click");
            setTimeout( function(){
                $("#reserved_submit").trigger("click");
            }, 400 );
        }
        */

    }, 400 );
}