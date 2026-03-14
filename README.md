# Todo app solution

This is a solution to the Todo app challenge.

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
- [Authors](#authors)

## Overview

### The challenge

Users should be able to:

- View the optimal layout for the app depending on their device's screen size
- See hover states for all interactive elements on the page
- Add new todos to the list
- Mark todos as complete
- Delete todos from the list
- Filter by all/active/complete todos
- Search for specific todos
- View a dashboard with total, active, and completed todo metrics
- See the most recent active tasks
- Add new tasks via a Floating Action Button (FAB)

### Screenshot

![Dashboard - No Todo](/assets/screenshots/image.png)
![Adding a Todo](/assets/screenshots/image-1.png)
![Dashboard - Recent Todos](/assets/screenshots/image-2.png)
![Confirmation Modal](/assets/screenshots/image-3.png)
![Updated Todo with Toast Notification](/assets/screenshots/image-4.png)
![Editing a Todo](/assets/screenshots/image-5.png)
![Deleting a Todo](/assets/screenshots/image-6.png)
![Overview of all todo with Filtering and search](/assets/screenshots/image-7.png)

### Links

- Github URL: [Todo Repository](https://github.com/dada-stephen/todo)
- Live Site URL: [Todo App](https://todo-stephen-blessing.vercel.app/)

## My process

### Built with

- Semantic HTML5 markup
- CSS custom properties
- Flexbox
- CSS Grid
- Mobile-first workflow
- Vanilla JavaScript (ES Modules)
- Component-Based Architecture

### What I learned

Building this application helped reinforce my knowledge of Vanilla JavaScript and modern web development practices without relying on libraries or frameworks. Specifically:

- **ES Modules**: Splitting code into smaller, reusable components, services, and utilities (`import` and `export`) makes the application much cleaner and easier to maintain.
- **State Management**: Managing active, completed, and total todos arrays dynamically based on user interaction.
- **Custom UI Components**: Creating custom floating action buttons (FAB), toast notifications, and confirmation modals using standard DOM manipulation and CSS.

Here is a snippet showing the structured approach to refreshing the UI based on state changes:

```js
const refresh = () => {
  const allTodos = service.getAll();
  const completedTodos = service.getCompleted();
  const activeTodos = allTodos.filter((todo) => !todo.completed);

  // Recent: first 5 active
  const recentActive = activeTodos.slice(0, 5);
  cardsRecent.render(recentActive);

  // ... filter and search logic
}
```

### Continued development

In future projects, I want to continue refining my skills in:
- Connecting Vanilla JS applications to backend REST APIs
- Further improving mobile accessibility and smooth layout animations.
- Implementing drag-and-drop to reorder lists on the page.

## Authors

- GitHub - [Stephen Dada](https://github.com/dada-stephen)
- GitHub - [Blessing Ogodogu](https://github.com/BlessingOgodogu)
