import { useState } from "react";
//toast → show error message popup
import { toast } from "sonner";

//This is the async function you want to call(API call, server action, fetch, etc.
// mota mota baat yeh hai ki koi aur file mein agar hm useFetch(function) call krenge toh
// woh yaha se hmko data , loading , function , error yeh sb dega 


// use fetch terurning .
//{
 // loading: ...,
 // data: ...,
 // error: ...,
 // fn: function.which we are using as submituserRole
//}

/*actual call is happening like this 

submitUserRole(formData)
        ↓
fn(formData)
        ↓
cb(formData)
        ↓
setUserRole(formData)   // SERVER ACTION*/

const useFetch = (cb) => {
  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  //...args means “whatever values you pass when calling fn”
  const fn = async (...args) => {
    setLoading(true);
    setError(null);

    try {
      const response = await cb(...args);
      setData(response);
      setError(null);
    } catch (error) {
      setError(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fn, setData };
};

export default useFetch;