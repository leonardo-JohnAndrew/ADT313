<?php 
 $table = array(
     "header" => array(
           "Student ID",
           "Lastname",
           "Middlename",
           "Firstname",
           "Course",
           "Section"
     ),
     "body" =>array(
        array(
            "lastname" => "lastname",
            "middlename" =>"middlename",
            "firstname" => "firstname",
            "course" => "BSIT",
            "section" =>"section"
        ),
        array(
            "lastname" => "lastname",
            "middlename" =>"middlename",
            "firstname" => "firstname",
            "course" => "BSIT",
            "section" =>"section"
        ),
        array(
            "lastname" => "lastname",
            "middlename" =>"middlename",
            "firstname" => "firstname",
            "course" => "BSIT",
            "section" =>"section"
        ),
        array(
            "lastname" => "lastname",
            "middlename" =>"middlename",
            "firstname" => "firstname",
            "course" => "BSIT",
            "section" =>"section"
        ),
        array(
            "lastname" => "lastname",
            "middlename" =>"middlename",
            "firstname" => "firstname",
            "course" => "BSIT",
            "section" =>"section"
        ),
        array(
            "lastname" => "lastname",
            "middlename" =>"middlename",
            "firstname" => "firstname",
            "course" => "BSIT",
            "section" =>"section"
        ),
        array(
            "lastname" => "lastname",
            "middlename" =>"middlename",
            "firstname" => "firstname",
            "course" => "BSIT",
            "section" =>"section"
        ),
        array(
            "lastname" => "lastname",
            "middlename" =>"middlename",
            "firstname" => "firstname",
            "course" => "BSIT",
            "section" =>"section"
        ),
        array(
            "lastname" => "lastname",
            "middlename" =>"middlename",
            "firstname" => "firstname",
            "course" => "BSIT",
            "section" =>"section"
        ),
        array(
            "lastname" => "lastname",
            "middlename" =>"middlename",
            "firstname" => "firstname",
            "course" => "BSIT",
            "section" =>"section"
        )
     )
        )
?>
<?php 

// echo $table["header"][0];

?>
<table border = "1
">
    <thead>
    <?php
for($i = 0 ; $i<6 ; $i++ ){

?>

    <th><?php  echo $table["header"][$i] ?></th>


<?php 

}

?>
 </thead>

 <tbody>
   
 <?php  

 
 for($c = 0 ; $c<10 ; $c++){
    $fname =  $table["body"][0]["firstname"];
    $lname =  $table["body"][0]["lastname"];
    $mname = $table['body'][0]["middlename"];
    $sec = $table['body'][0]["section"];
   $course = $table['body'][0]["course"];
 ?>
<tr>
 <td><?php echo  $c?></td>
 <Td><?php echo $lname ?></Td>
 <Td><?php echo $mname ?></TD>
 <TD><?php echo $fname ?></td>
 <Td><?php echo $course?></Td>
 <Td><?php echo $sec ?></Td>
     


<?php 
 };


?>
</tr>
 </tbody>

</table>
