const formElement = document.querySelector("form");
const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const serverError = document.getElementById("serverError");

formElement.addEventListener("submit", (e) => {
  e.preventDefault();

  const newFormData = new FormData(formElement);
  const username = newFormData.get("name-input");
  const email = newFormData.get("email-input");
  const password = newFormData.get("password-input");

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordPattern =
    /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;

  try {
    if (username.length === 0) {
      throw new TypeError("Name is required");
    }
    if (username.length < 3 || username.length > 20) {
      throw new TypeError("Name should contain 3 to 20 letters");
    }
  }
    catch(error){
      nameError.textContent = error.message;
      return
    }

    try {
      if (email.length === 0) {
        throw new TypeError("Email is required");
      }
      if (!emailPattern.test(email)) {
        throw new TypeError("Email is invalid");
      }
    }
     catch (error) {
      emailError.textContent = error.message;
      return
    }

    try {
      if (!passwordPattern.test(password)) {
        throw new TypeError(
          "Enter strong password"
        );
      }
    } 
    catch (error) {
      passwordError.textContent = error.message;
      return
    }
  postData({ username, email, password });
});

const inputElements = document.querySelectorAll("input");
inputElements.forEach(input => {
  input.addEventListener("focus",(e) => {
    serverError.textContent = "";
    if(e.target.id === "name-input"){
      nameError.textContent = "";
  
    }
    if(e.target.id === "email-input"){
      emailError.textContent = "";
    }
    if(e.target.id === "password-input"){
      passwordError.textContent = "";
    }
  })
})

async function postData(data) {
  try {
    let response = await fetch("http://localhost:3001/auth/register", {
      method: "POST",
      body: JSON.stringify({
        username: data.username,
        email: data.email,
        password: data.password,
        memories: [],
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    if (response.ok) {
      Swal.fire(
        'signed up',
        'You have created account successfully',
        'success'
      )
      setTimeout(()=>{
        window.location.href = "http://localhost:3001/login";
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

function reDirectLoginPage(){
  window.location.href = "http://localhost:3001/login";
}

function reDirectMainPage(){
  window.location.href = "http://localhost:3001";
}