document.addEventListener("click", (event) => {
  let target = event.target;
  if (target.classList.contains("search-button")) {
    const value = document.getElementsByName("search-input")[0].value;
    if (value !== "") {
      window.location.pathname=`/search/${value}`;
    } else {
      //display error
    }
  }
});
