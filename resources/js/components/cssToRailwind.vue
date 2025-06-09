<div class="pagination">
    <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
    <span>Page {{ currentPage }} of {{ totalPages }}</span>
    <button @click="nextPage" :disabled="currentPage >= totalPages">Next</button>
</div>

<style scoped>
.pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 20px 0;
    padding: 15px 20px;
  }
  
  .pagination button {
    background-color: #fff; /* Clean button background */
    color: #333; /* Dark text for contrast */
    border: 1px solid #ccc; /* Subtle border */
    padding: 8px 16px;
    margin: 0 10px; /* Spacing between buttons and text */
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s ease-in-out; /* Smooth transition for hover effect */
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    outline: none; /* Remove focus outline */
  }
  
  .pagination button:hover {
    background-color: #363636; /* Light gray on hover */
    border-color: #bbb;
    color: #ffffff;
  }
  
  .pagination button:active {
    box-shadow: 0 0 0 rgba(0, 0, 0, 0.1); /* Slight "push" effect */
    transform: translateY(1px);
  }
  
  .pagination button:disabled {
    opacity: 0.5; /* Indicate disabled state */
    cursor: not-allowed;
    background-color: #eee;
    color: #777;
    border-color: #ddd;
    box-shadow: none;
    transform: none;
  }
  
  .pagination span {
    font-size: 14px;
    color: #555; /* Slightly darker text for readability */
  }
</style>

convert to full tailwind with dark mode and light mode support
