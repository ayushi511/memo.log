export const fieldsConfig = {
  journal: [
    { name: "happened", label: "What happened today?" },
    { name: "smile", label: "What made me smile?" },
    { name: "frustrated", label: "What frustrated me?" },
    { name: "learned", label: "What did I learn?" },
    { name: "tomorrow", label: "One thing I want tomorrow" },
  ],
  psychology: [
    { name: "observation", label: "What did you notice?", rows: 4 },
  ],
  creative: [
    { name: "title", label: "Title", rows: 1 },
    { name: "description", label: "Description", rows: 3 },
  ],
  kitchen: [
    { name: "dish", label: "Dish", rows: 1 },
    { name: "rating", label: "Rating", type: "rating" },
    { name: "notes", label: "What worked / didn't, would I cook again?", rows: 3 },
  ],
  movies: [
    { name: "title", label: "Movie", rows: 1 },
    { name: "takeaway", label: "One takeaway / favourite quote or scene", rows: 3 },
  ],
  books: [
    { name: "title", label: "Book", rows: 1 },
    { name: "lesson", label: "Favourite quote / biggest lesson", rows: 3 },
  ],
};