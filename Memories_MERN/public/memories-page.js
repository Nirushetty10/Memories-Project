let fileVal;
let idArray = [];
const formElement = document.querySelector("form");
const inputElements = document.querySelectorAll("input");
const errorEle = document.getElementById("msgError");
const divEle = document.querySelector(".container");
const createButton = document.getElementById("create-btn");
const displayDiv = document.querySelector(".display-container");
const cardContainer = document.querySelector(".card-container");

formElement.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("title-input").value;
  const desc = document.getElementById("desc-input").value;
  const image = document.getElementById("image-input").files[0];
  const date = document.getElementById("date-input").value;
  fileVal = image;

  try {
    if (
      title.length == 0 ||
      desc.length == 0 ||
      image.length == 0 ||
      date.length == 0
    ) {
      throw new TypeError("*all fields are reqiured");
    }
  } catch (error) {
    errorEle.textContent = error.message;
    return;
  }
  try {
    if (desc.length > 250) {
      throw new TypeError("*description text count exceeded");
    }
  } catch (error) {
    errorEle.textContent = error.message;
  }
  // if (fileVal) {
  //   const reader = new FileReader();
  //   reader.onload = function (e) {
  //     let dataVal = e.target.result;
  //     let blobData = new Blob([dataVal], { type: "images/JPG" });
  //     let linkEle = URL.createObjectURL(blobData);
  //     apicallingFunction({ title, desc, linkEle, date });
  //   };
  //   reader.readAsArrayBuffer(fileVal);
  // }

  if (image) {
    var reader = new FileReader();
    reader.onload = function () {
      var base64Data = reader.result.split(",")[1];
      arrayBuffer = Uint8Array.from(atob(base64Data), function (c) {
        return c.charCodeAt(0);
      }).buffer;
      console.log(arrayBuffer);
    };
  }
  reader.readAsDataURL(image);

  apicallingFunction({ title, desc, date });
  // window.location.reload();
});

async function apicallingFunction(data) {
  try {
    const result = await fetch(`http://localhost:3001/auth/userid`);
    let id = await result.json();
    console.log(id);
    let response = await fetch(
      `http://localhost:3001/memories/addMemories/${id}`,
      {
        method: "PUT",
        body: JSON.stringify({
          memory_title: data.title,
          memory_desc: data.desc,
          // memory_img: data.linkEle,
          memory_date: data.date,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }
    );
    if (response.ok) {
      Swal.fire("created", "You have created memory successfully", "success");
      inputElements.forEach((input) => {
        input.value = "";
      });
      divEle.classList.add("contianer-visible");
    } else {
      const errorResponse = await response.text();
      console.log(errorResponse);
      errorEle.textContent = errorResponse;
    }
  } catch (err) {
    console.log(err);
  }
}

function removeForm() {
  divEle.classList.remove("contianer-visible");
  createButton.style.backgroundColor = "#ffff";
  createButton.style.color = "black";
  displayDiv.style.display = "grid";
}

function reDirectPage() {
  callingOut();
}

async function callingOut() {
  try {
    let response = await fetch(`http://localhost:3001/auth/logout`);
    if (response.ok) {
      window.location.href = "http://localhost:3001";
    }
  } catch (error) {
    console.log(error);
  }
}

createButton.addEventListener("click", (e) => {
  divEle.classList.add("contianer-visible");
  e.target.style.backgroundColor = "rgb(255, 179, 80)";
  e.target.style.color = "#ffff";
  displayDiv.style.display = "none";
});

inputElements.forEach((input) => {
  input.addEventListener("focus", () => {
    errorEle.textContent = "";
  });
});

window.onload = async () => {
  try {
    const result = await fetch(`http://localhost:3001/auth/userid`);
    let id = await result.json();
    let response = await fetch(`http://localhost:3001/memories/memory/${id}`);
    if (response.ok) {
      let responseResult = await response.json();
      responseResult.forEach(async (res, resIndex) => {
        idArray.push(res._id);
        const clonedDiv = cardContainer.cloneNode(true);
        clonedDiv.classList.remove("card-display");
        // document.getElementById("imageEle").src = `${responseResult.memory_img}`;
        clonedDiv.querySelector("#headEle").textContent = `${res.memory_title}`;
        clonedDiv.querySelector("#descEle").textContent = `${res.memory_desc}`;
        clonedDiv.querySelector("#dateEle").textContent = `${res.memory_date}`;
        displayDiv.appendChild(clonedDiv);

        let likeStatusResponse = await fetch(
          `http://localhost:3001/memories/memory/like/${id}/${resIndex}`
        );
        const responseResul = await likeStatusResponse.json();
        console.log(responseResul);
        if (responseResul) {
          console.log("hi");
          clonedDiv
            .querySelector(".empty-heart")
            .classList.add("hidden-heart");
          clonedDiv
            .querySelector(".filled-heart")
            .classList.remove("hidden-heart");
        } else {
          console.log("bye");
          clonedDiv.querySelector(".filled-heart").classList.add("hidden-heart");
          clonedDiv
            .querySelector(".empty-heart")
            .classList.remove("hidden-heart");
        }
      });
      let deleteBtn = document.querySelectorAll(".fa-trash");
      deleteBtn.forEach((btn, index) => {
        btn.addEventListener("click", async () => {
          let response = await fetch(
            `http://localhost:3001/memories/memory/${id}/${idArray[index]}`,
            {
              method: "PUT",
            }
          );
          window.location.reload();
        });
      });

      // emptyHeartIcon.forEach((ele, position) => {
      //   ele.addEventListener("click", async () => {
      //     let likeResponse = await fetch(
      //       `http://localhost:3001/memories/memory/like/${idArray[position]}`,
      //       {
      //         method: "PUT",
      //       }
      //     );
      //   });
      // });
    } else {
      const errorResponse = await response.text();
      console.log(errorResponse);
    }
  } catch (err) {
    console.log(err);
  }
};
