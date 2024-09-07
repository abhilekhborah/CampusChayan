async function postData(url = "", data = {}) { 
    const response = await fetch(url, {
      method: "POST", headers: {
        "Content-Type": "application/json", 
      }, body: JSON.stringify(data),  
    });
    return response.json(); 
  }


let btn = document.querySelector(".maxbtn");
let sidebar = document.querySelector(".sidebar");
btn.addEventListener("click", function(){
    sidebar.classList.toggle("active");
});

let submitBtn = document.querySelector("#submit-btn");
submitBtn.addEventListener("click", ()=>{
    let questionInput = document.getElementById("questionInput").value;
    document.getElementById("questionInput").value ="";
    document.querySelector(".right2").style.display ="block";
    document.querySelector(".right1").style.display ="none";

    question.innerHTML = questionInput; 
    postData("/api", {"question": questionInput})
    solution.innerHTML = result.answer
})