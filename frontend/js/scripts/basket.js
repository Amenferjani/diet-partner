function updateBasketItemCount() {
    const basketItemCount = parseInt(localStorage.getItem('basketItemCount')) || 0;
    const basketItemIcon = document.getElementById('basket-item-count');
    
    // Update the item count in the local storage
    localStorage.setItem('basketItemCount', basketItemCount.toString());
    console.log("basketItemCount",basketItemCount)
    // Update the item count displayed in the basket icon
    basketItemIcon.textContent = basketItemCount.toString();
}

window.addEventListener("load",updateBasketItemCount);
