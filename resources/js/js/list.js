function scrollContainer(button, direction) {
  // Get the parent container of the button
  const container = button.parentElement.querySelector('.movie-containerlist');
  if (container) {
    const scrollAmount = container.offsetWidth * 0.8; // Adjust scrolling distance
    container.scrollBy({
      left: direction * scrollAmount,
      behavior: 'smooth'
    });
  }
}