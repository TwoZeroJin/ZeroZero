$(function(){
    let flag = true;
    $(".checkId").on({"blur":function(){
        const p_id = $("#p_id").val();
            $.ajax({
                url:'/auth/valid',
                type:'post',
                data:{p_id:p_id},
                success:(data)=>{
                    if(data=='0'){
                        $("#noId").css({"color":"red"}).text("이미 존재하는 아이디입니다.");
                        flag = false;
                    }else if(data=='1'){
                        $("#noId").css({"color":"red"}).text("6자 이상, 숫자와 영문자만 됩니다.");
                        flag = false;
                    }else{
                        $("#noId").css({"color":"green"}).text("어썸하네여! ㅎ;");
                        flag = true;
                    }
                },error:(error)=>{
                    console.error(error);
                  }  
        })
    },"focus":function(){
        $("#noId").text("");
            flag = true;
    }
    })
    $(".checkPass").on({
        "blur":function(){
        let password = $("#password").val();
        if(!/^[a-zA-Z0-9]{8,16}$/.test(password)){
            $("#noPass").css({"color":"red"}).text("8-16자 숫자와 영문자");
            flag = false;
        }else{
            $("#noPass").css({"color":"green"}).text("사용 가능한 비밀번호 입니다 ~.~");
            flag = true;
        }
    },
        "focus":function(){
            $("#noPass").text("");
            flag = true;
}})
    $(".checkRePass").on({
        "blur":function(){
        let password = $("#password").val();
        let rePass = $("#rePass").val();
        if(password != rePass){
            $("#noRePass").text("비밀번호를 확인해주셈");
            flag = false;
        }
    },
        "focus":function(){
            $("#noRePass").text("");
            flag = true;
}})
    $(".checkPhone").on({
        "blur":function(){
            let ph_no = $("#ph_no").val();
            if(!/^[0-9]{8,}$/.test(ph_no)){
                $("#noPhone").css({"color":"red"}).text("올바른 전화번호를 입력하세요.");
                flag = false;
            }else{
                $("#noPhone").css({"color":"green"}).text("당신의 번호는 이제 제겁니다. zㅅz;");
                flag = true;
        }
    },
    "focus":function(){
        $("#noPhone").text("");
        flag = true;
    }
})
    $(".checkEmail").on({
        "blur":function(){
            let email = $("#email").val();
            if(!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)){
                $("#noEmail").css({"color":"red"}).text("올바른 이메일을 입력해주세요.");
                flag = false;
            }else{
                $("#noEmail").css({"color":"green"}).text("사용 가능한 이메일입니다. ㅎㅅㅎ;");
                flag = true;
            }
        },
        "focus":function(){
            $("#noEmail").text("");
            flag = true;
        }
})
    $("#canSubmit").click(function(e){
        if(!flag){
            alert('메시지를 확인해주세요 ㅎㅎ;');
            e.preventDefault();
        }
    })
})