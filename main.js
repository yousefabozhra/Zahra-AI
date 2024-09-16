const typing_form = document.querySelector(".typing_form");
const chat_list = document.querySelector(".chat_list");



const API_Key = 'AIzaSyC9wGMj0c1pjr3xaQS2ByNvU5P13KtEgmA';
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_Key}`;




const showTyping = (text, textElement) => {
    const words = text.split(" ")
    let currentIndex = 0;

    const typingInterval = setInterval(() => {
        textElement.innerHTML += (currentIndex === 0 ? "" : " ") + words[currentIndex++];
        if(currentIndex === words.length){
            clearInterval(typingInterval)
        }
        window.scrollTo(0, chat_list.scrollHeight);
    }, 75);
}





const APIresponse = async (div) => {
    const textElement = div.querySelector(".text");

    try{
        const response = await fetch(API_URL, {
            method:"POST",
            headers:{"content-type" : "application/json"},
            body:JSON.stringify({
                contents:[{
                    role:"user",
                    parts:[{text: userMessage}]
                }]
            })
        })

        const data = await response.json()
        const apiResponse = data?.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, `$1`)
        console.log(apiResponse);
        showTyping(apiResponse, textElement)
    }
    catch(error){
        console.error(error)
    }
    finally{
        div.classList.remove("loading");
    }
    
}



const copyMessage = (copy_Btn) => {
    const messageText = copy_Btn.parentElement.querySelector(".text").innerHTML;
    navigator.clipboard.writeText(messageText);
    copy_Btn.innerText = "done";
    setTimeout(() => copy_Btn.innerText = "content_copy", 1000);
}



const showLoading = () => {
    const loading = `
                <div class="message_content">
                        <img src="imgs/images (2).jpg" alt="">
                        <p class="text"></p>
                        <div class="loading1">
                            <div class="loading2"></div>
                            <div class="loading2"></div>
                            <div class="loading2"></div>
                        </div>
                </div>
                <span onclick = "copyMessage(this)" class="material-symbols-outlined">
                    content_copy
                    </span>
                    `
    const div = document.createElement("div");
    div.classList.add("message", "icoming", "loading");
    div.innerHTML = loading;
    chat_list.appendChild(div);


    window.scrollTo(0, chat_list.scrollHeight);
    APIresponse(div);
}

const handelOutGoingChat = () => {
    userMessage = document.querySelector(".typing_input").value;
    console.log(userMessage);

    if(!userMessage) return

    const prompt =`
                    <div class="message_content">
                        <img src="imgs/my.jpeg" alt="">
                        <p class="text"></p>
                </div>
                `
    const div = document.createElement("div");
    div.classList.add("message", "outgoing");
    div.innerHTML = prompt;
    div.querySelector(".text").innerHTML = userMessage;
    chat_list.appendChild(div)
    typing_form.reset();


    window.scrollTo(0, chat_list.scrollHeight);
    setTimeout(showLoading, 500)
}




typing_form.addEventListener("submit", (e) => {
    e.preventDefault();

    handelOutGoingChat();
})