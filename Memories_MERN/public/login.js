const formElement = document.querySelector("form");
const serverError = document.getElementById("serverError");
const inputElements = document.querySelectorAll("input");


formElement.addEventListener("submit", (e) => {
  e.preventDefault();

  const newFormData = new FormData(formElement);
  const email = newFormData.get("email-input");
  const password = newFormData.get("password-input");

  postData({email,password})
  
});

function reDirectSignupPage(){
  window.location.href = "http://localhost:3001/signup";
}

async function postData(data) {
    try {
      let response = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      if (response.ok) {
        Swal.fire(
          'loged in',
          'You have successfully loged in',
          'success'
        )
        setTimeout(()=>{
          window.location.href = "http://localhost:3001/memories";
        },2000)
        
        
      } else {
        const errorResponse = await response.text();
        console.log(errorResponse);
        serverError.textContent = errorResponse;
      }
    } catch (err) {
      console.log(err);
    }
  }

  function reDirectMainPage(){
    window.location.href = "http://localhost:3001";
  }

  inputElements.forEach((input) => {
    input.addEventListener("focus", () => {
      serverError.textContent = "";
    });
  });