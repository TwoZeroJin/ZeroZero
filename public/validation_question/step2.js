$(function(){
	$("form").validate({
		//규칙
		rules:{
			treat_time: { required : true },
			treat_div : { required : true },
			disease_desc : { required : true },
		},
        
		//메시지
		messages:{
			treat_time: { required : "초진여부를 입력해주세요." },
			treat_div : { required : "필수 입력 항목입니다." },
			disease_desc :{ required : "필수 입력 항목입니다." },
		},

		//에러 css처리(위치)
		errorPlacement: function(error, element) 
        {
            if ( element.is(":radio") ) {				//요소가 radio 박스이면
			   element.next().next().next().after(error);	//해당요소의 다다다다음 요소에 error를 출력
            }
            else { // 라디오버튼 요소 외 다른 요소들의 경우
                error.insertAfter( element );
            }
		}
	});
});