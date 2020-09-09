$(function(){
    $("#validate").on("blur",
    function(e){
        e.preventDefault();
        let p_id = $("#p_id").val();
        let password = $("#password").val();
        let rePass = $("rePass").val();
    });
    $("#checkId").on("click",
    function(e){
        e.preventDefault();
        let p_id = $("#p_id").val();
        axios.post('/auth/login')
    })
})