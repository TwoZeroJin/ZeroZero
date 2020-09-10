$(function(){
	$("form").validate({
		//규칙
		rules:{
			height:{
				required : true, //필수입력여부
				number : true,
                min: 30,
                max: 250,
			},
			weight:{
				required : true, //필수입력여부
				number : true,
                min: 0,
                max: 300,
			},
			drink_week:{ required : true },
			drink_cnt : { required : true },
			smoke_cnt : {required : true}
		},
        
		//메시지
		messages:{
			height:{
				required : "필수 입력 항목입니다.",
				min: "옳지 않은 형식입니다.",
				max : "옳지 않은 형식입니다.",
				number : "숫자로만 입력하세요."
			},
			weight: {
				required : "필수 입력 항목입니다.",
				min: "옳지 않은 형식입니다.",
				max : "옳지 않은 형식입니다.",
				number : "숫자로만 입력하세요."
			},
			drink_week :{ required : "" },
			drink_cnt : { required : "필수 선택항목입니다."},
			smoke_cnt : { required : "필수 선택항목입니다."},
		}
	});
});