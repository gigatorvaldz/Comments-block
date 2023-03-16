let commentForm = document.querySelector(".comment-form");

let formatDate = (inputDate) => {
  let date;
  if (!inputDate) {
    date = new Date();
  } else {
    date = new Date(inputDate);
  }

  let now = new Date();

  currentHours = ("0" + now.getHours()).slice(-2);
  currentMinutes = ("0" + now.getMinutes()).slice(-2);
  let timeStamp = currentHours + ":" + currentMinutes;

  if (date.setHours(0, 0, 0, 0) == now.setHours(0, 0, 0, 0)) {
    return "Сегодня, " + timeStamp;
  }
  let yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  if (date.setHours(0, 0, 0, 0) == yesterday.setHours(0, 0, 0, 0)) {
    return "Вчера, " + timeStamp;
  }

  return Intl.DateTimeFormat().format(date) + " " + timeStamp;
};

let createComment = (form) => {
  let commentsContainer = document.querySelector(".comments-container");

  let comment = document.createElement("div");
  comment.innerHTML = `<div class='comment'><h3 class="user"><span class="field">Username: </span> ${
    form.name.value
  }</h3><p class="message"><span class="field">Comment: </span>${
    form.comment.value
  }</p><span class="date">Date: ${formatDate(
    form.date.value
  )}</span><div class="icons"><div class="fa-regular fa-heart like icon"></div><div class="fa-solid fa-trash trash icon"></div></div></div>`;

  let likeButton = comment.querySelector(".like");
  likeButton.addEventListener("click", () => {
    likeButton.classList.toggle("fa-regular");
    likeButton.classList.toggle("fa-solid");
    likeButton.classList.toggle("clicked");
  });

  let deleteButton = comment.querySelector(".trash");
  deleteButton.addEventListener("click", () => {
    comment.remove();
  });

  commentsContainer.append(comment);
};

let checkValidation = (form) => {
  let result = true;
  let inputs = form.querySelectorAll("input");
  let textAreas = form.querySelectorAll("textarea");

  inputs = [...inputs, ...textAreas];

  let removeError = (input) => {
    if (input.parentNode.classList.contains("error-container")) {
      input.parentNode.querySelector(".error").remove();
      input.parentNode.classList.remove("error-container");
      input.classList.remove("error-input");
    }
  };

  let createError = (input, text) => {
    let parent = input.parentNode;
    parent.classList.add("error-container");
    input.classList.add("error-input");

    if (!parent.querySelector(".error")) {
      let errorText = document.createElement("span");
      errorText.classList.add("error");
      errorText.innerText = `Error: ${text}`;
      parent.append(errorText);
    } else {
      let errorText = parent.querySelector(".error");
      errorText.innerText = `Error: ${text}`;
    }

    input.addEventListener("focus", () => {
      removeError(input);
    });
  };

  for (const input of inputs) {
    removeError(input);

    if (input.dataset.required) {
      if (input.value == "") {
        createError(input, `Is required`);
        result = false;
      }
    }

    if (input.dataset.maxLength) {
      if (input.value.length > input.dataset.maxLength) {
        createError(input, `Max length: ${input.dataset.maxLength}`);
        result = false;
      }
    }

    if (input.dataset.minLength) {
      if (input.value.length < input.dataset.minLength) {
        createError(input, `Min length: ${input.dataset.minLength}`);
        result = false;
      }
    }
  }

  return result;
};

function postComment(e) {
  e.preventDefault();
  if (checkValidation(this)) {
    createComment(this);
    this.name.value = "";
    this.comment.value = "";
    this.date.value = "";
  }
}

commentForm.addEventListener("submit", postComment);
