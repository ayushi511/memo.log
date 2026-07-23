export const fieldsConfig = {
  journal: [], // handled by custom journal page now
  psychology: [
    { name: "observation", label: "What's been quietly sitting in your mind?", rows: 5 },
  ],
  creative: [
    { name: "title", label: "What did you make?", rows: 1 },
    { name: "medium", label: "Medium / Materials", rows: 1, placeholder: "e.g. poster colours, pencil, clay..." },
    { name: "inspiration", label: "What inspired you?", rows: 2 },
    { name: "description", label: "Tell the story behind it.", rows: 2 },
  ],
  kitchen: [
    { name: "dish", label: "What did you cook today?", rows: 1, placeholder: "Dish name" },
    { name: "rating", label: "Rating", type: "rating" },
    { name: "notes", label: "How did it turn out?", rows: 2, placeholder: "What worked / didn't work?" },
    { name: "makeAgain", label: "Would you make it again?", type: "choice", options: ["Yes, definitely 😊", "Maybe", "Not this time 😅"] },
    { name: "future", label: "Anything you'd do differently next time?", rows: 2, placeholder: "Notes for future you..." },
  ],
  movies: [
    { name: "title", label: "What did you watch?", rows: 1, placeholder: "Movie / Show / Documentary" },
    { name: "takeaway", label: "What stayed with you after the credits rolled?", rows: 2, placeholder: "A scene, a dialogue, a moment..." },
    { name: "quote", label: "One takeaway / favourite quote", rows: 2, placeholder: "Something you want to remember..." },
  ],
  books: [
    { name: "title", label: "What book did you read?", rows: 1, placeholder: "Book title" },
    { name: "author", label: "Author", rows: 1, placeholder: "Author name" },
    { name: "lesson", label: "What page are you taking with you?", rows: 2, placeholder: "A quote, a lesson, a thought..." },
    { name: "feeling", label: "How did this book make you feel?", type: "choice", options: ["Loved it 💗", "Liked it 😊", "It was okay", "Not for me"] },
  ],
};