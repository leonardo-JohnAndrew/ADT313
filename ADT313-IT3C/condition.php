<h1>Condition</h1>
<?php 
 $num = 15 ;
 if($num%2){
    echo "odd";
 } elseif ($num % 3){

 }else{
    echo "even";
 }


 //(condition ) ? true : false

 $authenticated = true;
 $checkauthenticated=  ($authenticated) ?  "<br> access granted": "access denied";
 echo $checkauthenticated;

//  dont's
//   if()
//   if()
//   if()
//   if()

switch($color){
    case 'red':

        break;

    case 'blue':

         break;

   default:
   
}

 ?>