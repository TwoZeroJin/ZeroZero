$(function(){
    let flag1 = true;
    let flag2 = true;
    let flag3 = true;
    let flag4 = true;
    let flag5 = true;
    let flag6 = true;
    $(".checkId").on({"blur":function(){
        const p_id = $("#p_id").val();
            $.ajax({
                url:'/auth/valid',
                type:'post',
                data:{p_id:p_id},
                success:(data)=>{
                    // auth/valid로부터 res.send함수로 받은 값에 따라 text값 지정
                    if(data=='0'){
                        $("#noId").css({"color":"red"}).text("이미 존재하는 아이디입니다.");
                        flag1 = false;
                    }else if(data=='1'){
                        $("#noId").css({"color":"red"}).text("6자 이상, 숫자와 영문자만 됩니다.");
                        flag1 = false;
                    }else{
                        $("#noId").css({"color":"green"}).text("사용가능한 아이디입니다.");
                        flag1 = true;
                    }
                },error:(error)=>{
                    console.error(error);
                  }  
        })
    },"focus":function(){
        $("#noId").text("");
            flag1 = true;
    }
    })
    $(".checkPass").on({
        "blur":function(){
        let password = $("#password").val();
        if(!/^[a-zA-Z0-9]{8,16}$/.test(password)){
            $("#noPass").css({"color":"red"}).text("8-16자 숫자와 영문자");
            flag2 = false;
        }else{
            $("#noPass").css({"color":"green"}).text("사용 가능한 비밀번호 입니다.");
            flag2 = true;
        }
    },
        "focus":function(){
            $("#noPass").text("");
            flag2 = true;
}})
    $(".checkRePass").on({
        "blur":function(){
        let password = $("#password").val();
        let rePass = $("#rePass").val();
        if(password != rePass){
            $("#noRePass").text("비밀번호를 확인해주세요.");
            flag3 = false;
        }
    },
        "focus":function(){
            $("#noRePass").text("");
            flag3 = true;
}})
    $(".checkPhone").on({
        "blur":function(){
            let ph_no = $("#ph_no").val();
            if(!/^[0-9]{8,}$/.test(ph_no)){
                $("#noPhone").css({"color":"red"}).text("올바른 전화번호를 입력하세요.");
                flag4 = false;
            }else{
                $("#noPhone").css({"color":"green"}).text("");
                flag4 = true;
        }
    },
    "focus":function(){
        $("#noPhone").text("");
        flag4 = true;
    }
})
    $(".checkEmail").on({
        "blur":function(){
            let email = $("#email").val();
            if(!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)){
                $("#noEmail").css({"color":"red"}).text("올바른 이메일을 입력해주세요.");
                flag5 =  false;
            }else{
                $("#noEmail").css({"color":"green"}).text("");
                flag5 = true;
            }
        },
        "focus":function(){
            $("#noEmail").text("");
            flag5 = true;
        }
})
    $(".checkBirth").on({
        "blur":function(){
            let birth = $("#birth").val();
            if(!/^[0-9]{8,}$/.test(birth)){
                $("#noBirth").css({"color":"red"}).text("올바른 생년월일을 입력해주세요.");
                flag6 =  false;
            }else{
                $("#noBirth").css({"color":"green"}).text("");
                flag6 = true;
            }
        },
        "focus":function(){
            $("#noBirth").text("");
            flag6 = true;
        }
})
    $(".canSubmit").click(function(e){
        if(!(flag1&&flag2&&flag3&&flag4&&flag5&&flag6)){
            alert('메시지를 확인해주세요.');
            e.preventDefault();
        }
    })
})