
//formdata(data information) , category(photos , videos etc)
export function forms(formdata, category){   
   const forms = new FormData();  // form data creation
   
   // check if formdata have a data
   if(!formdata){
    alert('Empty Information');
    return null
   }else

   switch(category) {
      case 'photos': 
              //movieId,url,userID,descri
                  //photovalidation 
              if (!filevalidation(formdata.file, "photos")) {
                    return null 
                  }   else{

                    //data append
                    // alert(formdata.file.name
                    forms.append('image',formdata.file);
                    forms.append('movieId', formdata.movieId);
                    forms.append('description',formdata.description)
                  }
                    return forms; 
      case 'videos' :

              return forms ;
        default :
           alert("not on the list")
             return null;

    
   }

     //function validations 
   function filevalidation(data, category){
  // photo information validation 
  switch(category) {
     case 'photos':
      if (!data || (data.type !== "image/png" && data.type !== "image/jpeg"
        && data.type !=="image/jpg"
        && data.type !=="image/gif"
      )) {
        alert("It Accept gif, jpg , jpeg and png file only .");
        return false;
        }
        return true;
      case 'videos':
          
        return false;
        
      default: 
         alert('not on the list')
         return false
     
  }

    }

   }


