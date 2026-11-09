
"use strict";

// BLOOM TOGETHER - INTERAKTIV DEMO
// Ingen data sendes til en server eller gemmes permanent.

const demoPosts = [
  {
    id: 1,
    category: "Tankemylder",
    title: "Er der andre, der overtænker små samtaler?",
    text: "Nogle gange bruger jeg lang tid på at tænke over, om jeg fik sagt noget forkert. Er der andre, der kender følelsen?",
    likes: 12,
    liked: false,
    replies: [
      "Ja, jeg kender det godt. Du er ikke alene.",
      "Jeg prøver at minde mig selv om, at andre ikke nødvendigvis tænker så meget over samtalen."
    ]
  },
  {
    id: 2,
    category: "Små sejre",
    title: "I dag gjorde jeg noget, jeg har udskudt længe 🌷",
    text: "Det virker måske som en lille ting, men jeg er faktisk ret stolt af mig selv.",
    likes: 28,
    liked: false,
    replies: [
      "Hvor er det dejligt! Små skridt tæller også."
    ]
  },
  {
    id: 3,
    category: "Relationer",
    title: "Hvordan bliver man bedre til at sætte grænser?",
    text: "Jeg synes nogle gange, det er svært at sige nej, fordi jeg ikke vil skuffe andre. Har I nogle gode råd?",
    likes: 9,
    liked: false,
    replies: [
      "Det hjælper mig at øve mig på små situationer først."
    ]
  },
  {
    id: 4,
    category: "Spørgsmål",
    title: "Hvad gør I for at finde ro efter en lang dag?",
    text: "Jeg vil gerne blive bedre til at give mig selv små pauser. Hvad hjælper jer med at koble af?",
    likes: 16,
    liked: false,
    replies: [
      "Jeg læser en bog eller går en lille tur."
    ]
  }
];

const posts = demoPosts.map(post => ({
  ...post,
  replies: [...post.replies]
}));

let nextId = 5;
let currentCategory = "Alle";

const postsContainer = document.getElementById("bt-posts");
const statusElement = document.getElementById("bt-status");
const filterButtons = document.querySelectorAll(".bt-filter");
const formSection = document.getElementById("bt-post-form-section");
const newPostButton = document.getElementById("bt-new-post-button");
const cancelButton = document.getElementById("bt-cancel-post");
const postForm = document.getElementById("bt-post-form");

function createElement(tag, className, text) {
  const element = document.createElement(tag);

  if (className) {
    element.className = className;
  }

  if (text !== undefined) {
    element.textContent = text;
  }

  return element;
}

function renderPosts() {
  postsContainer.replaceChildren();

  const visiblePosts = posts.filter(post =>
    currentCategory === "Alle" ||
    post.category === currentCategory
  );

  statusElement.textContent =
    `${visiblePosts.length} opslag vises`;

  if (visiblePosts.length === 0) {
    postsContainer.appendChild(
      createElement(
        "p",
        "bt-empty",
        "Der er endnu ingen opslag i denne kategori."
      )
    );
    return;
  }

  visiblePosts.forEach(post => {
    const card = createElement("article", "bt-post-card");

    const meta = createElement("div", "bt-post-meta");
    meta.appendChild(
      createElement("span", "", "✿ Anonym blomst")
    );
    meta.appendChild(
      createElement("span", "bt-post-category", post.category)
    );

    const heading = createElement("h3", "", post.title);
    const body = createElement("p", "bt-post-text", post.text);

    const actions = createElement("div", "bt-post-actions");

    const likeButton = createElement(
      "button",
      "bt-action",
      `♡ Vis støtte (${post.likes})`
    );
    likeButton.type = "button";
    likeButton.setAttribute("aria-pressed", String(post.liked));

    likeButton.addEventListener("click", () => {
      post.liked = !post.liked;
      post.likes += post.liked ? 1 : -1;
      likeButton.setAttribute(
        "aria-pressed",
        String(post.liked)
      );
      likeButton.textContent =
        `${post.liked ? "♥" : "♡"} Vis støtte (${post.likes})`;
    });

    const repliesButton = createElement(
      "button",
      "bt-action",
      `Se svar (${post.replies.length})`
    );
    repliesButton.type = "button";
    repliesButton.setAttribute("aria-expanded", "false");

    const repliesSection = createElement(
      "div",
      "bt-replies"
    );
    repliesSection.hidden = true;
    repliesSection.id = `bt-replies-${post.id}`;
    repliesButton.setAttribute(
      "aria-controls",
      repliesSection.id
    );

    function renderReplies() {
      repliesSection.replaceChildren();

      post.replies.forEach(reply => {
        const replyCard = createElement("div", "bt-reply");
        replyCard.appendChild(
          createElement("strong", "", "Anonym blomst")
        );
        replyCard.appendChild(
          createElement("p", "", reply)
        );
        repliesSection.appendChild(replyCard);
      });

      const replyForm = createElement(
        "form",
        "bt-reply-form"
      );

      const label = createElement(
        "label",
        "",
        "Skriv et demosvar"
      );

      const textarea = createElement("textarea");
      textarea.rows = 3;
      textarea.maxLength = 500;
      textarea.required = true;
      textarea.placeholder = "Skriv et venligt svar...";
      textarea.id = `bt-reply-input-${post.id}`;
      label.htmlFor = textarea.id;

      const submitButton = createElement(
        "button",
        "bt-primary-button",
        "Tilføj svar"
      );
      submitButton.type = "submit";

      replyForm.append(label, textarea, submitButton);

      replyForm.addEventListener("submit", event => {
        event.preventDefault();

        const text = textarea.value.trim();
        if (!text) return;

        post.replies.push(text);
        renderReplies();

        repliesButton.textContent =
          `Se svar (${post.replies.length})`;
      });

      repliesSection.appendChild(replyForm);
    }

    repliesButton.addEventListener("click", () => {
      const isOpening = repliesSection.hidden;

      repliesSection.hidden = !isOpening;
      repliesButton.setAttribute(
        "aria-expanded",
        String(isOpening)
      );

      if (isOpening) {
        renderReplies();
      }
    });

    actions.append(likeButton, repliesButton);
    card.append(meta, heading, body, actions, repliesSection);
    postsContainer.appendChild(card);
  });
}

// KATEGORIFILTRE
filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    currentCategory = button.dataset.category;

    filterButtons.forEach(filter => {
      const isActive = filter === button;
      filter.classList.toggle("active", isActive);
      filter.setAttribute(
        "aria-pressed",
        String(isActive)
      );
    });

    renderPosts();
  });
});

// VIS / SKJUL FORMULAR
newPostButton.addEventListener("click", () => {
  const opening = formSection.hidden;

  formSection.hidden = !opening;
  newPostButton.setAttribute(
    "aria-expanded",
    String(opening)
  );

  if (opening) {
    document.getElementById("bt-post-category").focus();
  }
});

cancelButton.addEventListener("click", () => {
  formSection.hidden = true;
  newPostButton.setAttribute("aria-expanded", "false");
  newPostButton.focus();
});

// OPRET DEMOOPSLAG
postForm.addEventListener("submit", event => {
  event.preventDefault();

  const category = document
    .getElementById("bt-post-category").value;

  const title = document
    .getElementById("bt-post-title").value.trim();

  const text = document
    .getElementById("bt-post-text").value.trim();

  if (!category || !title || !text) return;

  posts.unshift({
    id: nextId++,
    category,
    title,
    text,
    likes: 0,
    liked: false,
    replies: []
  });

  postForm.reset();
  formSection.hidden = true;
  newPostButton.setAttribute("aria-expanded", "false");

  currentCategory = "Alle";

  filterButtons.forEach(button => {
    const active = button.dataset.category === "Alle";
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  renderPosts();
  document.getElementById("faellesskab")
    .scrollIntoView({ behavior: "smooth" });
});

renderPosts();
