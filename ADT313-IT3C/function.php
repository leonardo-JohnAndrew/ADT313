
<?php 
 function myfunc($user){
    if($user != 'admin'){
        echo "go away";
    }else {
        echo "welcome";
    }
 }
 

 myfunc("admin");
?>