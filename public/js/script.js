const showPassword = document.querySelector("#showPassword")
showPassword.addEventListener("click", () => {
  const password = document.querySelector("#accountPassword")
  const type = password.getAttribute("type")
  if (type === "password") {
    password.setAttribute("type", "text")
  } else {
    password.setAttribute("type", "password")
  }
})