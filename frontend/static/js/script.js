let btn = document.querySelector(".maxbtn");
let sidebar = document.querySelector(".sidebar");
btn.addEventListener("click", function(){
    sidebar.classList.toggle("active");
});


async function postData(url = "", data = {}) { 
    const response = await fetch(url, {
      method: "POST", headers: {
        "Content-Type": "application/json", 
      }, body: JSON.stringify(data),  
    });
    return response.json(); 
  };



let submitBtn = document.querySelector("#submit-btn");
submitBtn.addEventListener("click", async()=>{
    let questionInput = document.getElementById("questionInput").value;
    document.getElementById("questionInput").value ="";
    document.querySelector(".right2").style.display ="block";
    document.querySelector(".right1").style.display ="none";

    question.innerHTML = questionInput; 
    let result = await postData("/api", {"question": questionInput})
    solution.innerHTML = result.answer;
});

let submitBtn2 = document.querySelector("#submit-btn2");
submitBtn2.addEventListener("click", async()=>{
    let questionInput2 = document.getElementById("questionInput2").value;
    document.getElementById("questionInput").value ="";
    document.querySelector(".right2").style.display ="block";
    document.querySelector(".right1").style.display ="none";

    question.innerHTML = questionInput2; 
    let result = await postData("/api", {"question": questionInput2})
    solution.innerHTML = result.answer;
});


let recommends = document.querySelectorAll(".rec");

recommends.forEach(recommend => {
  recommend.addEventListener("click", async()=>{
    let questionInputs = recommend.textContent;
    document.querySelector(".right2").style.display ="block";
    document.querySelector(".right1").style.display ="none";

    question.innerHTML = questionInputs; 
    let result = await postData("/api", {"question": questionInputs})
    solution.innerHTML = result.answer;
  });
});