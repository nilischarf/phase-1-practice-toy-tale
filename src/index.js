let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
  fetchToys()
  document.querySelector(".add-toy-form").addEventListener("submit", handleToyFormSubmit);
});

function fetchToys() {
  fetch("http://localhost:3000/toys")
    .then(response => response.json())
    .then(toys => {
      const toyCollection = document.getElementById("toy-collection");
      toyCollection.innerHTML = ""; 
      toys.forEach(toy => toyCollection.appendChild(createToyCard(toy)));
    });
}

function createToyCard(toy) {
  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <h2>${toy.name}</h2>
    <img src="${toy.image}" class="toy-avatar" />
    <p>${toy.likes} Likes</p>
    <button class="like-btn" id="${toy.id}">Like ❤️</button>
  `;

  card.querySelector(".like-btn").addEventListener("click", () => {
    updateLikes(toy);
  });

  return card;
}

function handleToyFormSubmit(event) {
  event.preventDefault();
  const name = event.target.name.value;
  const image = event.target.image.value;

  const newToy = {
    name,
    image,
    likes: 0
  };

  fetch("http://localhost:3000/toys", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(newToy)
  })
    .then(response => response.json())
    .then(toy => {
      const toyCollection = document.getElementById("toy-collection");
      toyCollection.appendChild(createToyCard(toy));
      event.target.reset(); 
    });
}

function updateLikes(toy) {
  const newLikes = toy.likes ++;

  fetch(`http://localhost:3000/toys/${toy.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({ likes: newLikes })
  })
    .then(response => response.json())
    .then(updatedToy => {
      const toyCard = document.getElementById(updatedToy.id).closest(".card");
      toyCard.querySelector("p").textContent = `${updatedToy.likes} Likes`;
    });
}