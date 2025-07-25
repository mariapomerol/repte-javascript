document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".cartes-form");
    const input = document.querySelector(".input-number");
    const cardsContainer = document.getElementById("cards-container");

    // Espera a que es fagi submit
    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        // Error si no es un numero o es més petit que 1
        const count = parseInt(input.value);
        if (!count || count <= 0) {
            alert("Siusplau introdueix un número vàlid");
            return;
        }

        const maxId = 1025; // màxim numero de cartes a poke api
        const fetched = new Set();
        const results = [];

        // Esborra les cartes anteriors
        cardsContainer.innerHTML = "";

        // Agafem les dades per les cartes
        while (results.length < count) {
            const randomId = Math.floor(Math.random() * maxId) + 1;
            if (fetched.has(randomId)) continue;
            fetched.add(randomId);

            try {
                const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
                const data = await res.json();

                results.push({
                    name: data.name,
                    image: data.sprites.front_default,
                    types: data.types.map(t => t.type.name)
                });

            } catch (err) {
                console.error(`Error fetching Pokémon ID ${randomId}`, err);
            }
        }

        // Mostrem les cartes
        results.forEach(pokemon => {
            const card = document.createElement("div");
            card.classList.add("card");

            const name = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

            card.innerHTML = `
                <p class="poke-name">${name}</p>
                <div class="poke-details hidden">
                    <img src="${pokemon.image}" alt="${pokemon.name}" class="card-img">
                    <p><strong>Tipus:</strong> ${pokemon.types.join(", ")}</p>
                </div>
            `;

            card.addEventListener("click", () => {
                const details = card.querySelector(".poke-details");
                details.classList.toggle("hidden");
            });

            cardsContainer.appendChild(card);
        });
    });
});

