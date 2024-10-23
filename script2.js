// Sélectionner les éléments nécessaires
const adviceBtn = document.getElementById('adviceBtn');
const commentSection = document.getElementById('commentSection');
const commentForm = document.getElementById('commentForm');
const reviewsContainer = document.getElementById('reviews');
let selectedRating = 0;

// Afficher ou masquer la section de commentaire
adviceBtn.addEventListener('click', () => {
    commentSection.style.display = commentSection.style.display === 'none' ? 'block' : 'none';
});

// Gérer la sélection de la note
document.querySelectorAll('#rating .star').forEach(star => {
    star.addEventListener('click', () => {
        selectedRating = parseInt(star.getAttribute('data-rating'));
        document.querySelectorAll('#rating .star').forEach(s => {
            s.innerHTML = (parseInt(s.getAttribute('data-rating')) <= selectedRating) ? '&#9733;' : '&#9734;';
            s.style.color = (parseInt(s.getAttribute('data-rating')) <= selectedRating) ? 'gold' : 'black';
        });
    });
});

// Gérer la soumission du formulaire de commentaire
commentForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const providerName = document.getElementById('provider-name').value;
    const pseudo = document.getElementById('pseudo').value;
    const comment = document.getElementById('comment').value;

    // Créer un nouvel avis
    const newReview = {
        providerName: providerName,
        pseudo: pseudo,
        rating: selectedRating,
        comment: comment
    };

    // Récupérer les avis existants et les ajouter
    const reviews = JSON.parse(localStorage.getItem('reviews')) || [];
    reviews.push(newReview);

    // Garder seulement les 3 derniers avis
    if (reviews.length > 3) {
        reviews.shift(); // Supprimer le plus ancien
    }

    // Sauvegarder les avis dans le localStorage
    localStorage.setItem('reviews', JSON.stringify(reviews));

    // Mettre à jour l'affichage des avis
    displayReviews(reviews);

    // Réinitialiser le formulaire
    commentForm.reset();
    selectedRating = 0; // Réinitialiser la sélection de la note
    document.querySelectorAll('#rating .star').forEach(s => s.innerHTML = '&#9734;'); // Réinitialiser les étoiles
});

// Fonction pour afficher les avis
function displayReviews(reviews) {
    reviewsContainer.innerHTML = ''; // Effacer les avis affichés

    reviews.forEach(review => {
        const reviewContainer = document.createElement('div');
        reviewContainer.classList.add('review-container'); // Ajouter une classe pour le style
        reviewContainer.innerHTML = `
            <h4>${review.providerName} - ${review.pseudo}</h4>
            <div class="rating">
                ${generateStars(review.rating)}
            </div>
            <p>${review.comment}</p>
        `;

        reviewsContainer.appendChild(reviewContainer);
    });
}

// Fonction pour générer les étoiles
function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += (i <= rating) ? '&#9733;' : '&#9734;';
    }
    return stars;
}

// Charger les avis au chargement de la page
window.addEventListener('load', () => {
    const reviews = JSON.parse(localStorage.getItem('reviews')) || [];
    displayReviews(reviews);
});
