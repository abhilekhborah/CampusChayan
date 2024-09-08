// Select DOM elements
const submitBtn = document.querySelector("#submit-btn");
const submitBtn2 = document.querySelector("#submit-btn2");
const questionInput = document.getElementById("questionInput");
const questionInput2 = document.getElementById("questionInput2");
const question = document.getElementById("question");
const solution = document.getElementById("solution");
const right1 = document.querySelector(".right1");
const right2 = document.querySelector(".right2");
const recommends = document.querySelectorAll(".rec");

// async function handleInput(inputElement) {
//     const userMessage = inputElement.value.trim();
//     if (userMessage) {
//         right2.style.display = "block";
//         right1.style.display = "none";

//         question.innerHTML = userMessage;
//         const result = await postData("/query", {"question": userMessage});
//         solution.innerHTML = result.answer;
//         console.log(result);
//         inputElement.value = ""; 
//     }
// }

async function handleInput(inputElement) {
    const userMessage = inputElement.value.trim();
    if (userMessage) {
        right2.style.display = "block";
        right1.style.display = "none";

        question.innerHTML = userMessage;
        const result = await postData("/query", {"question": userMessage});
        
        // Split the result into sections
        const sections = result.result.split('\n\n');
        
        // Extract each section
        const answer = sections[0].replace('Answer: ', '');
        const hindiTranslation = sections[1].replace('Hindi Translation: ', '');
        const recommendedQuestions = sections[2].replace('Recommended Questions:\n', '').split('\n');
        
        // Create HTML content
        let htmlContent = `
            <h3>Answer:</h3>
            <p>${answer}</p>
            <h3>Hindi Translation:</h3>
            <p>${hindiTranslation}</p>
            <h3>Recommended Questions:</h3>
            <ol>
                ${recommendedQuestions.map(q => `<li>${q.replace(/^\d+\.\s/, '')}</li>`).join('')}
            </ol>
        `;
        
        solution.innerHTML = htmlContent;
        console.log(result);
        inputElement.value = ""; 
    }
}

// Event listeners for submit buttons
submitBtn.addEventListener("click", () => handleInput(questionInput));
submitBtn2.addEventListener("click", () => handleInput(questionInput2));

// Event listeners for recommendation clicks
recommends.forEach(recommend => {
    recommend.addEventListener("click", async () => {
        const questionInputs = recommend.textContent;
        right2.style.display = "block";
        right1.style.display = "none";

        question.innerHTML = questionInputs;
        const result = await postData("/query", {"question": userMessage});
        solution.innerHTML = result.answer;
    });
});

// Function to post data to the API
async function postData(url = "", data = {}) { 
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json", 
            },
            body: JSON.stringify(data),  
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    } catch (error) {
        console.error('Error:', error);
        return { answer: 'Sorry, I encountered an error. Please try again later.' };
    }
}

// Add event listeners for Enter key press
questionInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        handleInput(questionInput);
    }
});

questionInput2.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        handleInput(questionInput2);
    }
});

// New thread button functionality
const newThreadBtn = document.querySelector(".newthread");
newThreadBtn.addEventListener('click', () => {
    right1.style.display = "block";
    right2.style.display = "none";
    questionInput.value = "";
    questionInput2.value = "";
    solution.innerHTML = "";
});

// Collapse button functionality (if needed)
let btn = document.querySelector(".maxbtn");
let sidebar = document.querySelector(".sidebar");
btn.addEventListener("click", function(){
    sidebar.classList.toggle("active");
});
